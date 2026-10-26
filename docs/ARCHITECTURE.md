# KnowledgeLens — System Architecture

## 1. High-Level Overview

KnowledgeLens bridges the gap between private enterprise documents (PDFs) and Large Language Models using Retrieval-Augmented Generation (RAG).

```
[User Browser]
   │
   ▼
[Next.js App Router (React 19)]
   │
   ├── POST /api/documents/upload ──> PDF Parser ──> Chunker ──> Embedding API ──> PostgreSQL (pgvector)
   │
   └── POST /api/chat (Streaming) ──> Query Embedding ──> Vector Search (Cosine) ──> Prompt Assembly ──> LLM Stream
```

## 2. Core Architectural Components

1. **Frontend Layer (`src/`):**
   - Next.js 16 App Router
   - React 19 functional components
   - Tailwind CSS v4 styling
   - Custom streaming hook (`useStreamingChat`) with `AbortController` support.

2. **Backend / Orchestration Layer (`src/app/api/`):**
   - Next.js Server Route Handlers
   - Input validation via Zod
   - Direct provider SDK orchestration (no unnecessary heavy framework layers)

3. **Storage & Vector Retrieval Layer:**
   - Relational tables: Documents, Chunks, Conversations, Messages
   - Vector index: `pgvector` (`hnsw` / `ivfflat`) on chunk embedding column using cosine distance (`<=>`).

4. **Model Provider:**
   - Embedding Model (e.g. `text-embedding-3-small`, 1536 dims)
   - Chat Completion / Generative Model (e.g. `gpt-4o-mini` or `gemini-1.5-flash`)

## 3. Security & Boundary Principles
- AI provider API keys reside strictly on the server (`process.env`). Never exposed in browser runtime.
- Client requests validate payload length and types before hitting external APIs.
- Uploaded documents are treated as untrusted data (sanitization, size limits, defensive chunking).
