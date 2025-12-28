import axios from 'axios';
import * as cheerio from 'cheerio';

export async function extractTextFromUrl(url: string): Promise<string> {
    try {
        const { data } = await axios.get(url, {
            timeout: 10000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(data);

        // Remove script/style tags
        $('script, style').remove();

        // Extract main text
        const text = $('body').text().replace(/\s\s+/g, ' ').trim();
        return text.slice(0, 10000); // Limit to first 10k chars
    } catch (error) {
        console.error(`Error extracting from URL ${url}:`, error);
        return `Error fetching URL content: ${url}`;
    }
}

export async function getExtraInfo(query: string): Promise<string> {
    try {
        const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
        const data = await res.json();

        let info = "";
        if (data.AbstractText) {
            info += `Abstract: ${data.AbstractText}\n`;
        }
        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            info += "Related Topics Information:\n";
            data.RelatedTopics.slice(0, 3).forEach((topic: any) => {
                if (topic.Text) info += `- ${topic.Text}\n`;
            });
        }
        return info || "No relevant search results found.";
    } catch (error) {
        console.error('Error fetching search info:', error);
        return "";
    }
}
