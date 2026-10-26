# KnowledgeLens — AI Interview Preparation Guide

This document tracks technical questions, model answers, and interview scenarios aligned with our actual implementation.

---

## Stage 0 & 1 Questions

### Q1: "Why do we keep LLM API calls on the server instead of calling OpenAI/Gemini directly from the React frontend?"
- **Direct Answer:** Security, cost control, and request integrity. Client-side code exposes private API keys to anyone inspecting the network tab or browser bundle.
- **How it works:** Browser calls our Next.js Route Handler (`/api/chat`), which accesses `process.env.OPENAI_API_KEY` in a secure Node.js runtime, validates user input with Zod, and forwards the sanitised payload to the AI provider.
- **Example from our app:** In KnowledgeLens, the frontend only sends conversational messages to `/api/chat`. No provider tokens or SDK credentials are bundled in client JS.
- **Trade-off / Limitation:** Extra network hop (Browser $\rightarrow$ Our Server $\rightarrow$ LLM), which adds slight overhead (~20-50ms), but this is standard and necessary for security.
- **Improvement / Alternative:** Edge runtime route handlers can minimize network hops and TTFT (Time To First Token).

---

### Q2: "What is a token, and why is token budgeting critical in RAG applications?"
- **Direct Answer:** A token is a chunk of characters (letters, subwords, or punctuation) that LLMs process statistically. Token budgeting ensures we don't exceed model context limits, blow through financial budgets, or cause attention degradation.
- **How it works:** When building RAG prompts, we allocate token quotas: e.g., 500 tokens for system rules, 1,500 tokens for retrieved document context, 500 tokens for chat history, and reserve 1,000 tokens for the completion response.
- **Trade-off / Limitation:** If context is truncated too aggressively, important facts are lost. If context is too large, the LLM suffers from the "Lost in the Middle" phenomenon where accuracy drops for facts in the middle of long prompts.
