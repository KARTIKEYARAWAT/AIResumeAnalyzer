import { createClient } from '@supabase/supabase-js';

export const config = {
    runtime: 'edge',
};

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const DAILY_LIMIT = 50;

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }), { status: 405 });
    }

    try {
        const body = await req.json();
        const { bulletText, jobTitle, jobDescription, userId } = body;

        // 1. Validation
        if (!userId) {
            return new Response(JSON.stringify({ success: false, error: 'User ID is required', code: 'INVALID_INPUT' }), { status: 400 });
        }
        if (!bulletText || !bulletText.trim()) {
            return new Response(JSON.stringify({ success: false, error: 'Bullet text is required', code: 'INVALID_INPUT' }), { status: 400 });
        }
        if (bulletText.length > 5000) { // Keep single bullet within reasonable range
            return new Response(JSON.stringify({ success: false, error: 'Bullet text exceeds maximum size limit (5KB)', code: 'INVALID_INPUT' }), { status: 400 });
        }

        // 2. Check Rate Limit
        const today = new Date().toISOString().split('T')[0];
        const { data: usageData, error: usageError } = await supabase
            .from('daily_requests')
            .select('count')
            .eq('user_id', userId)
            .eq('request_date', today)
            .maybeSingle();

        if (usageError) {
            console.error('Usage check error:', usageError);
        }

        const currentCount = usageData?.count || 0;
        if (currentCount >= DAILY_LIMIT) {
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: `Daily rewrite limit reached (${DAILY_LIMIT} total requests allowed per day).`, 
                    code: 'RATE_LIMIT_EXCEEDED' 
                }), 
                { status: 429 }
            );
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

        // 3. Prompts
        const systemPrompt = `You are an expert resume writer. Please rewrite the following resume bullet point to make it more impactful, using strong action verbs, quantifiable metrics where possible, and tailoring it to the provided job context if available.
Job Title: ${jobTitle || 'Not provided'}
Job Description: ${jobDescription || 'Not provided'}
Output only the rewritten bullet point text, nothing else.`;
        
        const userPrompt = `Bullet point to rewrite:\n\n${bulletText}`;

        // 4. Call AI Providers with fallback
        let rewrittenText = '';

        try {
            rewrittenText = await callGemini(systemPrompt, userPrompt);
        } catch (geminiError) {
            console.warn('Gemini failed, falling back to Groq:', geminiError);
            try {
                rewrittenText = await callGroq(systemPrompt, userPrompt);
            } catch (groqError) {
                console.warn('Groq failed, falling back to OpenRouter:', groqError);
                try {
                    rewrittenText = await callOpenRouter(systemPrompt, userPrompt);
                } catch (orError) {
                    console.error('All AI providers failed:', orError);
                    return new Response(
                        JSON.stringify({ 
                            success: false, 
                            error: 'All AI rewrite providers are currently down. Please retry.', 
                            code: 'AI_PROVIDER_ERROR' 
                        }), 
                        { status: 502 }
                    );
                }
            }
        }

        return new Response(JSON.stringify({ success: true, rewrittenText: rewrittenText.trim() }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Rewrite function error:', error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: 'An internal server error occurred while rewriting.', 
                code: 'INTERNAL_SERVER_ERROR' 
            }), 
            { status: 500 }
        );
    }
}

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userPrompt }] }]
        })
    });

    clearTimeout(id);
    if (!response.ok) throw new Error(`Gemini status: ${response.status}`);
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

async function callGroq(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not set");

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 15000);

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
    if (!response.ok) throw new Error(`Groq status: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
}

async function callOpenRouter(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 15000);

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
    if (!response.ok) throw new Error(`OpenRouter status: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
}
