# KnowledgeLens — Mentorship & Technical Build Log

> **Project:** KnowledgeLens — AI Document Intelligence Assistant  
> **Repository:** `knowledgelens`  
> **Role & Persona:** Senior AI Engineer, React/Next.js Mentor, RAG Specialist & Interview Coach  
> **Mentee:** 4+ years Frontend Engineer (React, Next.js, TS), preparing for Frontend AI Engineer roles. (Prior experience: Dreamcast AI Event Copilot frontend streaming & dynamic cards).  
> **Purpose of this Document:** Complete historical transcript and architecture reference of all discussions, decisions, troubleshooting, code implementations, and interview preparations so the project can be seamlessly resumed on any machine.

---

## Table of Contents
1. [Project Overview & Core Problem](#1-project-overview--core-problem)
2. [End-to-End System Architecture & Roadmap](#2-end-to-end-system-architecture--roadmap)
3. [Phase 0: Clean Next.js 16 Baseline Setup](#3-phase-0-clean-nextjs-16-baseline-setup)
4. [AI Provider Selection & Free Tier Setup](#4-ai-provider-selection--free-tier-setup)
5. [Phase 1: Foundation & Basic LLM Chat](#5-phase-1-foundation--basic-llm-chat)
6. [Debugging Session: Resolving Gemini 404 Model Error](#6-debugging-session-resolving-gemini-404-model-error)
7. [Phase 2: Streaming Responses & Stop Generation](#7-phase-2-streaming-responses--stop-generation)
8. [Phase 3 Plan: Document Ingestion, PDF Processing & Chunking](#8-phase-3-plan-document-ingestion-pdf-processing--chunking)
9. [Interview Q&A Vault (Phases 0 - 2)](#9-interview-qa-vault-phases-0---2)
10. [Repository Structure Reference](#10-repository-structure-reference)

---

## 1. Project Overview & Core Problem

### The User-Facing Problem
Vanilla Large Language Models (LLMs) cannot access private, proprietary enterprise documents (PDF manuals, financial disclosures, internal HR policies, technical contracts).
- Pasting entire 50–100 page PDFs into prompts blows through context windows, costs thousands of tokens per query, slows response times (10s+ latency), and causes the **"Lost in the Middle"** phenomenon where the model overlooks facts located in the center of long prompts.
- When an LLM doesn't have accurate facts, it hallucinates believable-sounding but incorrect information.

### The KnowledgeLens Solution
A production-minded **Retrieval-Augmented Generation (RAG)** assistant where:
1. Users upload private documents (PDFs).
2. The server extracts text, divides it into semantic overlapping passages (chunks), and computes mathematical vector embeddings.
3. Chunks and vectors are stored in PostgreSQL with `pgvector`.
4. When a user asks a question, the server generates a query vector, searches for the **Top-K most relevant document chunks** via cosine similarity, and feeds *only those excerpts* into an augmented prompt.
5. The model streams an answer grounded in retrieved facts with **verifiable, clickable source citations** (page number and exact excerpt).

---

## 2. End-to-End System Architecture & Roadmap

```
[User Browser / React 19 Client]
  │
  ├── 1. Upload Document ────────> POST /api/documents/upload ──> Parser + Chunker ──> pgvector
  │
  └── 2. Chat Query (Streaming) ──> POST /api/chat
                                      │
                                      ├── (A) Zod Request Validation
                                      ├── (B) Vector Search in pgvector (Cosine <=> ) [Phase 4-5]
                                      ├── (C) Prompt Assembly with Grounding Constraints
                                      └── (D) Streaming LLM Response (Gemini 2.5 Flash)
                                              │
                                              ▼
                                      ReadableStream / TextDecoder with AbortController
```

### The 7 Development Phases
- **Phase 0 (DONE):** Bare Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 setup & verification.
- **Phase 1 (DONE):** Foundation & Basic LLM Chat (UI shell, Route Handler, Zod validation, error handling).
- **Phase 2 (DONE):** Streaming Responses (`ReadableStream`, `TextDecoder`, `AbortController` stop-generation).
- **Phase 3 (ACTIVE):** Document Ingestion (PDF upload, magic byte validation, text extraction, recursive chunking).
- **Phase 4 (PLANNED):** Embeddings & Vector Search (PostgreSQL + `pgvector`, cosine similarity retrieval).
- **Phase 5 (PLANNED):** Complete Grounded RAG Pipeline (augmented prompts, citations, source inspector).
- **Phase 6 (PLANNED):** Hallucination Mitigation & Reliability (abstention prompts, injection defense, eval suite).
- **Phase 7 (PLANNED):** Production Polish & Multi-Doc Management (persistence, caching, optimizations).

---

## 3. Phase 0: Clean Next.js 16 Baseline Setup

### Objective
Start with a clean, verified Next.js 16 project before introducing dependencies, route handlers, or API logic.

### Actions Taken
1. Bootstrapped project using `create-next-app` non-interactively:
   ```bash
   npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --empty --disable-git
   ```
2. Verified Node.js (`v22.18.0`) and npm (`10.9.3`) in macOS environment.
3. Created foundational documentation in `docs/`:
   - `docs/PROJECT_PLAN.md`
   - `docs/ARCHITECTURE.md`
   - `docs/LEARNING_NOTES.md`
   - `docs/AI_INTERVIEW_PREP.md`
   - `docs/KNOWN_ISSUES.md`
4. Created safe `.env.example` with placeholder secrets.
5. Configured `.gitignore` so real `.env*` files are ignored while `.env.example` is tracked.
6. Verified build (`npm run build`) and lint (`npm run lint`) passed with 0 errors.

---

## 4. AI Provider Selection & Free Tier Setup

### Discussion
The mentee did not have an OpenAI API key and asked for alternative options.

### Provider Evaluation
1. **Google Gemini (Recommended & Chosen):**
   - Free tier via [Google AI Studio](https://aistudio.google.com/) without needing a credit card.
   - Supports both Generation (`gemini-2.5-flash`) and Embeddings (`gemini-embedding-001`) under one unified key.
   - Generous free quota: 15 Requests Per Minute (RPM), 1 Million Tokens Per Minute (TPM), 1,500 Requests Per Day.
2. **Groq Cloud:** Ultra-fast inference with open-source models (`llama-3.1-8b-instant`), but requires separate setup for vector embeddings.
3. **Ollama:** 100% local and offline, but heavy on local RAM and hardware.

### Configuration (`.env.local` / `.env`)
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
NEXT_PUBLIC_APP_NAME="KnowledgeLens"
MAX_UPLOAD_SIZE_MB=10
```

---

## 5. Phase 1: Foundation & Basic LLM Chat

### Key Implementations

1. **TypeScript Contracts (`src/types/chat.ts`):**
   Defined `ChatMessage`, `ChatRole`, `ChatRequestBody`, `ChatResponseBody`, and `ChatErrorResponse`.

2. **Runtime Validation with Zod 4 (`src/lib/validation/chat.ts`):**
   - Enforced trimmed string, non-empty, max 4,000 characters.
   - Enforced maximum history array size of 20 messages.
   - Enforced that the last message must have `role === "user"`.
   - Adapted to Zod 4 syntax (`error.issues` and `{ message: "..." }` on `z.enum`).

3. **Server AI Wrapper (`src/lib/ai/gemini.ts`):**
   - Used `@google/genai` SDK.
   - Guarded against missing or placeholder `GEMINI_API_KEY`.
   - Injected baseline `DEFAULT_SYSTEM_INSTRUCTION`.
   - Mapped application roles (`user` / `assistant`) to Gemini roles (`user` / `model`).
   - Set `temperature: 0.2` for factual, low-variance responses.

4. **Server Route Handler (`src/app/api/chat/route.ts`):**
   - Safe JSON parsing (returns 400 Bad Request on syntax failure).
   - Zod validation (returns 422 Unprocessable Entity with clear error message).
   - Graceful error mapping (returns 503 if API key missing, 429 on rate limit).
   - Removed incompatible Next 16 `export const dynamic = "force-dynamic"`.

5. **Chat UI Components (`src/components/chat/`):**
   - `MessageBubble.tsx`: Styled message cards with user/bot avatars and timestamps.
   - `ChatInput.tsx`: Multiline textarea, Enter-to-send, Shift+Enter newline, character counter.
   - `ChatContainer.tsx`: Message state management, empty state with suggested prompts, auto-scroll, clear chat button, and error banner.

### Terminal Verification
- Tested with `curl -X POST /api/chat -d '{invalid-json}'` $\rightarrow$ **400 Bad Request**.
- Tested with `curl -X POST /api/chat -d '{"messages": [{"role": "user", "content": " "}]}'` $\rightarrow$ **422 Unprocessable Entity**.
- Tested without API key $\rightarrow$ **503 Service Unavailable**.

---

## 6. Debugging Session: Resolving Gemini 404 Model Error

### The Incident
When the mentee tested the chat with a valid API key, the UI showed:
```json
{
  "error": {
    "code": 404,
    "message": "models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent. Call ModelService.ListModels to see the list of available models and their supported methods.",
    "status": "NOT_FOUND"
  }
}
```

### Investigation & Root Cause
1. Ran a node diagnostic script calling `ai.models.list()` using the mentee's API key.
2. Discovered that Google AI upgraded their endpoints and deprecated `gemini-1.5-flash` in this SDK version in favor of **`gemini-2.5-flash`**.
3. Tested `gemini-2.5-flash` directly via Node CLI $\rightarrow$ generated answer successfully in 2 seconds.

### The Fix
Updated `.env` and `.env.example`:
```diff
- GEMINI_MODEL=gemini-1.5-flash
- GEMINI_EMBEDDING_MODEL=text-embedding-004
+ GEMINI_MODEL=gemini-2.5-flash
+ GEMINI_EMBEDDING_MODEL=gemini-embedding-001
```
Verified via curl:
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "What is KnowledgeLens in 1 sentence?"}]}'
```
Response:
`{"role":"assistant","content":"KnowledgeLens is an AI Document Intelligence Assistant designed to provide clear, precise, and accurate information from documents.","model":"gemini-2.5-flash"}`

---

## 7. Phase 2: Streaming Responses & Stop Generation

### Core Concepts Taught
1. **HTTP Chunked Transfer (`Transfer-Encoding: chunked`):**
   Omits `Content-Length`. Chunks are sent over an open HTTP socket as soon as the model generates tokens. Lowers Time-To-First-Token (TTFT) from ~4s to <400ms.
2. **Fetch `ReadableStream` vs. SSE vs. WebSockets:**
   Fetch `ReadableStream` with `TextDecoder` was chosen because it seamlessly works with standard HTTP POST requests, requires no custom reconnect wrappers, and natively supports cancellation.
3. **Transport Chunks $\neq$ Words:**
   TCP packet boundaries can split a multibyte UTF-8 character (e.g., emojis or non-ASCII characters). `new TextDecoder("utf-8", { stream: true })` buffers trailing bytes until the subsequent packet arrives.
4. **Cancellation via `AbortController`:**
   Client calls `controller.abort()`. Next.js server detects connection close via `req.signal.aborted` and breaks the upstream generation loop, saving model billing.

### Implementation Details
- **`src/lib/ai/gemini.ts`:** Created `streamGeminiChat(messages, signal)` returning `ReadableStream<Uint8Array>`.
- **`src/app/api/chat/route.ts`:** Returns a streaming `Response` with headers `Content-Type: text/plain; charset=utf-8` and `Cache-Control: no-cache, no-transform`. Passes `req.signal` to model stream.
- **`src/components/chat/ChatContainer.tsx`:** Consumes stream using `reader.read()` and `TextDecoder`. Catches `AbortError` gracefully.
- **`src/components/chat/ChatInput.tsx`:** Transforms "Send" button into a red "Stop" button with square icon during streaming.
- **`src/components/chat/MessageBubble.tsx`:** Added blinking cursor (`▌`) during active streaming.

### Verification
- Tested with `curl -N -s -X POST http://localhost:3000/api/chat ...` $\rightarrow$ real-time incremental tokens received.
- `npm run build && npm run lint` passed with 0 errors and 0 warnings.

---

## 8. Phase 3 Plan: Document Ingestion, PDF Processing & Chunking

### Core Objectives
1. **PDF Upload UI:** Drag-and-drop zone with file type and size validation (max 10MB).
2. **Security & Magic Bytes Validation:** Validate `%PDF-` (`0x25, 0x50, 0x44, 0x46, 0x2D`) at byte level on server, rejecting disguised files.
3. **PDF Text Extraction:** Extract text page-by-page (digital PDFs), detecting empty/scanned files.
4. **Recursive Character Chunking Engine:**
   - Slit long documents into passages of 600 characters with 120 character sliding overlap.
   - Break hierarchically: paragraphs (`\n\n`) $\rightarrow$ sentences (`. `) $\rightarrow$ spaces (` `).
   - Attach metadata to every chunk: `{ documentId, pageNumber, chunkIndex, characterCount }`.
5. **Document & Chunk Inspector:** Frontend drawer to inspect generated chunks and metadata before vector storage.

---

## 9. Interview Q&A Vault (Phases 0 - 2)

### Q1: Why do we keep LLM API calls on the server instead of calling OpenAI/Gemini directly from React?
> **Answer:** Security, cost control, and architectural integrity. Calling provider SDKs from the browser exposes secret API keys in the Network tab and JS bundle. By routing through Next.js Server Route Handlers, secrets stay in `process.env`. The server also enforces runtime validation (Zod), rate limiting, token quotas, and context injection (RAG) that clients cannot tamper with.

### Q2: What is a Token and why is Token Budgeting critical in RAG?
> **Answer:** A token is a chunk of characters (typically 4 characters or ~0.75 English words). Token budgeting allocates quotas for system instructions, retrieved document chunks, chat history, and reserved completion tokens. Without budgeting, prompts can exceed context limits, inflate API costs, or trigger the "Lost in the Middle" degradation where models ignore evidence in the middle of long contexts.

### Q3: What role does Temperature play in an LLM call, and how do you configure it for Document Intelligence vs Creative Writing?
> **Answer:** Temperature scales logits before the softmax layer in next-token prediction: $P(w_i) = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}$. A high temperature (0.8–1.0) flattens the distribution, increasing word diversity for creative brainstorming. In KnowledgeLens, we set `temperature: 0.2` to sharpen the probability distribution on high-confidence tokens, minimizing hallucination and enforcing strict adherence to retrieved document evidence.

### Q4: If you have TypeScript across Next.js, why is Zod runtime validation still mandatory?
> **Answer:** TypeScript is purely compile-time and erased after build (`tsc`). In production, HTTP requests can originate from any client (cURL, Postman, automated scripts) with forged payloads. Zod inspects untrusted JSON at runtime on the server, rejecting oversized payloads (e.g. 10MB strings) with HTTP 422 before they consume memory or trigger billable AI provider calls.

### Q5: How does streaming work under the hood in Next.js, and why choose ReadableStream over Server-Sent Events (SSE)?
> **Answer:** Streaming uses HTTP chunked transfer encoding (`Transfer-Encoding: chunked`). The server returns a native `ReadableStream`, emitting byte buffers as upstream LLM tokens arrive. We chose Fetch `ReadableStream` with `TextDecoder` because it natively works with HTTP POST requests, avoids SSE framing overhead (`data: ...\n\n`), and handles cancellation seamlessly via `AbortController`.

### Q6: How does the "Stop Generation" button work end-to-end?
> **Answer:** We initialize an `AbortController()` and pass its `signal` to `fetch()`. When the user clicks Stop, `controller.abort()` rejects the fetch promise with a `DOMException (name: "AbortError")`, which our client catches without displaying an error alert. On the server, `req.signal.aborted` becomes `true`, breaking the `for await (const chunk of responseStream)` loop and immediately stopping the upstream AI provider call to save token costs.

### Q7: Why do we use `new TextDecoder('utf-8', { stream: true })` instead of basic string concatenation?
> **Answer:** Network transport chunks in `reader.read()` are raw `Uint8Array` byte packets split at TCP boundaries, not token or word boundaries. If a multibyte UTF-8 sequence (such as an emoji or non-Latin character) is sliced across two TCP packets, standard decoding produces corrupt replacement characters (``). The `{ stream: true }` option preserves incomplete trailing byte sequences in an internal buffer until the next chunk arrives.

---

## 10. Repository Structure Reference

```text
knowledgelens/
├── docs/
│   ├── ARCHITECTURE.md              # System design & component diagrams
│   ├── LEARNING_NOTES.md            # Engineering concepts & trade-offs
│   ├── AI_INTERVIEW_PREP.md         # Technical interview questions & model answers
│   ├── PROJECT_PLAN.md              # Phased roadmap & milestone status
│   ├── KNOWN_ISSUES.md              # Tracked technical debt
│   └── CHAT_HISTORY.md              # Complete mentorship conversation & build log
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts         # Streaming chat Route Handler
│   │   ├── layout.tsx               # Root layout & SEO metadata
│   │   ├── page.tsx                 # Main application dashboard
│   │   └── globals.css              # Tailwind CSS v4 directives
│   ├── components/
│   │   └── chat/
│   │       ├── ChatContainer.tsx    # State, stream consumer, auto-scroll, stop handler
│   │       ├── ChatInput.tsx        # Keyboard navigation, char counter, Stop/Send button
│   │       └── MessageBubble.tsx    # Message bubbles with avatar & blinking stream cursor
│   ├── lib/
│   │   ├── ai/
│   │   │   └── gemini.ts            # Non-streaming & streaming Google GenAI client
│   │   └── validation/
│   │       └── chat.ts              # Zod 4 runtime schemas
│   └── types/
│       └── chat.ts                  # Shared TypeScript interfaces
├── .env.example                     # Safe environment template
├── .gitignore                       # Secrets shielding (.env* ignored)
├── package.json                     # Next.js 16, React 19, @google/genai, zod, lucide-react
├── tsconfig.json
└── next.config.ts
```
