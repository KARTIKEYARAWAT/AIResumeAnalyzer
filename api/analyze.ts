import { prepareInstructions } from '../constants/index.js';
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
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }), { status: 405 });
    }

    try {
        const body = await req.json();
        const { resumeText, jobTitle, jobDescription, userId } = body;

        // 1. Validation
        if (!userId) {
            return new Response(JSON.stringify({ success: false, error: 'User ID is required', code: 'INVALID_INPUT' }), { status: 400 });
        }
        if (!resumeText || !resumeText.trim()) {
            return new Response(JSON.stringify({ success: false, error: 'Resume text is required and cannot be empty', code: 'INVALID_INPUT' }), { status: 400 });
        }
        if (resumeText.length > 50 * 1024) { // 50KB character limit
            return new Response(JSON.stringify({ success: false, error: 'Resume text is too large (maximum size is 50KB)', code: 'INVALID_INPUT' }), { status: 400 });
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
        const remaining = Math.max(0, DAILY_LIMIT - currentCount);

        if (currentCount >= DAILY_LIMIT) {
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: `Daily analysis limit reached. You have used ${currentCount} of ${DAILY_LIMIT} today. Resets at midnight UTC.`,
                    code: 'RATE_LIMIT_EXCEEDED',
                    remainingDailyRequests: 0
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

        const newRemaining = Math.max(0, remaining - 1);

        // 3. Prepare Prompts
        const systemPrompt = prepareInstructions({ jobTitle: jobTitle || '', jobDescription: jobDescription || '' });
        const userPrompt = `Here is the text extracted from the resume:\n\n${resumeText}`;

        // 4. Call AI Providers with fallback
        let feedbackText = '';

        try {
            feedbackText = await callGemini(systemPrompt, userPrompt);
        } catch (geminiError) {
            console.warn('Gemini failed, falling back to Groq:', geminiError);
            try {
                feedbackText = await callGroq(systemPrompt, userPrompt);
            } catch (groqError) {
                console.warn('Groq failed, falling back to OpenRouter:', groqError);
                try {
                    feedbackText = await callOpenRouter(systemPrompt, userPrompt);
                } catch (orError) {
                    console.error('All AI providers failed:', orError);
                    return new Response(
                        JSON.stringify({ 
                            success: false, 
                            error: 'All AI feedback providers are currently unavailable. Please try again in a few minutes.', 
                            code: 'AI_PROVIDER_ERROR' 
                        }), 
                        { status: 502 }
                    );
                }
            }
        }

        // 5. Clean and parse JSON
        const cleanJson = feedbackText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        let feedbackJson;
        try {
            feedbackJson = JSON.parse(cleanJson);
        } catch (parseError) {
            console.error("Failed to parse AI output as JSON:", parseError);
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: 'Analysis returned invalid formatting structure. Please retry.', 
                    code: 'AI_PROVIDER_ERROR' 
                }), 
                { status: 500 }
            );
        }

        // Inject remaining rate limit into returned object
        feedbackJson.remainingDailyRequests = newRemaining;

        return new Response(JSON.stringify(feedbackJson), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Analyze function error:', error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: 'An internal server error occurred while analyzing the resume.', 
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
    const id = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: { response_mime_type: "application/json" }
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
            ],
            response_format: { type: "json_object" }
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
