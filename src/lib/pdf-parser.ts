// Polyfill DOMMatrix for pdf.js before pdf-parse requires it
if (typeof global !== 'undefined' && !(global as any).DOMMatrix) {
    (global as any).DOMMatrix = class DOMMatrix { };
}

// Safely require pdf-parse now that the global environment is prepared
export default async function parsePdf(buffer: Buffer) {
    const pdfModule = await import('pdf-parse');
    const PDFParse = pdfModule.PDFParse || (pdfModule as any).default?.PDFParse;

    if (!PDFParse) {
        throw new Error('PDFParse class is not found in pdf-parse module');
    }

    // v2 API usage
    const parser = new PDFParse({ data: buffer });
    try {
        const result = await parser.getText();
        return result; // Has .text property which parse/route.ts depends on
    } finally {
        await parser.destroy();
    }
}
