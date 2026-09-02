import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { raw_text } = await req.json();

    if (!raw_text || raw_text.length < 10) {
      return NextResponse.json({ error: "Teks terlalu pendek" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key belum di-setting di Vercel" }, { status: 500 });
    }

    const prompt = `
    You are a strict data-structuring engine. Convert a raw, informal project update (originally a LinkedIn post) into a fixed JSON schema for a portfolio site styled like a movie-review app.

    Rules:
    - "title": max 60 characters, punchy, no trailing period.
    - "description": 1-3 sentences, cleaned up from the raw text, third-person or neutral tone, max 300 characters.
    - "tech_stack": array of short strings (framework/language/tool names only). Extract only tools explicitly mentioned or strongly implied. Empty array if none.
    - "rating": a number between 1.0 and 5.0 (increments of 0.5) representing complexity/effort based on the text.
    
    Raw update:
    "${raw_text}"
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              description: { type: "STRING" },
              tech_stack: { type: "ARRAY", items: { type: "STRING" } },
              rating: { type: "NUMBER" }
            },
            required: ["title", "description", "tech_stack", "rating"]
          }
        }
      })
    });

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0].content) {
      console.error(data);
      throw new Error("Invalid response from Gemini");
    }

    const jsonText = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(jsonText);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Failed to parse with AI" }, { status: 500 });
  }
}
