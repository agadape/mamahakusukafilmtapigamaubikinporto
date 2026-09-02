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
    You are a strict data-structuring engine. Convert a raw, informal update (originally a LinkedIn post) into JSON.
    First, determine if the update is about a software PROJECT, a work/org EXPERIENCE, or a CERTIFICATE/credential.

    Return ONLY a raw JSON object, no markdown formatting, no backticks, no preamble.

    Expected JSON schema:
    {
      "entry_type": "project" | "experience" | "certificate",
      "title": "String (Project name, Job title, or Certificate name. Max 60 chars)",
      "company_or_issuer": "String (Company name or Certificate Issuer like AWS/Coursera. Empty if it's just a personal project)",
      "description": "String (1-3 sentences, third-person or neutral)",
      "tech_stack": ["Array", "of", "skills/tech mentioned"],
      "date_range": "String (e.g., '2023 - Present', 'July 2026', or '2026')",
      "rating": Integer (1 to 5 for project effort. Use null if entry_type is experience or certificate)
    }
    
    Raw update:
    "${raw_text}"
    `;

    // 2. Eksekusi menggunakan model Gemini terbaru (3.6)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0].content) {
      console.error("Gemini API Error:", data);
      throw new Error(data.error?.message || "Invalid response from Gemini");
    }

    let jsonText = data.candidates[0].content.parts[0].text;
    // Bersihkan backticks markdown jika AI masih bandel
    jsonText = jsonText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    const parsed = JSON.parse(jsonText);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Failed to parse with AI" }, { status: 500 });
  }
}
