export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const { resumeText } = await req.json();
        if (!resumeText) {
            return new Response(JSON.stringify({ error: 'Missing resumeText' }), { status: 400 });
        }

        const systemPrompt = `You are a resume parser. Convert the following unstructured resume text into a structured JSON format.
Ensure you return strictly a JSON object matching this structure:
{
  "summary": "Professional summary...",
  "experiences": [
    {
      "company": "Company Name",
      "jobTitle": "Job Title",
      "startDate": "Start Date",
      "endDate": "End Date",
      "description": "Job descriptions and bullets...",
      "location": "Location"
    }
  ],
  "educations": [
    {
      "school": "University/School Name",
      "degree": "Degree (e.g. BS, MS)",
      "field": "Field of Study",
      "graduationDate": "Graduation Date",
      "details": "GPA, honors, courses..."
    }
  ],
  "skills": "Skill1, Skill2, Skill3...", // comma-separated list
  "projects": [
    {
      "title": "Project Title",
      "description": "Project description...",
      "link": "https://...",
      "date": "Date"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuer",
      "date": "Date",
      "credentialUrl": "https://..."
    }
  ]
}

If a section is empty or missing, return an empty array or empty string. Do not invent details.
Return ONLY the raw JSON object, without markdown formatting or backticks.`;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ parts: [{ text: `Resume Text:\n\n${resumeText}` }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        if (!response.ok) throw new Error(`Gemini status: ${response.status}`);
        const data = await response.json();
        const cleanJson = data.candidates[0].content.parts[0].text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        return new Response(cleanJson, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err: any) {
        console.error("Parse resume error:", err);
        return new Response(JSON.stringify({ error: err.message || "Failed to parse resume text" }), { status: 500 });
    }
}
