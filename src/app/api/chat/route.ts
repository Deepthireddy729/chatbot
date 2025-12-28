import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { extractTextFromPDF } from '@/lib/pdf';
import { extractTextFromImage } from '@/lib/ocr';
import { extractTextFromUrl, getExtraInfo } from '@/lib/web';

const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

// In-memory session store for side project demo
// NOTE: Vercel serverless functions are stateless.
// Values will persist only as long as the instance stays warm.
const sessionStore = new Map<string, { timestamp: number; messages: any[] }>();

export async function POST(req: Request) {
    try {
        const { messages, data, options = {} } = await req.json();
        const sessionId = req.headers.get('x-session-id') || 'aura-guest';

        if (!process.env.GROQ_API_KEY) {
            return new Response('Configuration Error: Missing API Key', { status: 500 });
        }

        const { webSearch = true, deepThinking = false, links = [] } = options;

        let fileContext = "";
        let searchContext = "";
        let urlContext = "";

        const lastUserMessage = messages[messages.length - 1];

        // 1. Multimodal Extraction (PDF & Image)
        if (data?.files && Array.isArray(data.files)) {
            for (const file of data.files) {
                if (file.type === 'application/pdf') {
                    const buffer = Buffer.from(file.base64, 'base64');
                    const text = await extractTextFromPDF(buffer);
                    if (text) fileContext += `\n[Context: PDF Document "${file.name}"]\n${text.slice(0, 12000)}`;
                } else if (file.type.startsWith('image/')) {
                    const text = await extractTextFromImage(file.base64);
                    if (text) fileContext += `\n[Context: OCR from Image "${file.name}"]\n${text}`;
                }
            }
        }

        // 2. URL Context Extraction
        if (links?.length > 0) {
            for (const url of links) {
                const text = await extractTextFromUrl(url);
                if (text) urlContext += `\n[Context: Scraped Content from ${url}]\n${text}\n`;
            }
        }

        // 3. Selective Web Intelligence
        if (webSearch && lastUserMessage.role === 'user') {
            const triggerWords = ['who', 'what', 'current', 'news', 'latest', 'info', 'define'];
            if (triggerWords.some(word => lastUserMessage.content.toLowerCase().includes(word))) {
                const extraInfo = await getExtraInfo(lastUserMessage.content);
                if (extraInfo) searchContext += `\n[Supplementary Intelligence]\n${extraInfo}`;
            }
        }

        // 4. Message Construction with Context Injectors
        const coreMessages = messages.map((m: any, index: number) => {
            const isLast = index === messages.length - 1;
            if (isLast && m.role === 'user') {
                let content = m.content;
                if (fileContext) content += `\n\n### ATTACHED DATA ###\n${fileContext}`;
                if (urlContext) content += `\n\n### WEB CONTEXT ###\n${urlContext}`;
                if (searchContext) content += `\n\n### EXTERNAL INTEL ###\n${searchContext}`;
                return { role: 'user', content };
            }
            return { role: m.role, content: m.content };
        });

        // 5. Store session for debugging/logging (Ephemeral)
        sessionStore.set(sessionId, { timestamp: Date.now(), messages: coreMessages });

        // 6. Dynamic Model Dispatching
        const modelId = deepThinking ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant';
        const systemInstruction = deepThinking
            ? "You are Aura in Neural Research Mode (Deep Thinking). Break down complexity step-by-step. Be technical, thorough, and highly analytical."
            : "You are Aura, an elite AI assistant. Be professional, concise, and helpful.";

        const result = await streamText({
            model: groq(modelId),
            messages: coreMessages,
            system: systemInstruction,
            temperature: deepThinking ? 0.35 : 0.65,
        });

        return result.toDataStreamResponse();
    } catch (error: any) {
        console.error("Critical API Failure:", error);
        return new Response(JSON.stringify({ error: "Intelligence Engine Unavailable" }), { status: 503 });
    }
}
