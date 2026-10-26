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

---

### Q3: "What role does Temperature play in an LLM API call, and how would you configure it for a Document Intelligence assistant versus a Creative Bot?"
- **Direct Answer:** Temperature controls the probability distribution of predicted tokens. Higher values flatten the distribution (more randomness/diversity), while lower values sharpen the peak (more deterministic and focused output).
- **How it works:** In softmax next-token prediction, logits are divided by temperature $T$: $P(w_i) = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}$. When $T \to 0$, only the highest probability token is picked.
- **Example from our app:** In KnowledgeLens, we set `temperature: 0.2` in `src/lib/ai/gemini.ts`. For document question-answering, we want strict factual fidelity based on retrieved evidence rather than poetic improvisation.
- **Trade-off / Limitation:** A very low temperature (e.g. 0.0) can sometimes lead to repetitive phrasing or loops if the prompt is poorly constrained, but it gives the highest consistency for factual QA.

---

### Q4: "If you already use TypeScript across your Next.js application, why is Zod runtime validation still essential in Route Handlers?"
- **Direct Answer:** TypeScript only exists at compile-time. At runtime in production, client requests can come from anywhere (curl, Postman, automated scripts) with arbitrarily forged payloads.
- **How it works:** Zod parses the incoming untrusted JSON object against our schema (`chatRequestSchema`) at runtime on the server before we pass anything to external APIs or database queries.
- **Example from our app:** If an attacker sends a 10MB string or non-array messages to `/api/chat`, Zod rejects it immediately with HTTP 422, protecting our server memory and preventing unnecessary AI provider API billing.

---

### Q5: "How does response streaming work under the hood in Next.js App Router, and why do we use ReadableStream over Server-Sent Events (SSE) for simple LLM chats?"
- **Direct Answer:** Streaming uses HTTP chunked transfer encoding (`Transfer-Encoding: chunked`), where the server emits data segments over an open connection as soon as upstream tokens arrive.
- **How it works:** In `/api/chat/route.ts`, we return a Web standard `Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })`. The browser reads raw `Uint8Array` chunks using `response.body.getReader()` and converts them using `TextDecoder`.
- **Why not SSE here?** SSE requires event framing (`data: ...\n\n`), custom reconnection logic, and event listeners. For standard unidirectional LLM text streams, Fetch `ReadableStream` is lighter, avoids text formatting overhead, and natively pairs with standard POST bodies and `AbortController`.
- **Trade-off / Limitation:** If we need multiple event channels over a single connection (e.g., streaming text on one channel and citation metadata or progress events on another), SSE or NDJSON (Newline Delimited JSON) is preferred.

---

### Q6: "How do you implement a 'Stop Generation' button in a React streaming chat interface, and what happens on the server?"
- **Direct Answer:** We instantiate a new `AbortController()` before making the `fetch()` call and pass its `controller.signal` to the fetch request options. Clicking 'Stop' calls `controller.abort()`.
- **How it works on the frontend:** `controller.abort()` rejects the fetch promise with a `DOMException` with `name: "AbortError"`. In our catch block, we check `if (err.name === "AbortError")` and silently stop updating state rather than displaying an error banner.
- **How it works on the server:** In Next.js, `req.signal` reflects the client's connection state. Passing `req.signal` to our model stream generator lets us break the `for await (const chunk of responseStream)` loop when `signal.aborted` is true, immediately terminating the upstream AI provider call and saving costs.


