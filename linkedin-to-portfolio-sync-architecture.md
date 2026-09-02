# Architecture: Manual-Trigger LinkedIn → Letterboxd-Style Portfolio Sync

**Status:** Draft v1
**Owner:** Ikan
**Last updated:** 2026-09-02

---

## 1. Decision Summary

| Option (from brainstorming doc) | Verdict | Reason |
|---|---|---|
| Option 1 — Proxycurl / scraper API | ❌ Rejected | Paid, ToS-risk, unreliable for real-time posts |
| Option 2 — Chrome extension DOM scraper | ⏸️ Optional add-on later | Fragile (breaks when LinkedIn changes DOM), only fires when browser is open |
| Option 3 — Zapier / Make.com | ❌ Rejected | Personal profile posts are not supported, only Company Pages |
| **Option 4 — Push-based webhook + AI structuring** | ✅ **Chosen** | 100% reliable, zero scraping/ToS risk, and the "raw text → structured poster" step becomes a *feature*, not a workaround |

**Core idea:** Instead of pulling data out of LinkedIn (which is deliberately hard), you push a short raw update into a single entry point (a form or a Telegram bot). That entry point fans out to two places at once: (a) it becomes your LinkedIn post as usual, and (b) it triggers a webhook that uses an LLM to reshape the raw text into the exact schema your Letterboxd-style UI expects, then writes it to Supabase.

This document specifies that pipeline end-to-end: schema, API contract, prompt spec, error handling, and a step-by-step build order — written to be followed literally with no guesswork.

---

## 2. High-Level Flow Diagram (text form)

```
[You write one raw update]
        │
        ▼
[Entry Point: Web Form  OR  Telegram Bot]  (pick ONE for v1 — see Section 3)
        │
        ├──► (manual/separate action) You paste/post the same text to LinkedIn
        │
        ▼
[POST /api/sync-entry]  (Next.js API Route)
        │
        ▼
[Step A: Validate payload]
        │
        ▼
[Step B: Call LLM (Claude API) with STRUCTURING_PROMPT]
        │        → returns strict JSON: { title, description, tech_stack[], rating, poster_style_prompt }
        ▼
[Step C: Resolve poster image]
        │   - if user attached an image URL → use it as cover_url
        │   - else → generate placeholder poster via /api/generate-poster (Vercel OG image)
        ▼
[Step D: Insert row into Supabase `projects` table]
        │
        ▼
[Step E: Return success/failure JSON to entry point]
        │
        ▼
[Frontend: Next.js portfolio fetches from Supabase, renders as "poster card"]
```

**Important:** There is intentionally NO step that reads FROM LinkedIn. LinkedIn is only ever a *destination you post to manually*, never a *data source you fetch from*. This is what makes the pipeline reliable — it removes the entire "closed API / anti-scraping" problem class described in the brainstorming doc.

---

## 3. Entry Point — Choose ONE for v1

Do not build both at once. Pick based on where you'll actually remember to use it.

### 3A. Web Form (simplest, recommended for v1)
- A single `/admin/new-entry` page on your own Next.js portfolio, protected by a simple password or Supabase Auth (just you using it).
- Fields: `raw_text` (textarea), `image` (optional file upload), `manual_rating` (optional, 1–5, blank = let AI decide).
- Submits directly to `/api/sync-entry`.
- Pros: no third-party dependency, fastest to build, fully within your own stack.
- Cons: you have to remember to open your own site.

### 3B. Telegram Bot (more "ambient," slightly more setup)
- A private Telegram bot (via `node-telegram-bot-api` or Telegram Bot API directly) that only responds to your Telegram user ID.
- You send it a message (text + optional photo) → bot forwards it as a POST to `/api/sync-entry`.
- Pros: you can log an update from your phone in 10 seconds, feels closer to "posting."
- Cons: one more service (bot token, hosting the listener — can be a Vercel serverless function with a webhook URL set via Telegram's `setWebhook`).

**Recommendation:** Build 3A first. It's a strict subset of the same backend logic — the only thing that changes later if you add 3B is *what calls* `/api/sync-entry`, not the pipeline itself. This keeps risk low and matches "reduce error" priority.

---

## 4. Supabase Schema

### Table: `projects`

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tech_stack text[] not null default '{}',
  rating numeric(2,1) not null check (rating >= 0 and rating <= 5),
  cover_url text,
  source_raw_text text not null,       -- original unstructured input, kept for audit/debug
  source_type text not null default 'manual_form',  -- 'manual_form' | 'telegram' | 'chrome_extension'
  linkedin_post_url text,              -- optional, fill in manually later if you want to link back
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_created_at_idx on projects (created_at desc);
```

**Field notes (read carefully — this is where mismatches usually happen):**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | text | yes | Short, punchy — LLM should keep this under ~60 chars |
| `description` | text | yes | 1–3 sentences, cleaned-up version of raw text |
| `tech_stack` | text[] (Postgres array) | yes | e.g. `{"Next.js","Supabase","TailwindCSS"}` — must be an actual array type, not a comma-separated string, or the frontend array-mapping will break |
| `rating` | numeric(2,1) | yes | 0.0–5.0, one decimal place (Letterboxd-style half-stars) |
| `cover_url` | text | no (nullable) | If null, frontend should fall back to a generated placeholder poster, not crash |
| `source_raw_text` | text | yes | ALWAYS store the original input verbatim, even after transformation — this is your undo/debug trail |
| `source_type` | text | yes | Lets you filter later if you add more entry points |

---

## 5. API Route Spec: `POST /api/sync-entry`

**File location:** `app/api/sync-entry/route.ts` (Next.js App Router)

### Request body (JSON)

```json
{
  "raw_text": "Just shipped a ZK-based identity verifier for the Stellar hackathon, built with Next.js, Soroban contracts, and a custom circuit in Circom. Took about 48 hours.",
  "image_url": "https://optional-uploaded-image-url.com/pic.jpg",
  "manual_rating": null
}
```

| Field | Required | Notes |
|---|---|---|
| `raw_text` | yes | The unstructured update. Min 10 characters, reject if empty. |
| `image_url` | no | If provided, skip placeholder generation and use directly as `cover_url`. |
| `manual_rating` | no | If provided (0–5), skip AI-guessed rating and use this instead. |

### Response body (success, HTTP 200)

```json
{
  "ok": true,
  "project": {
    "id": "uuid-here",
    "title": "ZK Identity Verifier",
    "description": "A zero-knowledge identity verification system built for a Stellar hackathon.",
    "tech_stack": ["Next.js", "Soroban", "Circom"],
    "rating": 4.5,
    "cover_url": "https://.../generated-or-uploaded.png"
  }
}
```

### Response body (failure, HTTP 4xx/5xx)

```json
{
  "ok": false,
  "error_code": "LLM_PARSE_FAILED",
  "message": "The structuring step returned invalid JSON after 2 retries.",
  "raw_text_preserved": true
}
```

**Critical error-handling rule:** Even if the LLM structuring step (Step B) fails, the API route MUST still save a fallback row to Supabase with `title = "Untitled Update"`, `description = raw_text` (truncated to 300 chars), `tech_stack = []`, `rating = 0`, and `source_type` unchanged. **Never lose the raw input.** You can go back and manually fix/re-run structuring later. This directly serves your "reduce error / no confusion" goal — nothing silently disappears.

### Step-by-step pseudocode for the route handler

```
1. Parse and validate request body.
   - if raw_text missing or < 10 chars → return 400 { ok: false, error_code: "INVALID_INPUT" }

2. Call the LLM structuring function (see Section 6) with raw_text.
   - wrap in try/catch
   - if it throws OR returns invalid JSON → 
       a. still insert a FALLBACK row (see rule above)
       b. return 200 with ok: false, error_code: "LLM_PARSE_FAILED", but include the fallback project id

3. If image_url was provided in the request → use it as cover_url directly, skip step 4.

4. If no image_url → call /api/generate-poster (Section 7) with 
   { title, tech_stack } → get back a generated poster URL → use as cover_url.

5. If manual_rating was provided → override the LLM's guessed rating with it.

6. Insert final row into Supabase `projects` table via the Supabase JS client
   (server-side, using the service_role key — NEVER expose this key to the client).

7. Return 200 { ok: true, project: {...} }.
```

---

## 6. LLM Structuring Step — Exact Prompt Spec

This is the piece that turns "generic LinkedIn post" into "structured Letterboxd movie review format," which was the open question at the end of the brainstorming doc.

**Model call:** Use the Claude API (`claude-sonnet-4-6`), NOT a browser-side call — this must run server-side inside the API route so your API key stays secret.

### System prompt (send as the system parameter)

```
You are a strict data-structuring engine. You convert a raw, informal project
update (originally written for a LinkedIn post) into a fixed JSON schema for a
portfolio site styled like a movie-review app (Letterboxd-style "posters" for
software projects).

Rules:
- Output ONLY valid JSON. No markdown fences, no preamble, no explanation.
- "title": max 60 characters, punchy, no trailing period.
- "description": 1-3 sentences, cleaned up from the raw text, third-person or
  neutral tone, max 300 characters.
- "tech_stack": an array of short strings (framework/language/tool names only,
  no sentences). Extract only tools explicitly mentioned or unambiguously
  implied by the raw text. If none are mentioned, return an empty array — do
  not invent technologies.
- "rating": a number between 0.0 and 5.0 in increments of 0.5, representing
  your best-guess "effort/complexity/polish" score based on the raw text
  (e.g. hackathon MVP in 24h = lower, a polished multi-week project = higher).
  This is a heuristic, not a fact — always populate it, never null.
- "poster_style_prompt": a short (max 20 words) visual description suitable
  for generating a poster-style cover image for this project, evoking a movie
  poster mood appropriate to the project's theme.

Return exactly this JSON shape and nothing else:
{
  "title": string,
  "description": string,
  "tech_stack": string[],
  "rating": number,
  "poster_style_prompt": string
}
```

### User message (send as the messages parameter)

```
Raw update:
"""
{{raw_text}}
"""
```

### Handling the response — do this exactly

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    system: STRUCTURING_SYSTEM_PROMPT, // the block above
    messages: [
      { role: "user", content: `Raw update:\n"""\n${raw_text}\n"""` }
    ]
  })
});

const data = await response.json();
const textBlock = data.content.find(b => b.type === "text");
if (!textBlock) throw new Error("No text block returned");

// Defensive cleanup in case the model adds fences despite instructions
const cleaned = textBlock.text.replace(/```json|```/g, "").trim();

let structured;
try {
  structured = JSON.parse(cleaned);
} catch (e) {
  throw new Error("LLM_PARSE_FAILED: invalid JSON");
}

// Validate required keys exist before trusting the object
const requiredKeys = ["title", "description", "tech_stack", "rating", "poster_style_prompt"];
for (const key of requiredKeys) {
  if (!(key in structured)) throw new Error(`LLM_PARSE_FAILED: missing key ${key}`);
}
```

**Retry policy:** If parsing fails, retry the API call ONCE with an appended instruction: `"Your previous output was not valid JSON. Return ONLY the raw JSON object, nothing else."` If it fails a second time, fall through to the fallback-row behavior in Section 5.

---

## 7. Poster Image Generation (fallback when no image is attached)

**Endpoint:** `GET /api/generate-poster?title=...&tech=...`
**Library:** `@vercel/og` (works natively in Next.js Edge Runtime)

Purpose: produce a consistent "movie poster" placeholder image (title + tech badges + a themed gradient background) so `cover_url` is never broken/missing even if you didn't attach a screenshot.

```javascript
// app/api/generate-poster/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Untitled Project";
  const tech = (searchParams.get("tech") || "").split(",").filter(Boolean);

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "flex-end", padding: 40,
        background: "linear-gradient(135deg, #1a1a2e, #16213e)"
      }}>
        <div style={{ fontSize: 48, color: "white", fontWeight: 700 }}>{title}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {tech.map(t => (
            <div key={t} style={{
              fontSize: 20, color: "#eee", background: "rgba(255,255,255,0.15)",
              padding: "4px 12px", borderRadius: 999
            }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    { width: 600, height: 900 } // vertical poster aspect ratio, matches Letterboxd
  );
}
```

This URL (`/api/generate-poster?title=X&tech=A,B,C`) can be used directly as `cover_url` — you don't even need to save the generated image to storage for v1, since it's regenerated on demand from stored `title`/`tech_stack` fields (only do this if you're okay with the poster changing style over time when you tweak the template — otherwise render once and upload to Supabase Storage).

---

## 8. Frontend Render Contract

Whatever component renders the "poster card" in your Letterboxd clone should assume this exact shape coming from Supabase (via `supabase.from('projects').select('*').order('created_at', { ascending: false })`):

```typescript
type Project = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  rating: number;       // 0.0–5.0
  cover_url: string | null;
  created_at: string;
};
```

**Defensive rendering rules (prevents crashes from partial/fallback rows):**
- If `cover_url` is null → render the `/api/generate-poster` URL on the fly using `title` + `tech_stack`, don't leave a broken `<img>`.
- If `tech_stack` is an empty array → render nothing in the tech-badge row, don't show "undefined".
- If `rating` is `0` → treat as "unrated," maybe render empty stars rather than implying a bad review.

---

## 9. Build Order (do these in sequence, test after each step)

1. **Supabase:** Create the `projects` table with the exact schema in Section 4. Insert one row manually via the Supabase dashboard to confirm the frontend can already read and render it correctly. *(Validates Steps D + Frontend render before any automation exists.)*
2. **Poster generator:** Build `/api/generate-poster` in isolation, hit it directly in a browser with query params, confirm the image renders. *(Validates Section 7 alone.)*
3. **LLM structuring function:** Build a standalone script (not yet wired to the API route) that takes a hardcoded `raw_text` string, calls the Claude API, and `console.log`s the parsed JSON. Test with 3–4 different sample raw texts (short, long, no-tech-mentioned, multiple-tech-mentioned) to see how the model behaves. *(Validates Section 6 alone, catches prompt issues early and cheaply.)*
4. **Wire the API route:** Combine steps 1–3 into `/api/sync-entry` per Section 5's pseudocode, including the fallback-row error path. Test with Postman/curl before building any UI.
5. **Entry point (3A form):** Build the simple `/admin/new-entry` page last, since it's just a thin UI over an already-tested API route.
6. **(Optional, later) Telegram bot / Chrome extension:** Only after the above is stable for a few real entries.

Testing in this order means that if something breaks, you'll know immediately *which layer* broke, instead of debugging five new moving parts at once — directly addresses your "avoid confusion" ask.

---

## 10. Explicit Non-Goals for v1 (to prevent scope creep / confusion later)

- ❌ No fetching/reading from LinkedIn's API or DOM in this version.
- ❌ No real-time/automatic detection of new LinkedIn posts.
- ❌ No Chrome extension yet (that's a v2 "ambient sync" nice-to-have, not required for the pipeline to work).
- ❌ No multi-user support — this is single-user (you), so auth on the entry point can be minimal (a shared secret/password is enough).

---

## 11. Open Decisions You Still Need to Make

| Decision | Options | Notes |
|---|---|---|
| Entry point for v1 | Web form vs Telegram bot | Recommend web form (Section 3A) |
| Poster storage | Generate-on-demand vs generate-once-and-upload to Supabase Storage | Generate-once is more stable if you plan to redesign the poster template later |
| Auth on `/admin/new-entry` | Simple shared password vs Supabase Auth | Shared password is fine for single-user v1 |
| LLM rating heuristic | Fully AI-guessed vs always manual | Recommend: AI guesses, but `manual_rating` field lets you override per-entry |
