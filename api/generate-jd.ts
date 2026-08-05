import { createClient } from '@supabase/supabase-js';

export const config = {
    runtime: 'edge',
};

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const DAILY_LIMIT = 5;

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const body = await req.json();
        const { jobTitle, userId } = body;

        if (!userId) {
            return new Response(JSON.stringify({ success: false, error: 'User ID is required' }), { status: 400 });
        }
        if (!jobTitle || !jobTitle.trim()) {
            return new Response(JSON.stringify({ success: false, error: 'Job title is required' }), { status: 400 });
        }

        // Rate Limit Check
        const today = new Date().toISOString().split('T')[0];
        const { data: usageData, error: usageError } = await supabase
            .from('daily_requests')
            .select('count')
            .eq('user_id', userId)
            .eq('request_date', today)
            .maybeSingle();

        const currentCount = usageData?.count || 0;
        if (currentCount >= DAILY_LIMIT) {
            return new Response(
                JSON.stringify({ success: false, error: 'Daily limit reached.' }), 
                { status: 429 }
            );
        }

        const systemPrompt = `You are an expert technical recruiter and HR specialist.
Generate a comprehensive, modern job description for the role of "${jobTitle}".
Crucially, you MUST include the latest, trendy, and cutting-edge technologies, tools, and frameworks currently demanded in the industry for this specific role.
Return ONLY the raw text for the job description. Do not use markdown backticks, but you can use markdown formatting like bullet points and bold text inside the description. Ensure it includes:
- Role Summary
- Key Responsibilities
- Required Skills & Qualifications (Include modern/trendy tech stack)
- Preferred Qualifications`;

        const userPrompt = `Generate a realistic job description for: ${jobTitle} featuring modern tech.`;
        let generatedText = '';

        try {
            generatedText = await callGemini(systemPrompt, userPrompt);
        } catch (geminiError) {
            console.warn('Gemini failed, falling back to Groq:', geminiError);
            try {
                generatedText = await callGroq(systemPrompt, userPrompt);
            } catch (groqError) {
                console.warn('Groq failed, falling back to OpenRouter:', groqError);
                try {
                    generatedText = await callOpenRouter(systemPrompt, userPrompt);
                } catch (orError) {
                    console.error('All AI providers failed:', orError);
                    return new Response(
                        JSON.stringify({ success: false, error: 'All AI providers are currently unavailable due to rate limits. Please try again later.' }), 
                        { status: 502 }
                    );
                }
            }
        }

        // Increment rate limit
        if (usageData) {
            await supabase
                .from('daily_requests')
                .update({ count: currentCount + 1 })
                .eq('user_id', userId)
                .eq('request_date', today);
        } else {
            await supabase
                .from('daily_requests')
                .insert({ user_id: userId, request_date: today, count: 1 });
        }

        return new Response(JSON.stringify({ success: true, jobDescription: generatedText }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Generate JD error:', error);
        return new Response(
            JSON.stringify({ success: false, error: error.message || 'Failed to generate job description.' }), 
            { status: 500 }
        );
    }
}

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userPrompt }] }]
        })
    });

    clearTimeout(id);
    if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

async function callGroq(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not set");

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 20000);

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
            ]
        })
    });

    clearTimeout(id);
    if (!response.ok) throw new Error(`Groq error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
}

async function callOpenRouter(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 20000);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
            model: 'anthropic/claude-3.5-sonnet',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        })
    });

    clearTimeout(id);
    if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
}
