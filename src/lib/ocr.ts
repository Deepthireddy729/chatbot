import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(base64: string): Promise<string> {
    try {
        const worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize(`data:image/png;base64,${base64}`);
        await worker.terminate();
        return text;
    } catch (error) {
        console.error('Error in OCR:', error);
        return "";
    }
}
