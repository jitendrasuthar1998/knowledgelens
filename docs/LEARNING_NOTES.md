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
