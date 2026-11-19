# KnowledgeLens — Project Implementation Plan

## Overview
**KnowledgeLens** is a production-minded AI Document Intelligence Assistant built with Next.js (App Router), React, TypeScript, Tailwind CSS, PostgreSQL + pgvector, and LLM APIs (streaming responses, vector search, grounded citations, and hallucination safeguards).

---

## Roadmap & Phase Status

| Phase | Description | Status |
|---|---|---|
| **Phase 0** | Bare Next.js 16 + React 19 + TypeScript + Tailwind v4 setup & verification | **DONE** |
| **Phase 1** | Foundation & Basic LLM Chat (UI shell, Route Handler, Zod validation, error handling) | **DONE** |
| **Phase 2** | Streaming Responses (`ReadableStream`, custom hooks, abort/stop generation) | **DONE** |
| **Phase 3** | Document Ingestion (PDF upload, validation, parsing, recursive chunking) | **DONE** |
| **Phase 4** | Embeddings & Vector Search (pgvector integration, cosine similarity retrieval) | **DONE** |
| **Phase 5** | Complete Grounded RAG Pipeline (augmented prompts, citations, source inspector) | **DONE** |
| **Phase 6** | Hallucination Mitigation & Reliability (abstention, injection defense, eval suite) | Pending |
| **Phase 7** | Production Polish & Multi-Doc Management (persistence, caching, optimizations) | Pending |

---

## Current Status: Phase 5 Completed (Grounded RAG Pipeline & Citations)

### Completed Milestones:
- [x] **Phase 0: Architecture & Tooling Baseline**
  - Next.js 16 (Turbopack, TypeScript, Tailwind CSS v4, ESLint).
  - Documentation suite in `docs/` (`PROJECT_PLAN.md`, `ARCHITECTURE.md`, `LEARNING_NOTES.md`, `AI_INTERVIEW_PREP.md`, `CHAT_HISTORY.md`).
- [x] **Phase 1: Basic Chat Foundation & Gemini Integration**
  - Server Route Handler `POST /api/chat` with Zod 4 runtime schema validation.
  - Safe error handling (400 Bad Request, 422 Unprocessable Entity, 503 Missing API Key).
  - Modern dark-themed chat interface with responsive layout and empty state suggestion chips.
- [x] **Phase 2: Real-Time Token Streaming & Cancellation**
  - `streamGeminiChat()` wrapping Gemini `generateContentStream` with standard Web `ReadableStream`.
  - HTTP chunked transfer responses with `Cache-Control: no-cache, no-transform`.
  - Client stream consumer using `reader.read()` and `TextDecoder("utf-8", { stream: true })`.
  - Mid-stream cancellation support with `AbortController` and server disconnect handling.
- [x] **Phase 3: Document Ingestion, PDF Processing & Recursive Chunking**
  - `unpdf` v2.2.0 integration with page-by-page text extraction (`mergePages: false`).
  - Strict security validation: `%PDF-` (`0x25, 0x50, 0x44, 0x46, 0x2D`) magic byte verification and 10MB size cap.
  - Scanned/empty PDF detection with informative user guidance.
  - First-principles Recursive Character Chunking algorithm with clean, non-repeating chunks and page provenance metadata.
  - Interactive UI: Drag-and-drop uploader (`DocumentUploader`), Slide-over Drawer (`DocumentDrawer`), and Searchable Chunk Inspector (`ChunkInspector`).
- [x] **Phase 4: Embeddings & Vector Search (PostgreSQL + pgvector)**
  - Configured PostgreSQL 17 + `pgvector` extension (v0.8.2) on Supabase.
  - Relational schema: `documents` and `document_chunks` with `vector(768)` column and HNSW cosine distance index.
  - Embedding Service (`src/lib/ai/embeddings.ts`): 768-dimension vectors via `gemini-embedding-001`.
  - Automated Vector Ingestion in `POST /api/documents/upload`.
  - Semantic Retrieval Endpoint `POST /api/documents/search` via `<=>` cosine distance operator.
- [x] **Phase 5: Grounded RAG Pipeline, Citations & Source Inspector**
  - Connected `POST /api/chat` with `searchSimilarChunks()` for Top-5 cosine similarity vector retrieval.
  - Constructed strict grounded system instruction with document context excerpts.
  - LLM grounded citation generation format (`[Source: <DocName>, Page <N>]`).
  - Implemented clean UI message presentation: message bubble shows clean text with citations stripped, accompanied by a dedicated "Sources" card deck below the AI response.
  - Modal `SourceInspector` with interactive chunk preview and provenance metadata.
  - Solved production cloud database cold-start timeout via pool configuration & decoupling DDL schema initialization from read hot-paths.

---

## Phase 6 Roadmap & Implementation Steps (In Progress)
- [x] **Step 6.1: Confidence Thresholding & Explicit Abstention**
  - Added `RAG_SIMILARITY_THRESHOLD = 0.50` in `src/lib/ai/rag.ts` to filter low-confidence noise chunks.
  - Implemented `buildAbstentionInstruction(documentName)` to mandate polite abstention on out-of-scope queries.
  - Filtered raw database chunks in `POST /api/chat`, with clean fallback logs and zero irrelevant context injection.
- [ ] **Step 6.2: Prompt Injection Defense & Context Delimiting**
  - Enclose retrieved document excerpts within strict XML/Markdown delimiters.
  - Explicit system prompt instructions to ignore conflicting or override commands embedded inside documents or queries.
- [ ] **Step 6.3: Evaluation & Regression Verification**
  - Build test queries to evaluate Grounded Factual QA vs. Out-of-Scope Hallucination traps.
  - Validate citation fidelity (every cited page corresponds to actual ground-truth context).
