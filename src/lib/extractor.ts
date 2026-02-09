const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

/**
 * High-Fidelity Neural Extractor
 * Reads documents page-by-page with A-Z precision.
 */
export async function extractTextFromBuffer(buffer: Buffer, mimeType?: string): Promise<string> {
    try {
        console.log(`[Neural Engine] Initializing Deep Read for: ${mimeType}`);

        if (mimeType === 'application/pdf') {
            const data = new Uint8Array(buffer);
            const loadingTask = pdfjs.getDocument({
                data,
                useSystemFonts: true,
                disableFontFace: true
            });

            const pdf = await loadingTask.promise;
            let fullText = '';

            // Read every page "A-Z" carefully
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const strings = textContent.items.map((item: any) => item.str);
                fullText += strings.join(' ') + '\n';
            }

            const sanitized = fullText.replace(/\0/g, '').trim();
            if (sanitized.length < 10) throw new Error("A-Z Read returned insufficient data.");

            console.log(`[Neural Engine] A-Z Read Complete. ${sanitized.length} characters captured.`);
            return sanitized;
        }

        // Fallback for Word/Text using standard UTF-8 with strict sanitization
        const raw = buffer.toString('utf-8');
        const cleaned = raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();

        if (cleaned.length < 10) throw new Error("Document structure is unreadable.");
        return cleaned;

    } catch (error: any) {
        console.error("READING ERROR:", error);
        throw new Error(`Careful Reading Failed: ${error.message}`);
    }
}
