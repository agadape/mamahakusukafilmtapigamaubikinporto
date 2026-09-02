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

    // 1. Dinamis mencari model yang tersedia (anti-usang)
    const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const modelsData = await modelsRes.json();
    
    if (!modelsData.models) {
      throw new Error("Failed to list Gemini models: " + JSON.stringify(modelsData));
    }

    // Cari model yang mendukung generateContent
    const availableModels = modelsData.models.filter((m: any) => 
      m.supportedGenerationMethods?.includes("generateContent")
    );
    
    // Prioritaskan model "flash", lalu "pro"
    let selectedModel = availableModels.find((m: any) => m.name.includes("flash"));
    if (!selectedModel) {
      selectedModel = availableModels.find((m: any) => m.name.includes("pro"));
    }
    if (!selectedModel) {
      selectedModel = availableModels[0];
    }

    const prompt = `
    You are a strict data-structuring engine. Convert a raw, informal project update into JSON.
    Return ONLY a raw JSON object, no markdown formatting, no backticks, no preamble.

    Expected JSON schema:
    {
      "title": "String (max 60 chars)",
      "description": "String (1-3 sentences)",
      "tech_stack": ["Array", "of", "strings"],
      "rating": Number (1.0 to 5.0)
    }
    
    Raw update:
    "${raw_text}"
    `;

    // 2. Eksekusi menggunakan model yang valid
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${selectedModel.name}:generateContent?key=${apiKey}`, {
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
