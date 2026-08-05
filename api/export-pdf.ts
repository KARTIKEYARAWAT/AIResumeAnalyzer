import { jsPDF } from 'jspdf';

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }), 
            { status: 405 }
        );
    }

    try {
        const { resumeText, pageSize } = await req.json();
        
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

        const format = pageSize === "US_Letter" ? "letter" : "a4";
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: format
        });

        const margin = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const maxLineWidth = pageWidth - (margin * 2);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.5);

        const lines = doc.splitTextToSize(resumeText, maxLineWidth);
        
        let cursorY = margin;
        const lineHeight = 5.5;

        for (let i = 0; i < lines.length; i++) {
            if (cursorY + lineHeight > pageHeight - margin) {
                doc.addPage();
                cursorY = margin;
            }
            doc.text(lines[i], margin, cursorY);
            cursorY += lineHeight;
        }

        const pdfArrayBuffer = doc.output('arraybuffer');

        return new Response(pdfArrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="resume.pdf"'
            }
        });

    } catch (error: any) {
        console.error("PDF export error:", error);
        return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to generate PDF", code: 'INTERNAL_SERVER_ERROR' }), 
            { status: 500 }
        );
    }
}
