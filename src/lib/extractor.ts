/**
 * Fast Document Text Extractor V4.0
 * 
 * Uses pdf-parse for PDF extraction — much faster than manual pdfjs-dist
 * because it skips worker setup and handles text assembly internally.
 * 
 * Typical speed: < 1 second for most PDFs (vs 5-15s with pdfjs-dist)
 */
export async function extractTextFromBuffer(buffer: Buffer, mimeType?: string): Promise<string> {
    try {
        const startTime = Date.now();
        console.log(`[Extractor] Processing document: ${mimeType}`);

        let text: string;

        if (mimeType === 'application/pdf') {
            // Fix: Import the internal parser directly to bypass pdf-parse's broken debug code
            // and modern pdfjs-dist worker issues.
            // @ts-ignore
            const pdf = (await import('pdf-parse/lib/pdf-parse.js')).default;
            const result = await pdf(buffer);
            text = result.text;
            console.log(`[Extractor] PDF processed successfully via stable internal parser`);
        } else if (
            mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimeType === 'application/msword'
        ) {
            const mammoth = await import('mammoth');
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            // Plain text / other
            text = buffer.toString('utf-8');
        }

        // Clean up
        const sanitized = text
            .replace(/\0/g, '')              // null bytes
            .replace(/\r\n/g, '\n')          // line endings
            .replace(/\n{4,}/g, '\n\n\n')    // excessive blanks
            .replace(/\t/g, '  ')            // tabs
            .trim();

        if (sanitized.length < 20) {
            throw new Error("Document returned insufficient text content.");
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`[Extractor] Extracted ${sanitized.length} chars in ${elapsed}s`);
        return sanitized;

    } catch (error: any) {
        console.error("EXTRACTOR ERROR:", error);
        throw new Error(`Extraction Failed: ${error.message}`);
    }
}
