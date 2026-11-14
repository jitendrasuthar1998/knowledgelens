# KnowledgeLens — Learning Notes & Concept Journal

## Phase 0: Clean Setup & Architectural Foundations

### 1. Why start with an empty Next.js scaffold?
- **Separation of Concerns:** Shuru me hi saare packages (LangChain, database drivers, PDF parsers) ek saath install karne se dependency conflicts aur confusion badhta hai.
- **Mental Clarity:** We build layer-by-layer. When something breaks, we know exactly which layer caused it.

### 2. Next.js 16 App Router & Server/Client Boundary
- App Router me components by default **Server Components** hote hain (runs only on Node.js/Turbopack runtime).
- Browser events (e.g., `onClick`, `useState`, `useEffect`) use karne ke liye explicit `"use client"` directive lagana padta hai.
- Route Handlers (`src/app/api/.../route.ts`) pure server-side endpoints hote hain, jahan secret API keys safe rehti hain.

### 3. Core Terminology to Internalize:
- **Token:** The basic unit of text for an LLM (roughly 4 characters or ~0.75 words in English).
- **Context Window:** The total maximum number of tokens an LLM can process in a single request (prompt tokens + completion tokens combined).
- **Latency vs Throughput:** In AI applications, time-to-first-token (TTFT) matters most to user perceived latency, which is why streaming is essential.

---

## Phase 1: Foundation & Basic LLM Chat

### 1. Client-Server Security Boundary
- Provider API keys (`GEMINI_API_KEY`) must **never** be referenced in client components or prefixed with `NEXT_PUBLIC_`.
- All requests flow: `React Client -> POST /api/chat -> Route Handler (Server) -> Gemini API`.

### 2. Runtime Validation with Zod 4
- TypeScript types disappear after compilation (`tsc`). Without runtime validation, malicious clients can crash server handlers or exhaust API quotas with gigabyte payloads.
- In Zod 4, validation issues reside in `error.issues` instead of `error.errors`.
- We validate: non-empty string, 4,000 max character limit, 20 max history turns, and ensure the trailing message is from `"user"`.

### 3. Model Parameters & System Prompt
- **System Instruction:** Informs the model of its baseline identity and safety boundaries before reading user messages.
- **Temperature:** Set to `0.2` for factual, grounded responses (minimizes hallucination variance). Higher temperatures (e.g. 0.8) are reserved for creative writing.
- **Role Mapping:** Google Gemini uses `{ role: "user" | "model" }` rather than the OpenAI convention `{ role: "user" | "assistant" }`. We cleanly map this inside `src/lib/ai/gemini.ts`.

---

## Phase 2: Streaming Responses & UI Interactivity

### 1. HTTP Chunked Transfer Encoding
- Non-streaming responses wait for the full payload before sending headers with `Content-Length`.
- Streaming responses omit `Content-Length` and send data as chunked byte frames (`Transfer-Encoding: chunked`).
- The connection stays open until the server explicitly invokes `controller.close()`.

### 2. Transport Chunks vs. Natural Words
- Chunks arriving in `reader.read()` are raw byte buffers (`Uint8Array`), split by TCP packet boundaries—NOT clean words or whole tokens.
- Using `new TextDecoder("utf-8")` with `{ stream: true }` ensures multibyte characters that cross chunk boundaries are buffered rather than corrupted.

### 3. Client Cancellation (`AbortController`)
- When a user stops generation, calling `controller.abort()` emits an `AbortSignal`.
- Frontend fetch terminates with a `DOMException (name: "AbortError")`, allowing graceful cleanup without triggering error alerts.
- On the server, `req.signal.aborted` detects disconnection and halts upstream model generation, preventing wasted API quota.

---

## Phase 3: Document Ingestion, PDF Processing & Recursive Chunking

### 1. Magic Bytes Defense vs File Extension Spoofing
- An attacker can rename a malicious script (`malware.exe` or `hack.sh`) to `invoice.pdf` to pass naive file extension checks (`.endsWith(".pdf")`).
- Checking the file's first bytes for `%PDF-` (`0x25, 0x50, 0x44, 0x46, 0x2D`) at the binary level ensures the uploaded buffer matches the ISO 32000 PDF file signature before any parsing logic is invoked.

### 2. Digital PDFs vs Scanned/Image PDFs
- Standard PDF parsers extract digital text embedded as character glyph objects.
- Scanned documents or smartphone photos saved as PDFs contain only raster bitmap images without a digital text layer.
- Our extraction engine computes total characters across all pages; if $<20$ characters are extracted, it detects a scanned document and informs the user that OCR (Optical Character Recognition) is required.

### 3. Why Recursive Character Chunking over Naive Fixed-Size Chunking?
- **Naive Splitting (`text.slice(0, 600)`):** Blindly cuts through words, mid-sentence thoughts, and formulas (e.g. cutting `"Postgre"` from `"SQL"`), degrading vector embedding quality.
- **Recursive Splitting:** Tries high-priority natural document boundaries first:
  1. `\n\n` (Paragraphs)
  2. `\n` (Lines & list items)
  3. `. `, `? `, `! ` (Sentences)
  4. `" "` (Words)
  5. `""` (Characters, fallback only)
- This guarantees semantic cohesion within every passage fed to the vector database.

### 4. Sliding Overlap Rationale
- Splitting a document into isolated chunks can sever context across the boundary (e.g., a premise in chunk 1 and its conclusion in chunk 2).
- An overlap of 120 characters carries over trailing context into the next chunk, preserving narrative flow and improving cosine similarity matches during vector retrieval.

### 5. Page Provenance for Grounded Citations
- Many generic frameworks concatenate the entire document into a single flat string before chunking, destroying page indices.
- By chunking page-by-page and attaching `pageNumber`, every chunk retains its original location, enabling clickable citations (*"Source: Page 3"*) in Phase 5.
