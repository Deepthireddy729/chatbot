export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        // Lazy load pdf-parse inside the function to avoid build-time issues
        // @ts-ignore
        const pdf = require('pdf-parse');
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        return "";
    }
}
