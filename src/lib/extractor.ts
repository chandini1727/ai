import * as path from 'path';

/**
 * Structure-Preserving Document Extractor
 * 
 * Uses y-position analysis of PDF text items to preserve the document's 
 * actual line-by-line structure — headings stay on their own lines,
 * paragraphs are separated, and lists remain intact.
 */
export async function extractTextFromBuffer(buffer: Buffer, mimeType?: string): Promise<string> {
    try {
        console.log(`[Extractor] Processing document: ${mimeType}`);

        if (mimeType === 'application/pdf') {
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

            const workerPath = path.resolve(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
            const workerUrl = new URL(`file:///${workerPath.replace(/\\/g, '/')}`).href;

            // @ts-ignore
            pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

            const data = new Uint8Array(buffer);
            const loadingTask = pdfjs.getDocument({
                data,
                useSystemFonts: true,
                disableFontFace: true,
            });

            const pdf = await loadingTask.promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const items = textContent.items as any[];

                if (items.length === 0) continue;

                // Build text line-by-line using y-position gaps
                let lastY: number | null = null;
                let lineBuffer = '';

                for (const item of items) {
                    const text = item.str;
                    if (!text || text.trim() === '') {
                        // Empty items often indicate spacing
                        if (item.hasEOL) {
                            fullText += lineBuffer.trimEnd() + '\n';
                            lineBuffer = '';
                            lastY = null;
                        }
                        continue;
                    }

                    const currentY = item.transform ? item.transform[5] : null;

                    if (lastY !== null && currentY !== null) {
                        const yDiff = Math.abs(lastY - currentY);
                        if (yDiff > 2) {
                            // Y-position changed → new line
                            fullText += lineBuffer.trimEnd() + '\n';
                            lineBuffer = '';

                            // Large gap → paragraph break
                            if (yDiff > 15) {
                                fullText += '\n';
                            }
                        }
                    }

                    lineBuffer += text;
                    lastY = currentY;
                }

                // Flush remaining text on the page
                if (lineBuffer.trim()) {
                    fullText += lineBuffer.trimEnd() + '\n';
                }

                // Page break
                fullText += '\n';
            }

            const sanitized = fullText
                .replace(/\0/g, '')        // Remove null bytes
                .replace(/\n{4,}/g, '\n\n\n')  // Cap excessive blank lines
                .trim();

            if (sanitized.length < 20) {
                throw new Error("Document returned insufficient text content.");
            }

            console.log(`[Extractor] Extracted ${sanitized.length} chars with structure preserved.`);
            return sanitized;
        }

        // Plain text / other file types — preserve line breaks
        return buffer.toString('utf-8').replace(/\0/g, '').trim();

    } catch (error: any) {
        console.error("EXTRACTOR ERROR:", error);
        throw new Error(`Extraction Failed: ${error.message}`);
    }
}
