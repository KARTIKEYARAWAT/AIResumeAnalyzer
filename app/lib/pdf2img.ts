export interface PdfConversionResult {
    imageUrls: string[];
    files: File[];
    text?: string;
    error?: string;
}

export async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
    const lib = await loadPdfJs();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n";
    }
    return fullText;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        // Set the worker source to use local file
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;

        const files: File[] = [];
        const imageUrls: string[] = [];
        let fullText = "";

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 4 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            if (context) {
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = "high";
            }

            await page.render({ canvasContext: context!, viewport }).promise;

            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(" ");
            fullText += pageText + "\n";

            const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(resolve, "image/png", 1.0);
            });

            if (blob) {
                const originalName = file.name.replace(/\.pdf$/i, "");
                const imageFile = new File([blob], `${originalName}-page${i}.png`, {
                    type: "image/png",
                });
                files.push(imageFile);
                imageUrls.push(URL.createObjectURL(blob));
            }
        }

        if (files.length === 0) {
            return {
                imageUrls: [],
                files: [],
                error: "Failed to create image blobs for any page.",
            };
        }

        return {
            imageUrls,
            files,
            text: fullText,
        };
    } catch (err) {
        return {
            imageUrls: [],
            files: [],
            error: `Failed to convert PDF: ${err}`,
        };
    }
}
