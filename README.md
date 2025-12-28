# Aura | Professional Multimodal Research Assistant

Aura is a high-performance AI ecosystem designed for deep research, document analysis, and multimodal intelligence. Built on Next.js 15+ and the Vercel AI SDK, it leverages Groq's Llama 3.3 architecture for ultra-fast, high-fidelity reasoning.

## 🛠 Features
- **Multimodal Intelligence**: 
  - **Dynamic PDF RAG**: Context-aware analysis of uploaded documents.
  - **Neural OCR**: High-accuracy text extraction from images.
  - **Web Intelligence**: Zero-key DuckDuckGo search integration for real-time data.
  - **URL Scraper**: Direct context injection from any public web link.
- **Advanced Control Center**:
  - **Deep Thinking Mode**: Step-by-step technical reasoning using Llama 3.3 70B.
  - **Search Toggle**: Selective real-time information retrieval.
  - **Secure Access**: Private gate authentication (Key: `deepthi`).
- **Session Persistence**: 24-hour ephemeral backend session management.
- **Glassmorphic UI**: High-end aesthetic with premium Outfit typography and mesh gradients.

## 📁 Directory Structure
```text
/
├── src/
│   ├── app/            # Next.js App Router (API & Layout)
│   ├── components/     # UI Components (Chat Engine)
│   └── lib/            # Utility Layer (PDF, OCR, Scrapers, Search)
├── tests/              # E2E Testing Suite (Playwright)
├── playwright.config.ts # Testing Configuration
└── README.md           # Documentation
```

## 🚀 Deployment Guide (Vercel)

### 1. Preparation
Ensure you have a [Groq API Key](https://console.groq.com/keys).

### 2. Deployment Steps
1. Push this repository to your **GitHub** or **GitLab**.
2. Connect the repository to **Vercel**.
3. In the **Environment Variables** section, add:
   - `GROQ_API_KEY`: (Your actual Groq API key)
4. Click **Deploy**.

### 3. Usage
- Navigate to your Vercel URL.
- Enter the Access Key: `deepthi`
- Start your research.

## 🧪 Local Development
```bash
npm install
npm run dev
```

## 🔒 Security Note
This project uses a static access key (`deepthi`) defined in the frontend for demo purposes. For a multi-user production environment, it is recommended to integrate Clerk or NextAuth.

---
*Built for high-fidelity interactive AI research.*
