export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }), 
            { status: 405 }
        );
    }

    try {
        const { resumeText } = await req.json();
        
        // Validation
        if (!resumeText || !resumeText.trim()) {
            return new Response(
                JSON.stringify({ success: false, error: 'Resume text is required', code: 'INVALID_INPUT' }), 
                { status: 400 }
            );
        }
        if (resumeText.length > 50 * 1024) {
            return new Response(
                JSON.stringify({ success: false, error: 'Resume text exceeds maximum size limit (50KB)', code: 'INVALID_INPUT' }), 
                { status: 400 }
            );
        }

        const cleanedText = resumeText
            .split('\n')
            .map((line: string) => line.trim())
            .join('\n');

        return new Response(cleanedText, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Content-Disposition': 'attachment; filename="resume.txt"'
            }
        });

    } catch (error: any) {
        console.error("TXT export error:", error);
        return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to generate TXT", code: 'INTERNAL_SERVER_ERROR' }), 
            { status: 500 }
        );
    }
}
