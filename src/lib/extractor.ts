import mammoth from 'mammoth';

/**
 * Extracts text from a buffer (PDF or DOCX or TXT)
 */
export async function extractTextFromBuffer(buffer: Buffer, mimeType?: string): Promise<string> {
    try {
        if (mimeType === 'application/pdf') {
            // Hot-load pdf-parse to avoid build-time issues with canvas
            const pdf = require('pdf-parse');
            const data = await pdf(buffer);
            return data.text;
        }

        if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword') {
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        }

        // Default to text (handles .txt, etc.)
        return buffer.toString('utf-8');
    } catch (error) {
        console.error("Extraction error:", error);
        throw new Error("Failed to extract text from document");
    }
}
