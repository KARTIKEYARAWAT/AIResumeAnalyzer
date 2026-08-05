export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }), { status: 405 });
    }

    try {
        const body = await req.json();
        const { resumeText, jobTitle, jobDescription } = body;

        // 1. Input validation
        if (!resumeText || !resumeText.trim()) {
            return new Response(JSON.stringify({ success: false, error: 'Resume text is required', code: 'INVALID_INPUT' }), { status: 400 });
        }
        if (resumeText.length > 50 * 1024) { // 50KB limit
            return new Response(JSON.stringify({ success: false, error: 'Resume text exceeds maximum size limit (50KB)', code: 'INVALID_INPUT' }), { status: 400 });
        }

        const systemPrompt = `You are a real-time resume scorer. Analyze the following resume text and quickly estimate scores.
If job context is provided, factor it into the score.
Job Title: ${jobTitle || 'Not provided'}
Job Description: ${jobDescription || 'Not provided'}

Provide the feedback strictly as a JSON object matching this structure:
{
  "overallScore": number, // 0-100
  "categoryScores": {
    "content": number, // 0-100
    "formatting": number, // 0-100
    "grammar": number, // 0-100
    "keywords": number, // 0-100
    "impact": number // 0-100
  },
  "quickIssues": string[] // List of 3-5 high-priority issues detected
}

Return ONLY the raw JSON object, without markdown formatting or backticks.`;

        const userPrompt = `Resume text:\n\n${resumeText}`;

        let resultText = "";
        try {
            // Try Gemini (fast pass, 8s timeout)
            resultText = await callGeminiFast(systemPrompt, userPrompt);
        } catch (geminiErr) {
            console.warn("Gemini fast pass failed, falling back to Groq:", geminiErr);
            try {
                resultText = await callGroqFast(systemPrompt, userPrompt);
            } catch (groqErr) {
                console.warn("Groq fast pass failed, falling back to OpenRouter:", groqErr);
                try {
                    resultText = await callOpenRouterFast(systemPrompt, userPrompt);
                } catch (orErr) {
                    console.error("All fast-pass providers failed:", orErr);
                    // Degrade gracefully as requested
                    return new Response(JSON.stringify({
                        overallScore: 0,
                        categoryScores: { content: 0, formatting: 0, grammar: 0, keywords: 0, impact: 0 },
                        quickIssues: ["Analysis temporarily unavailable right now"]
                    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                }
            }
        }

        const cleanJson = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        let feedbackJson;
        try {
            feedbackJson = JSON.parse(cleanJson);
        } catch (parseError) {
            console.error("Fast analysis JSON parse error:", parseError);
            return new Response(JSON.stringify({
                overallScore: 0,
                categoryScores: { content: 0, formatting: 0, grammar: 0, keywords: 0, impact: 0 },
                quickIssues: ["Parsing error during live check"]
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify(feedbackJson), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err: any) {
        console.error("Analyze fast error:", err);
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: "An internal server error occurred during fast analysis.", 
                code: "INTERNAL_SERVER_ERROR" 
            }), 
            { status: 500 }
        );
    }
}

async function callGeminiFast(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: { response_mime_type: "application/json" }
        })
    });

    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Gemini status: ${response.status}`);
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

async function callGroqFast(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not set");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            response_format: { type: "json_object" }
        })
    });

    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Groq status: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
}

async function callOpenRouterFast(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        })
    });

    clearTimeout(timeout);
    if (!response.ok) throw new Error(`OpenRouter status: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
}
