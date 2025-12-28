# 🚀 Deployment Guide: Aura Chatbot

Aura is an advanced multimodal chatbot built with Next.js, optimized for **Vercel** deployment. This guide covers the steps to get your instance live.

## 🛠 Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **GitHub Repository**: Push your code to a private or public repository.
3.  **Groq API Key**: Obtain your key from the [Groq Console](https://console.groq.com/).

---

## 📦 Deployment Steps

### 1. Push to GitHub
Ensure all your changes are committed and pushed:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Import to Vercel
1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** > **"Project"**.
3.  Import your GitHub repository.

### 3. Configure Environment Variables
During the import process (or in Project Settings > Environment Variables), add the following keys:

| Key | Value | Description |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | `gsk_...` | Your Groq Cloud API Secret |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | (Optional) Your production URL |

### 4. Build and Deploy
Vercel will automatically detect **Next.js**. 
- **Framework Preset**: Next.js
- **Root Directory**: `./` (The project has been restructured to support this)
- **Install Command**: `npm install`
- **Build Command**: `npm run build`

Click **Deploy**.

---

## 🔒 Security & Access
For this project, access is restricted by a hardcoded key.
- **Access Key**: `deepthi`
- **Logic**: Handled in `src/components/Chat.tsx`. Users must enter this key to interact with the neural interface.

---

## ⚡ Performance Optimization
- **Stateless Backend**: The `/api/chat` route uses an ephemeral `sessionStore`. For high-traffic production use, consider integrating **Upstash Redis** for session persistence.
- **Max Duration**: API routes are configured with `export const maxDuration = 30;` to allow for deep reasoning processing.

## 📄 Post-Deployment
Once deployed, Vercel will provide a production URL (e.g., `aura-chatbot.vercel.app`). Verify that the "Deep Thinking" and "Live Search" features are functional by testing the identification key.

---
*Created by [Antigravity](https://github.com/Antigravity-AI)*
