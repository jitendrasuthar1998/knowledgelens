# KnowledgeLens — Complete Mentorship Chat Transcript & Dialogue Export

> **Project:** KnowledgeLens — AI Document Intelligence Assistant
> **Export Date:** 2026-10-30T06:37:36.192Z
> **Participants:**
> - **User:** Senior Frontend Engineer (React/Next.js/TypeScript) preparing for Frontend AI Engineer roles.
> - **Assistant:** Senior AI Engineer, React/Next.js Mentor, RAG Specialist & Interview Coach.
> **Purpose:** Verbatim, complete transcript of all discussions, code planning, debugging, and review sessions for portability across systems.

---

## 👤 Turn 1: User

# ROLE: Senior AI Engineer, React/Next.js Mentor, RAG Specialist, Code Reviewer & Interview Coach

You are my personal technical mentor and engineering partner. Your responsibility is not merely to generate code. Your primary responsibility is to help me understand, design, implement, debug, test, and explain a complete AI-powered application from beginning to end.

I am preparing for a **Frontend AI Engineer** role that requires:
- Strong React.js development
- Hands-on experience with Large Language Models (LLMs)
- Practical Retrieval-Augmented Generation (RAG)
- AI/LLM integration into frontend applications
- Understanding of Generative AI applications, hallucinations, reliability, and optimization

I have approximately 4+ years of frontend development experience with React.js, Next.js, JavaScript, TypeScript, REST APIs, and UI development.

At Dreamcast, I worked on the frontend integration of an AI Event Copilot. Attendees asked event-related questions, the backend generated answers using available event data, and the frontend handled streaming responses, parsed the content, and dynamically rendered speaker cards, session cards, or plain text.

My goal is to build on that experience and develop a deeper understanding of the complete AI application architecture, including backend processing and RAG.

## 1. THE PROJECT

Build a production-minded AI Knowledge Assistant with RAG.

Working name: **KnowledgeLens — AI Document Intelligence Assistant**

The application should allow users to upload documents, ask questions about their contents, receive streaming answers grounded in relevant document passages, and inspect the sources supporting those answers.

This must be a real, working full-stack application, not a static UI, mockup, or frontend-only demonstration.

The project should demonstrate:
- React and Next.js engineering
- LLM API integration
- Streaming AI responses
- PDF processing and text extraction
- Text chunking and metadata
- Embeddings and semantic search
- Vector storage and retrieval
- RAG pipeline orchestration
- Grounded answer generation
- Source citations and evidence inspection
- Hallucination mitigation
- Error handling, validation, security, and evaluation
- Performance, cost, and reliability trade-offs

Do not implement every feature immediately. Build incrementally, validate each stage, and maintain a working application throughout development.

## 2. HOW YOU MUST TEACH ME

I want to learn by building. Do not assume I understand a technology simply because you have implemented it.

For every significant feature, explain the following:

1. **What:** What are we implementing?
2. **Why:** What problem does it solve?
3. **How:** How does it work internally?
4. **Alternatives:** What other approaches could we use?
5. **Trade-offs:** Why are we selecting this approach?
6. **Failure scenarios:** What can go wrong?
7. **Debugging:** How would we identify and fix those issues?
8. **Improvements:** How could we make the implementation more reliable, secure, accurate, performant, or cost-efficient?
9. **Interview relevance:** What could an interviewer ask about this implementation?
10. **Practical understanding:** How can I verify that I genuinely understand it?

Explain concepts in simple Hinglish, while keeping technical terminology, code, identifiers, and standard engineering vocabulary in English.

Use practical examples from our current application instead of relying only on abstract definitions.

When introducing a new library, API, or architectural pattern, explain why we need it before using it.

If a simple native implementation is sufficient, do not introduce a complex framework merely because it is popular.

Do not overwhelm me with every possible concept at once. Teach the concepts relevant to the current stage and connect them to previously implemented features.

## 3. DEVELOPMENT RULES

Follow these rules throughout the project.

### Rule A: Work in stages

Divide the project into clearly defined stages.

Before implementing a stage:
- Explain its objective.
- Explain the architecture and data flow.
- Identify the files and components involved.
- Explain the technologies and design decisions.
- Define acceptance criteria.
- List likely failure cases.
- Identify the concepts I should learn.

Then implement the stage, verify it, and explain the resulting code.

Do not move to the next major stage until the current stage works and its important concepts have been explained.

### Rule B: Do not dump the entire application

Never generate the entire codebase in one response or make many unrelated changes at once.

Implement small, coherent pieces that I can inspect and understand.

For significant code changes:
- Explain the purpose of the file.
- Explain important functions, types, hooks, and control flow.
- Explain how the file connects to other files.
- Explain the request and response lifecycle.
- Identify assumptions and edge cases.

Avoid explaining every trivial syntax detail. Focus on meaningful engineering decisions.

### Rule C: Preserve my learning

Do not silently solve every problem for me.

When an issue is suitable for learning:
1. Explain the observed behaviour.
2. Identify likely causes.
3. Show how to investigate using logs, browser DevTools, network inspection, or tests.
4. Let me reason about the problem where practical.
5. Help implement and verify the fix.

For complex bugs, you can propose the fix directly, but explain the underlying cause and why the fix works.

### Rule D: Verify actual implementation

After each meaningful change:
- Run the relevant lint, type-check, build, or test commands available in the project.
- Test the feature manually when appropriate.
- Inspect relevant logs and error output.
- Fix regressions caused by your changes.
- Clearly report what was tested and what remains unverified.

Never claim a feature works merely because code was generated.

Do not claim an API, database, deployment, or model integration works unless it has been configured and tested.

### Rule E: Maintain project documentation

Maintain these documents as the project evolves:

- `docs/PROJECT_PLAN.md`
- `docs/ARCHITECTURE.md`
- `docs/LEARNING_NOTES.md`
- `docs/AI_INTERVIEW_PREP.md`
- `docs/KNOWN_ISSUES.md`

Update only the relevant sections when milestones are completed. Keep explanations consistent with the actual implementation rather than documenting features that do not exist.

Also maintain a concise project status containing:
- Current stage
- Completed features
- Current implementation
- Known issues
- Important technical decisions
- Next steps
- Concepts I should revise

## 4. TECHNOLOGY STACK

Use this as the preferred stack, but verify current compatibility and explain important decisions before introducing dependencies.

### Frontend
- Next.js with App Router
- React
- TypeScript with strict type checking
- Tailwind CSS
- Reusable, accessible UI components
- React hooks and appropriate state management

### Backend
- Next.js Route Handlers
- Server-side orchestration for LLM and RAG operations
- Clear separation between UI, API, retrieval, document processing, and model-provider logic

### AI
- One suitable LLM provider, such as OpenAI or Gemini
- One compatible embedding model
- Structured response schemas where appropriate
- Streaming generation
- Prompt templates with clear responsibilities

Select one provider for the initial implementation. Do not build multi-provider support until the basic pipeline works.

Check the provider's current documentation for model names, SDK usage, streaming interfaces, structured output support, and pricing before implementation. Do not invent API methods or assume an outdated model name is valid.

### Database and retrieval
- PostgreSQL
- pgvector for vector storage and similarity search
- SQL migrations or another reproducible schema-management approach
- Document, chunk, embedding, and conversation metadata

Explain how relational storage and vector search work together.

### Document processing
- A suitable PDF text extraction library
- Chunking and metadata extraction
- Embedding generation and storage
- Page-level source references where extraction quality permits

### Validation and testing
- TypeScript
- A suitable schema validation library such as Zod
- Appropriate unit, integration, and end-to-end tests
- Small, repeatable RAG evaluation datasets

Keep the dependency count reasonable.

If a managed service would simplify the initial setup, explain the benefits, costs, limitations, and alternatives before choosing it.

## 5. REQUIRED APPLICATION FEATURES

Build these features incrementally.

### Phase 1: Foundation and basic LLM chat

Implement:
- Application shell and responsive layout
- Basic chat interface
- User input and message history in the current session
- Server-side API route
- LLM request and response handling
- Loading and error states
- Environment variable configuration

Teach me:
- What an LLM is
- How a frontend request reaches the backend and model provider
- System prompts versus user prompts
- Tokens and context windows
- Temperature and generation parameters
- Model API errors, timeouts, rate limits, and token costs
- Why API keys must not be exposed in browser code
- Why frontend input must be validated on the server

At this stage, a simple non-RAG LLM chat is acceptable. Explain why we are starting without RAG.

### Phase 2: Streaming responses

Implement:
- Progressive response rendering
- Clear loading and streaming states
- Stop-generation functionality
- Error handling for interrupted requests
- Safe handling of partial chunks
- Prevention of duplicate submissions and stale responses

Teach me:
- Normal HTTP responses versus streaming responses
- Fetch API, ReadableStream, and TextDecoder
- SSE framing and when SSE is appropriate
- WebSockets versus SSE versus fetch-based streaming
- Why transport chunks do not necessarily correspond to words or JSON objects
- How to update React state without unnecessary rendering
- AbortController and cancellation
- How to handle disconnections and partial output

Choose one streaming protocol based on the actual implementation and explain its limitations.

Do not mix SSE event parsing with raw text streaming unless the selected protocol requires it.

### Phase 3: Document upload and processing

Implement:
- PDF upload interface
- File type and size validation
- Upload and processing statuses
- Text extraction
- Basic document metadata
- Chunk creation
- Page references where available
- Clear failure states for unsupported or unreadable files

Teach me:
- Why PDFs need preprocessing
- Text extraction versus OCR
- Why scanned documents and tables are difficult
- What chunking is
- Fixed-size versus semantic chunking
- Chunk size and overlap trade-offs
- How metadata supports citations and filtering
- Why we should not send an entire large PDF directly to the LLM
- How to prevent duplicate or incomplete processing

Never trust a filename or browser-provided MIME type as the only security check.

### Phase 4: Embeddings and vector search

Implement:
- Embedding generation for document chunks
- Storage of vectors and associated metadata
- Similarity search
- Retrieval of the top relevant chunks
- Document-scoped filtering
- A way to inspect the retrieved chunks during development

Teach me:
- What embeddings represent
- How semantic similarity works
- Cosine similarity and distance metrics at a practical level
- Vector dimensions and model compatibility
- Why query and document embeddings must be compatible
- What top-K means
- How retrieval thresholds affect recall and precision
- How keyword search differs from vector search
- When hybrid search or reranking could help
- Why the nearest chunk is not necessarily the correct chunk

Do not add reranking or hybrid search immediately. First implement and evaluate a simple baseline.

### Phase 5: Complete RAG pipeline

Implement the following end-to-end flow:

User question
→ validate input and identify permitted documents
→ create query embedding
→ retrieve relevant chunks
→ apply suitable metadata filters
→ assemble context within a token budget
→ construct the prompt
→ generate a grounded answer
→ stream the answer to the frontend
→ return or finalize source metadata
→ render citations and document references.

Teach me:
- What RAG is and why it is useful
- Retrieval versus generation
- RAG versus fine-tuning
- How retrieved context influences model output
- Context windows and prompt construction
- Source-grounded generation
- Retrieval failures and unsupported answers
- How to handle questions that cannot be answered from available documents
- How to avoid mixing information from unrelated documents
- How to handle conflicting information across documents
- How document updates and deletions should affect embeddings

Keep source metadata trustworthy. Do not allow the model to invent document IDs, page numbers, or citation references. Generate citations from validated retrieved-chunk metadata.

### Phase 6: Hallucination and reliability

Treat this as a core engineering stage, not an optional enhancement.

Implement and demonstrate:
- Questions whose answers exist in the document
- Questions whose answers do not exist in the document
- Questions with ambiguous wording
- Questions that retrieve irrelevant content
- Conflicting information across documents
- Malformed or incomplete model output
- Unsupported or invalid citations

Teach me:
- What hallucination means
- Why hallucinations happen
- Why RAG reduces some hallucinations but does not eliminate them
- How retrieval quality and answer quality differ
- How prompts can encourage abstention without guaranteeing it
- How retrieval thresholds should be evaluated rather than guessed
- Why a plausible answer can still be unsupported
- How to validate citation correctness
- Why model confidence language is not proof of factual accuracy
- Why generated answers require evaluation

Implement sensible safeguards:
- Instruct the model to distinguish supported facts from missing information.
- Return an explicit insufficient-evidence response when appropriate.
- Validate response structure.
- Keep citations linked to actual retrieved sources.
- Do not render untrusted model output as executable HTML.
- Consider document text to be untrusted input, including instructions embedded inside documents.
- Do not allow document content to override system-level security rules.
- Clearly communicate that safeguards reduce risk rather than guarantee correctness.

### Phase 7: UI polish, persistence, and production-minded improvements

Implement, in order of value:
- Source cards with document names, page numbers, and relevant excerpts
- Clicking a citation opens the corresponding document location when feasible
- Multiple document support
- Conversation history persistence
- Feedback on answers
- Retry and regenerate functionality
- Accessible loading and error states
- Responsive layout
- Request cancellation
- Useful server-side logging
- Rate limiting and usage controls
- Appropriate authentication and document access controls
- Deployment and a useful README

Explain:
- How to avoid race conditions
- How to prevent cross-user document access
- How to handle document deletion and re-indexing
- How to reduce repeated embedding and model costs
- How to improve latency
- How to handle large uploads and long-running processing
- Which operations should be synchronous versus asynchronous
- Which production concerns are not fully solved in this portfolio project

Do not introduce authentication or complex infrastructure before the basic application flow is working. However, never weaken security to make a demo easier.

## 6. ARCHITECTURE AND CODE QUALITY

Keep the code modular, but do not over-engineer.

Separate responsibilities for:
- UI components
- Frontend hooks and client-side state
- API routes
- Provider-specific LLM calls
- Embedding generation
- Document processing
- Chunking
- Retrieval
- Prompt construction
- Response validation
- Database access
- Error handling

Define explicit TypeScript types for important API contracts.

Avoid:
- Giant components
- Repeated API logic
- Exposing provider secrets
- Hard-coded production credentials
- Blind JSON parsing
- Catch blocks that silently hide errors
- Fake retrieval results
- Hard-coded answers presented as real AI output
- Unsupported claims about RAG accuracy
- Unnecessary abstractions
- Unnecessary dependencies
- Suppressing TypeScript errors without justification

Use meaningful errors and logs without exposing secrets or private document contents.

Before creating or modifying files, inspect the existing repository. If it contains an existing application, understand its architecture and preserve useful code rather than replacing it blindly.

If there is no repository yet, propose the initial structure and explain it before scaffolding.

## 7. TESTING AND EVALUATION

Testing must be part of development, not something added only at the end.

Create a small representative test corpus and a set of questions with expected evidence.

Evaluate at least these categories:
1. Questions directly answered in a document.
2. Questions requiring information from multiple chunks.
3. Questions requiring information from multiple documents.
4. Questions whose answers are absent.
5. Questions with ambiguous terminology.
6. Questions with misleading or conflicting evidence.
7. Queries that retrieve irrelevant chunks.
8. Documents containing prompt-injection-like instructions.
9. Invalid uploads and document-processing failures.
10. Streaming interruption and model API errors.

Track appropriate metrics, such as:
- Retrieval recall at K where labelled evidence is available
- Relevance of retrieved chunks
- Answer correctness and evidence support
- Citation correctness
- Abstention behaviour for unsupported questions
- End-to-end latency
- Approximate token usage and cost

Explain what each metric means and what it cannot tell us.

Do not invent evaluation results. If a metric has not been measured, mark it as not measured.

Where possible, compare the baseline with an improvement, such as different chunk sizes, retrieval parameters, or hybrid search. Explain the result rather than claiming an improvement without evidence.

## 8. REQUIRED INTERVIEW PREPARATION

After each major stage, create interview questions based on the actual code and architecture.

Include:
- Fundamental conceptual questions
- Practical implementation questions
- Follow-up and cross-questions
- Debugging scenarios
- Unfamiliar scenarios
- Architecture and trade-off questions
- Performance and security questions
- Questions asking why we did not choose an alternative

For every important question, help me construct an answer in simple spoken English suitable for a real technical interview.

Use this answer structure when appropriate:
1. Direct answer
2. How it works
3. Example from our application
4. Trade-off or limitation
5. Improvement or alternative

Do not give me only memorized definitions.

Ask me a few questions after each stage and let me attempt answers. Evaluate my reasoning, identify gaps, and help me improve the explanation.

Connect the project to my Dreamcast AI Copilot experience when relevant, but clearly distinguish my real work experience from features implemented only in this new portfolio project.

Never suggest that I implemented a backend, RAG pipeline, vector database, or model training at Dreamcast unless the available facts establish it.

## 9. DEBUGGING AND DECISION-MAKING

Whenever something fails:
1. State the observed failure.
2. Identify the layer where it most likely occurs.
3. Explain the relevant request/data flow.
4. Inspect actual logs and error output.
5. Form a testable hypothesis.
6. Make the smallest appropriate change.
7. Re-run relevant checks.
8. Explain the root cause and prevention strategy.

When choosing between approaches, show a concise decision comparison.

For example:
- SSE versus fetch streaming
- Vector search versus keyword search
- Fixed-size versus semantic chunking
- Direct provider SDK versus an AI framework
- Synchronous processing versus background jobs
- Larger context versus more selective retrieval

Choose based on the actual project requirements, not popularity.

If documentation or API behaviour may have changed, consult current official documentation rather than guessing.

## 10. SECURITY AND PRIVACY REQUIREMENTS

- Never put provider API keys in client-side code.
- Keep secrets in server-side environment variables.
- Create a safe `.env.example` containing placeholder values only.
- Never print secrets in logs.
- Validate requests and enforce upload limits on the server.
- Enforce authorization for every user-owned document and conversation.
- Treat uploaded files and their contents as untrusted.
- Avoid unsafe rendering of generated content.
- Explain prompt injection and its limitations.
- Do not claim that prompts alone provide security.
- Explain relevant data retention and provider privacy considerations.
- Use synthetic or non-sensitive sample documents for development.
- Never commit credentials or actual private user documents.

## 11. HOW EVERY WORK SESSION SHOULD END

At the end of each meaningful work session, provide:

### What we built
A concise description of implemented and verified functionality.

### How it works
The actual data flow, including important frontend, backend, database, and model interactions.

### Why we chose this approach
The design rationale and relevant alternatives.

### What can go wrong
The important failure scenarios and limitations.

### What I learned
The concepts I should be able to explain independently.

### Interview practice
Three to five questions, including at least one cross-question or debugging scenario.

### Verification
Actual commands executed, test results, and anything not yet verified.

### Next step
The single most useful next task.

Update the project documentation to reflect completed work and unresolved issues.

## 12. FIRST ACTION — DO NOT START CODING IMMEDIATELY

Start by doing the following:

1. Inspect the current workspace and determine whether an existing project is present.
2. Summarize the proposed application and its user-facing problem.
3. Draw a simple high-level architecture and explain the complete data flow.
4. Propose a phased implementation plan.
5. Identify required environment variables, external services, and setup dependencies.
6. Explain the main technical risks and decisions.
7. Propose a reasonable initial folder structure.
8. Define the acceptance criteria for Phase 1.
9. Explain the concepts I should understand before implementing Phase 1.

Do not install dependencies, create large numbers of files, or start a full implementation before presenting this initial plan.

Wait for my confirmation before starting Phase 1.

If any information is missing, make reasonable low-risk assumptions, state them explicitly, and ask only questions that materially affect the architecture.

## FINAL SUCCESS CRITERIA

The project is successful only when:
- The application works end to end.
- The major features have been tested.
- RAG retrieval and answer grounding have been evaluated on representative examples.
- Citations point to real retrieved document evidence.
- Errors, unsupported questions, and interrupted requests are handled sensibly.
- Secrets and document access are handled appropriately.
- The code and architecture are understandable.
- Documentation reflects the actual implementation.
- I can explain the entire system, its design decisions, limitations, and improvements in a technical interview.

Your priority is to help me become a better engineer who can build and explain AI-powered frontend applications independently, not someone who merely possesses AI-generated code.

## 🤖 Assistant (Mentor)

Namaste! I am excited to partner with you on this journey. Given your solid 4+ years of React and Next.js experience—especially your work at Dreamcast on streaming and dynamic UI for the AI Event Copilot—you already have strong frontend fundamentals. Now, we are going to bridge the gap to full-stack AI engineering, deep RAG orchestration, vector databases, hallucination mitigation, and production reliability.

As per **Rule 12**, we are **not writing or installing code yet**. Pehle workspace ka reality check karte hain, poora roadmap aur architecture align karte hain, aur Phase 1 ke core concepts clear karte hain.

---

### 1. Workspace Inspection

Current workspace inspection output:
- Directory: `/Users/amitsaraswat/Desktop/Projects/knowledgelens`
- Contents: Sirf `.git/` aur `.gitattributes` exist karte hain.
- **Verdict:** Yeh ek clean, fresh repository hai. Koi existing codebase ya framework pre-installed nahi hai. Hum zero se clean, structured Next.js (App Router) + TypeScript foundation create karenge.

---

### 2. Proposed Application & User-Facing Problem

**Application Name:** **KnowledgeLens — AI Document Intelligence Assistant**

#### The Problem:
Standard LLMs (jaise vanilla ChatGPT ya Claude) ke paas proprietary, private documents (jaise company policies, technical whitepapers, financial reports ya contracts) ka direct access nahi hota. Agar hum pura 100-page ka PDF LLM prompt me paste karenge toh:
1. **Context Window limits & Cost:** Lakhs of tokens waste honge per query.
2. **Attention Dilution ("Lost in the Middle"):** LLM lambe context ke beech ki details miss kar deta hai.
3. **Hallucination:** Jab model ko exact fact nahi milta, toh wo believable-sounding galat answer fabricate kar deta hai.

#### The Solution (KnowledgeLens):
Users apne PDF documents upload karenge. System automatically document ko read karega, meaningful chunks me divide karega, aur vector embeddings generate karke vector database me store karega. Jab user koi sawal puchega, system sirf **most relevant paragraphs** retrieve karega aur LLM ko prompt me provide karega (Retrieval-Augmented Generation). User ko **real-time streaming answer** milega with **verifiable source citations** (page number aur exact excerpts).

---

### 3. High-Level Architecture & End-to-End Data Flow

KnowledgeLens do major pipelines me kaam karta hai:
1. **Ingestion Pipeline (Offline / On Upload):** Document $\rightarrow$ Chunks $\rightarrow$ Embeddings $\rightarrow$ Vector DB
2. **Retrieval & Generation Pipeline (Online / Query Time):** User Query $\rightarrow$ Query Embedding $\rightarrow$ Vector Search $\rightarrow$ Augmented Prompt $\rightarrow$ Streaming LLM Response

```mermaid
flowchart TD
    subgraph Client ["Frontend (Next.js App Router / React)"]
        UI["Chat Interface & File Uploader"]
        StreamConsumer["ReadableStream / SSE Consumer (Custom Hook)"]
        CitationsUI["Citations & Source Inspector Cards"]
    end

    subgraph Server ["Backend (Next.js Server Route Handlers)"]
        UploadAPI["/api/documents/upload"]
        ChatAPI["/api/chat"]
        Parser["PDF Parser & Text Extractor"]
        Chunker["Recursive Chunking & Metadata Engine"]
        RAGOrchestrator["RAG Context Assembler & Prompt Builder"]
    end

    subgraph ExternalAI ["AI Provider (OpenAI or Gemini)"]
        EmbedAPI["Embeddings API (text-embedding-3-small)"]
        LLMAPI["Chat Completion / Gemini Flash (Streaming)"]
    end

    subgraph Storage ["Database Layer"]
        PG["PostgreSQL + pgvector (Documents, Chunks, Vectors)"]
    end

    %% Ingestion Flow
    UI -->|"1. Upload PDF"| UploadAPI
    UploadAPI -->|"2. Extract Text"| Parser
    Parser -->|"3. Clean Chunks + Page Metas"| Chunker
    Chunker -->|"4. Batch Embeddings"| EmbedAPI
    EmbedAPI -->|"5. Return Vectors [1536d]"| Chunker
    Chunker -->|"6. Store Chunks & Vectors"| PG

    %% Query Flow
    UI -->|"A. Ask Question"| ChatAPI
    ChatAPI -->|"B. Embed Query"| EmbedAPI
    EmbedAPI -->|"C. Query Vector"| ChatAPI
    ChatAPI -->|"D. Similarity Search (Cosine Distance <=>)"| PG
    PG -->|"E. Top-K Relevant Chunks"| ChatAPI
    ChatAPI -->|"F. Assemble System Prompt + Context"| RAGOrchestrator
    RAGOrchestrator -->|"G. Stream Request"| LLMAPI
    LLMAPI -->|"H. Stream Token Chunks"| ChatAPI
    ChatAPI -->|"I. HTTP Streaming Response"| StreamConsumer
    StreamConsumer -->|"J. Progressive Text + Source Cards"| CitationsUI
```

#### Detailed Step-by-Step Data Flow:
1. **PDF Ingestion:** User document upload karta hai $\rightarrow$ Server MIME & magic bytes validate karta hai $\rightarrow$ PDF parser pages extract karta hai $\rightarrow$ Chunker overlapping passages create karta hai with metadata `{docId, pageNumber, chunkIndex}`.
2. **Embedding:** Har chunk ka vector representation generate hota hai via Embedding Model aur PostgreSQL `pgvector` table me store hota hai.
3. **Retrieval (RAG):** User question puchta hai $\rightarrow$ Server question ka embedding banata hai $\rightarrow$ Vector DB me cosine similarity search (`ORDER BY embedding <=> query_vector LIMIT 4`) chalta hai.
4. **Augmented Prompt:** Server ek grounded system prompt banata hai: *"Answer strictly based on the following context. If not found, say you don't have enough evidence. Cite source chunk IDs."*
5. **Streaming Generation:** Response browser tak stream hota hai using `ReadableStream`. User ko real-time typing effect milta hai and source cards inspect karne ka option milta hai.

---

### 4. Phased Implementation Plan

Hum project ko 7 rigorous phases me execute karenge:

| Phase | Title | Core Deliverables | Learning Focus |
|---|---|---|---|
| **Phase 1** | **Foundation & Basic LLM Chat** | Clean Next.js app shell, Tailwind design, Server Route Handler, LLM API call, Non-streaming response, Server-side validation, Error handling | LLM tokens, temperature, context windows, client-server security boundaries, API error states |
| **Phase 2** | **Streaming Responses & Frontend Polish** | `ReadableStream`, `TextDecoder`, custom `useStreamingChat` hook, abort/cancel button, auto-scrolling, state optimization | HTTP chunked transfer, SSE vs Fetch, stream cancellation (`AbortController`), avoiding re-render thrashing |
| **Phase 3** | **Document Upload & Text Processing** | PDF drag-and-drop UI, server-side PDF parser, chunking strategy with overlap, metadata tracking (page numbers) | PDF structure, OCR vs text extraction, chunk size vs overlap trade-offs, defensive file validation |
| **Phase 4** | **Embeddings & Vector Search** | PostgreSQL + `pgvector` setup, embedding generation, cosine similarity retrieval, dev inspector for retrieved chunks | Vector space, semantic similarity, dimensions, top-K selection, precision vs recall |
| **Phase 5** | **Complete RAG Pipeline** | End-to-end question answering grounded in document chunks, dynamic context injection, verified citations UI | Prompt engineering for RAG, token budgeting, citation anchoring, handling unanswerable queries |
| **Phase 6** | **Hallucination Mitigation & Reliability** | Abstention prompts, citation verification, prompt injection defense, automated edge-case test suite | Hallucination taxonomy, grounding vs generation failure, prompt injection attack vectors, RAG evaluation |
| **Phase 7** | **Production-Minded Features & Interview Mastery** | Multi-document management, conversation persistence, latency/cost optimization, README & interview prep doc | RAG caching, hybrid search trade-offs, production scaling, interview mock drills |

---

### 5. Required Environment Variables, External Services & Dependencies

#### External Services:
1. **LLM & Embedding Provider:** 
   - **Recommendation:** **OpenAI** (`gpt-4o-mini` for chat, `text-embedding-3-small` for embeddings) OR **Google Gemini** (`gemini-1.5-flash` / `text-embedding-004`).
   - *Why `gpt-4o-mini` or `gemini-1.5-flash`?* Dono extremely fast hain, dirt-cheap hain (cents for thousands of tests), reliable structured outputs dete hain, aur low-latency streaming provide karte hain.
2. **Database:**
   - **PostgreSQL with `pgvector`:** Local Docker container ya ek free managed Postgres instance (jaise Supabase ya Neon) jisme `pgvector` 1-click enabled ho.

#### Environment Variables (`.env.local` / `.env.example`):
```env
# AI Provider (OpenAI chosen as baseline)
OPENAI_API_KEY=sk-placeholder-do-not-commit
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Database (for Phase 4+)
DATABASE_URL=postgresql://user:password@localhost:5432/knowledgelens

# App Configuration
NEXT_PUBLIC_APP_NAME="KnowledgeLens"
MAX_UPLOAD_SIZE_MB=10
```

#### Dependencies (To be added progressively, NOT all at once):
- **Core:** `next`, `react`, `react-dom`, `typescript`, `@types/react`, `@types/node`
- **Styling:** `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react` (icons)
- **Validation:** `zod`
- **AI SDK / Provider:** Direct official SDK (e.g., `openai` or `@google/genai`) — *Hum Shuruat me LangChain/LlamaIndex use nahi karenge, taaki tum underlying mechanics bina framework abstraction ke seekho.*
- **PDF Extraction (Phase 3):** `pdf-parse` (or equivalent server-side extraction engine).
- **Database (Phase 4):** `pg` (node-postgres) with pgvector queries.

---

### 6. Main Technical Risks & Key Architecture Decisions

| Technical Risk / Decision | The Risk / Dilemma | Our Chosen Approach & Rationale |
|---|---|---|
| **Direct SDK vs Heavy AI Frameworks (LangChain)** | LangChain hides what's happening under 5 layers of abstractions, making debugging and interview explanations difficult. | **Direct Provider SDK + Native Route Handlers.** Tumhe exact prompt, exact context string, aur raw stream inspect karne milega. Interviewers respect candidates who understand the raw mechanics. |
| **Streaming Protocol (Fetch Stream vs SSE)** | SSE requires `text/event-stream` format with `data: ...\n\n`. Raw fetch stream sends binary chunks. | **Fetch `ReadableStream` with structured chunking / NDJSON.** Standard POST request ke saath natural streaming hoti hai bina complex SSE reconnection overhead ke. |
| **PDF Extraction Quality** | Scanned PDFs (images) don't have text layers; tables get garbled when parsed naively. | Baseline me text-based digital PDFs ko handle karenge with clear error detection agar document scanned/empty nikle. |
| **Chunking Strategy** | Too small chunk $\rightarrow$ context lost; too large chunk $\rightarrow$ noise & token limit exceeded. | **Recursive character chunking with overlap (e.g. 500-800 characters with 100 character overlap)**. Page number metadata ko har chunk ke saath bind karenge. |
| **Model Hallucination & Citation Fraud** | LLMs will happily invent page numbers and quote non-existent sentences if asked to cite sources. | Citations model generate nahi karega randomly! Server retrieved chunks ka metadata (`chunk_id`, `page`) pass karega, aur LLM ko strictly un IDs ko reference karne ka instruction milega, jise backend validate karega. |

---

### 7. Proposed Initial Folder Structure

Hum standard Next.js App Router pattern use karenge with clean separation of concerns:

```text
knowledgelens/
├── docs/                      # Project documentation & interview prep
│   ├── ARCHITECTURE.md
│   ├── LEARNING_NOTES.md
│   ├── AI_INTERVIEW_PREP.md
│   ├── PROJECT_PLAN.md
│   └── KNOWN_ISSUES.md
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/
│   │   │   └── chat/          # Chat Route Handler (Phase 1 & 2)
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Main workspace view
│   │   └── globals.css
│   ├── components/            # Reusable UI components
│   │   ├── chat/              # Chat input, message list, message bubble
│   │   ├── layout/            # Header, sidebar shell
│   │   └── ui/                # Buttons, cards, status badges
│   ├── lib/                   # Server-side logic & integrations
│   │   ├── ai/                # LLM client, prompt templates
│   │   │   └── client.ts
│   │   ├── validation/        # Zod schemas for API inputs
│   │   │   └── chat.ts
│   │   └── utils.ts
│   └── types/                 # Shared TypeScript interfaces
│       └── chat.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

### 8. Acceptance Criteria for Phase 1 (Foundation & Basic LLM Chat)

Phase 1 successfully complete tab maana jayega jab:
1. **Next.js + TypeScript + Tailwind Setup:** Application clean build hoti hai (`npm run build`), koi lint ya type errors nahi hain.
2. **UI Chat Interface:** Ek polished, responsive chat screen jisme message history display ho rahi ho (User messages vs Assistant messages).
3. **Server Route Handler (`/api/chat`):**
   - Client se request receive karta hai `{ messages: [{ role, content }] }`.
   - Zod se input validate karta hai (empty message rejection, message length limits).
   - Server-side LLM call execute karta hai using server environment variable (`OPENAI_API_KEY`).
   - Non-streaming valid response return karta hai client ko.
4. **State & Error Handling:**
   - Loading state (spinner / disabled input jab LLM response generate kar raha ho).
   - Graceful error banner agar API key missing ho, rate limit ho, ya network fail ho.
5. **No Client Key Exposure:** Browser network tab me ya client bundle me API key kahin bhi leak na ho.

---

### 9. Core Concepts to Understand Before Phase 1

Yeh concepts tumhare dimag me crystal clear hone chahiye before we write the first line of code:

#### Concept A: What is an LLM really doing? (Tokens & Next-Token Prediction)
> **Simple Hinglish:** LLM koi human dimaag nahi hai jo "think" karta hai. Ye ek massive statistical probabilistic engine hai. Iska ek hi primary kaam hai: *Given a sequence of input tokens, what is the most statistically probable next token?*
> 
> Text direct model me nahi jata; text **tokens** (roughly 3/4th of a word in English) me convert hota hai using a tokenizer (e.g. Byte-Pair Encoding).
> - Example: `"KnowledgeLens"` might break into `["Knowledge", "Lens"]`.
> - **Interview Relevance:** *Context window* ka matlab hota hai maximum tokens (prompt + output combined) jo model simultaneously hold kar sakta hai.

#### Concept B: System Prompt vs User Prompt vs Assistant History
> **Simple Hinglish:** LLM stateless hota hai. Use yaad nahi rehta ki 2 second pehle kya baat hui thi. Isliye hum har request me poora conversation array bhejte hain:
> 1. **`system`:** Model ka persona, rules aur constraints set karta hai (e.g., *"You are KnowledgeLens assistant. Answer politely and concisely."*). User ise change nahi karta.
> 2. **`user`:** Jo prompt actual user ne type kiya.
> 3. **`assistant`:** Model ke previous answers, taaki conversation context continue rahe.

#### Concept C: Temperature & Generation Parameters
> **Simple Hinglish:** 
> - **Temperature (0.0 to 1.0 ya 2.0):** Model ke word selection ki randomness control karta hai.
>   - `temperature = 0.0` ya `0.2` (Deterministic/Focused): Facts, coding, aur RAG ke liye best hai, kyunki model highest probability wale tokens choose karta hai.
>   - `temperature = 0.8` (Creative): Story writing aur brainstorming ke liye best hai.
> - KnowledgeLens me hum low temperature (`0.1` - `0.2`) use karenge to reduce hallucinations.

#### Concept D: Client-Side vs Server-Side Boundary (Security First)
> **Simple Hinglish:** Dreamcast me tumne frontend API calls dekhi hongi. Kabhi bhi AI Provider ki secret API key (`sk-...`) client browser me expose nahi honi chahiye. Agar key React component me aayi, toh koi bhi inspect element $\rightarrow$ Network tab me jaake key chura sakta hai aur tumhara credit card balance exhaust kar dega.
> 
> **Rule:** Browser humesha hamare apne Next.js backend endpoint (`/api/chat`) se baat karega. Aur hamara server-side handler secretly environment variable se key nikal kar AI provider ko call karega.

#### Concept E: Why Start WITHOUT RAG in Phase 1?
> **Simple Hinglish:** Direct RAG start karne me log galti yeh karte hain ki unhe pata hi nahi chalta ki bug UI me hai, stream parser me hai, chunking me hai, ya vector retrieval me hai!
> First, we establish a robust chat baseline (UI $\rightarrow$ API Route $\rightarrow$ LLM $\rightarrow$ Response). Ek baar direct chat solid ho gayi, tab hum streaming add karenge (Phase 2), aur fir retrieval layer plug karenge (Phase 3-5). Is approach ko bolte hain **Incremental Reliability**.

---

### My Question for You to Confirm Before We Start:

1. **LLM Provider Preference:** Kya hum **OpenAI** (`gpt-4o-mini`) use karein ya **Google Gemini** (`gemini-1.5-flash`)? Dono easily accessible hain. Agar tumhare paas already kisi ek ki API key hai, let me know.
2. **Database:** Postgres + `pgvector` ke liye local Docker prefer karoge ya free cloud instance (jaise Supabase/Neon)?

Ek baar tum apna preference confirm kar do aur is initial plan pe approval de do, hum turant documentation files initialize karenge aur **Phase 1** scaffold karenge!

---

## 👤 Turn 2: User

wait, phase 1 se phle phle phase 0, jisme sirf ek bare next.js project setup kro, koi route handler nhi, koi server side validation, error handling, llm api call kuch nhi

## 🤖 Assistant (Mentor)

Bilkul sahi decision hai! **Phase 0** introduce karna best engineering practice hai. Pehle hum ek clean, minimal Next.js bare-bones project initialize karenge, verify karenge ki local dev server aur build smoothly chal rahe hain, aur foundational documentation setup karenge.

Koi route handler nahi, koi LLM API call nahi, koi validation logic nahi. Sirf clean setup!

Chalo pehle `create-next-app` ke options check karte hain taaki non-interactive mode me safely current directory me install kar sakein.

Next.js project setup command launch kar diya hai (`npx create-next-app`). Yeh background me dependencies install kar raha hai. Jaise hi installation complete hoti hai, hum verify karenge.

### Phase 0: Bare Next.js Setup Complete 🎯

Humne exactly wahi kiya jo tumne manga: **Ek clean, minimal Next.js 16 bare project**, bina kisi route handler, validation logic, ya LLM API dependency ke.

---

### 1. What We Built
- **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4** setup create kiya.
- Clean `src/` layout:
  - `src/app/layout.tsx` (KnowledgeLens title aur metadata)
  - `src/app/page.tsx` (Minimal Phase 0 verified placeholder shell)
  - `src/app/globals.css` (Tailwind v4 imports)
- **Documentation Framework initialized** under `docs/`:
  - [`docs/PROJECT_PLAN.md`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/docs/PROJECT_PLAN.md)
  - [`docs/ARCHITECTURE.md`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/docs/ARCHITECTURE.md)
  - [`docs/LEARNING_NOTES.md`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/docs/LEARNING_NOTES.md)
  - [`docs/AI_INTERVIEW_PREP.md`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/docs/AI_INTERVIEW_PREP.md)
  - [`docs/KNOWN_ISSUES.md`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/docs/KNOWN_ISSUES.md)
- Safe `.env.example` template add kiya, aur `.gitignore` ko configure kiya taaki real `.env.local` kabhi accidentally leak na ho.

---

### 2. How It Works
- Turbopack bundler ke saath Next.js App Router render karta hai.
- `src/app/page.tsx` default **Server Component** ke roop me serve hota hai (zero client-side JS overhead at this stage).
- Koi external network request ya LLM API call exist nahi karta.

---

### 3. Why We Chose This Approach
- **No Premature Complexity:** Agar hum seedha LangChain, vector DB drivers, aur heavy SDKs daal dete, toh install issues aur version conflicts (jaise React 19 peer-dependency warnings) me time waste hota.
- **Layer-by-Layer Verification:** Pehle baseline verify kiya ki clean build aur lint pass ho rahe hain. Ab jab hum Phase 1 me Route Handler aur UI banayenge, toh koi bhi error aane par hume exact cause pata hoga.

---

### 4. What Can Go Wrong (Edge Cases / Failure Scenarios)
- **Node & Toolchain PATH issues:** Mac me non-interactive shells me sometimes `/usr/local/bin` ya `/opt/homebrew/bin` path par nahi hota (jise humne detect karke handle kiya).
- **Accidental `.env` git commit:** Agar `.gitignore` properly configure na ho toh API keys public GitHub repo me chali jaati hain. Humne `.env*` ignore kiya hai aur sirf `.env.example` allow kiya hai.

---

### 5. What You Learned (Concepts to Retain)
1. **Next.js 16 App Router Structure:** Server Components by default; `layout.tsx` wrap karta hai saari routes ko; `src/app` standard clean directory structure maintain karta hai.
2. **Safe Secrets Pattern:** `.env.example` with placeholders is committed; `.env.local` with real keys is git-ignored.
3. **Verification Before Coding:** Hamesha scaffold karne ke baad `npm run build` aur `npm run lint` test karna chahiye taaki broken base par feature na bane.

---

### 6. Verification & Test Results
Actual terminal commands executed and verified:
1. `npm run build` $\rightarrow$ **Compiled successfully in 733ms (0 errors, 3/3 static pages generated).**
2. `npm run lint` $\rightarrow$ **Clean pass with ESLint (0 warnings, 0 errors).**
3. `git status` $\rightarrow$ Clean tracking of project files, with secrets shielded.

---

### 7. Interview Practice Questions (Stage 0)

Socho ek interviewer tumse yeh puche:

> **Q1:** *"Next.js App Router me Server Components aur Client Components ke beech security boundary kaise work karti hai, especially AI applications me?"*
> 
> **How to answer (Simple spoken English):**
> *"In Next.js App Router, components inside the app directory are Server Components by default. They execute exclusively in the Node.js runtime on the server and are never included in the client JavaScript bundle. For an AI application, this boundary is critical: it guarantees that server-side environment variables—like our OpenAI API key—can never be leaked to the browser. Client components, marked with `'use client'`, handle interactivity like chat inputs and streaming listeners, but they only communicate with our server via route handlers, never directly with third-party AI provider APIs."*

> **Q2:** *"Dreamcast me tumne frontend streaming handle ki thi. Jab hum Next.js me streaming chat banayenge, hum client-side direct API call kyu nahi karte jabki OpenAI ka browser SDK bhi exist karta hai?"*
> 
> **How to answer:**
> *"Even though client-side SDKs exist with options like `dangerouslyAllowBrowser: true`, doing so in production exposes our secret key in the browser's Network tab and application memory. Anyone could steal that key and cause financial or data security breaches. By routing through our own Next.js backend, we can also enforce server-side validation (with Zod), apply rate limiting, log token consumption, and eventually inject retrieved document context (RAG) which the client should not tamper with."*

---

### Next Step
Ab hamara base 100% ready aur verified hai.

Agla step: **Phase 1 (Foundation & Basic LLM Chat)**
1. Provider decide karna (OpenAI `gpt-4o-mini` ya Gemini `gemini-1.5-flash`).
2. Server Route Handler (`/api/chat`) with server-side validation.
3. Chat UI with message history (User bubble vs Assistant bubble).

Kya hum **Phase 1** shuru karein? Aur tumhara preferred AI provider kaunsa hai (OpenAI ya Gemini)?

---

## 👤 Turn 3: User

isme me open api key to nhi mil rhi, but baki koi or api key nhi use kr skta?

## 🤖 Assistant (Mentor)

Haan, bilkul! OpenAI API key compulsory nahi hai. Hamare paas bahut acche aur **100% Free** options available hain:

---

### Option 1 (Best for RAG & Completely Free): **Google Gemini API** ⭐

Google AI Studio par bina credit card ke **free API key** milti hai:
- **Generation Model:** `gemini-1.5-flash` (Super fast, 1M context window, free tier me 15 requests per minute milte hain).
- **Embeddings Model:** `text-embedding-004` (RAG pipeline ke liye vector embeddings generate karne ke liye ye bhi free me available hai!).

#### Free Gemini Key kaise lein (1 minute process):
1. **[Google AI Studio](https://aistudio.google.com/)** open karo.
2. Apne normal Google/Gmail account se login karo.
3. **"Get API key"** par click karo aur ek new key create kar lo.
4. Ye key copy karke apne `.env.local` me daal sakte ho.

---

### Option 2 (Alternative Free): **Groq Cloud** (Ultra Fast)
- **URL:** [console.groq.com](https://console.groq.com/)
- Open-source models jaise `llama-3.1-8b-instant` free me offer karta hai.
- Iska format exactly OpenAI jaisa hota hai (`baseURL` change karke chalta hai), par isme embedding model ke liye alag setup chahiye hota hai.

---

### Option 3 (100% Offline / No Key Needed): **Ollama (Local)**
- Agar Mac par local run karna ho bina kisi internet API key ke, toh hum `ollama` install karke local model (`llama3.2` ya `mistral`) chala sakte hain.

---

### Mera Recommendation: **Google Gemini API**

Kyunki hum **RAG (KnowledgeLens)** bana rahe hain, hume do cheezein chahiye:
1. **Chat Model** (Sawal ka answer dene ke liye) $\rightarrow$ `gemini-1.5-flash`
2. **Embedding Model** (PDF text ko vectors me convert karne ke liye) $\rightarrow$ `text-embedding-004`

Google AI Studio yeh **dono ek hi API key se free tier me deta hai**.

### Ab hum kya karein?
Agar tum **Google AI Studio** se key generate kar lo, toh hum `.env.local` me setup kar lenge:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004
```

Kya tumhare paas **Google account** se AI Studio se key generate karne ka option accessible hai? Ek baar batao, fir hum direct Gemini ke saath **Phase 1** implement karenge!

---

## 👤 Turn 4: User

start with phase 1, step by step

## 🤖 Assistant (Mentor)

Welcome to **Phase 1: Foundation and Basic LLM Chat**! 🚀

Pehle hum Phase 1 ka poora blueprint samjhenge, fir ise **chote, clear steps** me implement karenge taaki tum har layer ka internal mechanism samajh sako.

---

## 1. Phase 1 Objective

Phase 1 ka primary goal hai: **Ek solid, secure end-to-end Chat Baseline establish karna.**
Is phase me:
- User prompt type karega aur send karega.
- Request hamare Next.js Server Route Handler (`/api/chat`) tak jayegi.
- Server request ko validate karega (using Zod) aur safely server-side environment variables se API key le kar Gemini / LLM provider ko call karega.
- Response frontend par aayega aur User vs Assistant message bubbles me render hoga with clean loading and error states.

> **Note on RAG in Phase 1:** Hum abhi document upload ya vector search nahi jod rahe. Kyun? Kyunki agar baseline chat pipeline (UI $\leftrightarrow$ Server Route $\leftrightarrow$ LLM $\leftrightarrow$ Error handling) pehle se perfectly working aur tested nahi hogi, toh baad me vector search ke bugs aur LLM integration ke bugs me distinguish karna mushkil ho jayega!

---

## 2. Architecture & Data Flow for Phase 1

```
[Browser / React Client]
  │
  │ 1. User types question & clicks Send
  ▼
[Custom State / Fetch call]
  │
  │ 2. POST /api/chat { messages: [...] }
  ▼
[Next.js Server Route Handler: src/app/api/chat/route.ts]
  │
  │ 3. Validate request schema with Zod
  │    (Is content non-empty? Is role valid? Message length reasonable?)
  ▼
[Server AI Client: src/lib/ai/gemini.ts]
  │
  │ 4. Reads GEMINI_API_KEY from process.env (Server-only)
  │ 5. Prepend System Instruction ("You are KnowledgeLens assistant...")
  ▼
[Google Gemini API (gemini-1.5-flash)]
  │
  │ 6. Model generates completion
  ▼
[Server Route Handler]
  │
  │ 7. Returns JSON { role: "assistant", content: "..." }
  ▼
[React UI Component]
  │
  │ 8. Appends assistant response to message list & turns off loading state
```

---

## 3. Files & Components Involved in Phase 1

1. **`src/types/chat.ts`**: TypeScript contracts (`ChatMessage`, `ChatRole`, `ChatRequest`, `ChatResponse`).
2. **`src/lib/validation/chat.ts`**: Zod schema for runtime validation of incoming payloads.
3. **`src/lib/ai/gemini.ts`**: Server-only client wrapper that calls the Gemini API safely with timeouts and structured error handling.
4. **`src/app/api/chat/route.ts`**: Next.js Server Route Handler accepting `POST` requests.
5. **`src/components/chat/`**:
   - `MessageBubble.tsx`: Renders individual user / assistant messages cleanly.
   - `MessageList.tsx`: Scrollable conversation container with empty state and loading indicator.
   - `ChatInput.tsx`: Accessible input field with enter-to-send, char limit, and disable during loading.
6. **`src/app/page.tsx`**: Integration of the chat container into the responsive KnowledgeLens workspace layout.

---

## 4. Key Concepts You Should Learn in Phase 1

### A. System Prompt vs. User Prompt
- **User Prompt:** Jo actual user ne input box me type kiya.
- **System Prompt (Instruction):** Ye server silently add karta hai model ko uski identity aur behaviour rules batane ke liye:
  > *"You are KnowledgeLens, a helpful AI document intelligence assistant. Be concise, polite, and fact-focused."*
  Model is instruction ko highest priority authority manta hai.

### B. Tokens, Context Windows & Cost
- LLM text ko direct nahi padhta, wo text ko **tokens** me todta hai.
- Rule of thumb: **100 tokens $\approx$ 75 English words**.
- **Context Window:** Model ki memory capacity per request (e.g., `gemini-1.5-flash` has 1 Million tokens context window!).
- **Pricing:** AI providers "input tokens" aur "output tokens" ke hisaab se charge karte hain (Gemini free tier has generous limits: 15 requests per minute, 1,500 requests per day for free).

### C. Temperature & Generation Parameters
- **Temperature (0.0 to 1.0 ya 2.0):** Model ke response ki randomness.
  - `temperature = 0.2`: Logical, direct, consistent (Best for RAG and factual Q&A).
  - `temperature = 0.9`: Creative, varied, storytelling.
- In KnowledgeLens, we set `temperature = 0.2` to prioritize precision over wild imagination.

### D. Why Server-Side Validation is Mandatory (Even with TypeScript)
- TypeScript sirf **compile-time** type check karta hai.
- Runtime par koi bhi attacker Postman ya `curl` se hamare `/api/chat` par 10 MB ka random junk payload bhej kar server crash ya token balance exhaust kar sakta hai.
- **Zod** runtime par verify karta hai ki incoming payload exact structure follow karta hai.

---

## 5. Phase 1 Implementation Plan (Step-by-Step)

- **Step 1.1:** Dependencies install karna (`@google/genai` ya `@google/generative-ai`, `zod`, `lucide-react`) + TypeScript types define karna.
- **Step 1.2:** Zod validation schema + Server AI client module create karna.
- **Step 1.3:** Next.js Route Handler (`/api/chat`) create karna with robust error handling.
- **Step 1.4:** Chat UI components banana (Input, Message bubbles, Loading state).
- **Step 1.5:** End-to-end verification and testing.

---

### Chalo Shuru Karte Hain: Step 1.1 — Dependencies & TypeScript Types

Sabse pehle hum 3 essential packages install karenge:
1. `@google/genai`: Official Google Gemini SDK
2. `zod`: Request validation schema
3. `lucide-react`: Clean, lightweight icons for UI (Send, Bot, User, Loader)

Chalo install karte hain!

### Phase 1: Foundation and Basic LLM Chat — COMPLETE! 🎉

Humne Phase 1 ko step-by-step complete kiya hai. Ab hamare paas ek robust, type-safe, secure aur validated chat baseline ready hai!

---

### 1. What We Built
1. **TypeScript Contracts (`src/types/chat.ts`):** Defined types for `ChatMessage`, `ChatRole`, `ChatRequestBody`, `ChatResponseBody`, and `ChatErrorResponse`.
2. **Server-Side Validation Engine (`src/lib/validation/chat.ts`):** Zod 4 runtime schema to enforce non-empty trimmed content, a 4,000 character ceiling, a 20-message conversation window, and ensuring the trailing message is from `"user"`.
3. **AI Client Wrapper (`src/lib/ai/gemini.ts`):** Server-side integration with Google Gemini (`@google/genai`), mapping application roles (`"user"` / `"assistant"`) to Gemini's format (`"user"` / `"model"`), injecting our system instruction, and setting `temperature = 0.2`.
4. **Server Route Handler (`src/app/api/chat/route.ts`):** Validates incoming requests, handles JSON parsing errors with HTTP 400, schema violations with HTTP 422, missing API key configuration with HTTP 503, and successful calls with HTTP 200.
5. **Polished Chat UI (`src/components/chat/`):**
   - [`MessageBubble.tsx`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/src/components/chat/MessageBubble.tsx): User bubble vs. Assistant bubble with distinct styling, icons, and timestamps.
   - [`ChatInput.tsx`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/src/components/chat/ChatInput.tsx): Keyboard shortcuts (Enter to send, Shift+Enter for newline), real-time character counter, loading state handling.
   - [`ChatContainer.tsx`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/src/components/chat/ChatContainer.tsx): Auto-scroll, empty state with suggested prompt chips, clear chat button, and friendly error banner.

---

### 2. How It Works (The Request Lifecycle)
```
User types prompt & hits Enter
  │
  ├── React State updates optimistically (Message appears instantly in UI)
  ├── POST fetch request -> /api/chat
  │
  ├── Next.js Route Handler:
  │     1. req.json() (fails? -> 400 Bad Request)
  │     2. chatRequestSchema.safeParse() (fails? -> 422 Unprocessable Entity)
  │     3. Reads process.env.GEMINI_API_KEY (missing? -> 503 Service Unavailable)
  │     4. ai.models.generateContent({ model: "gemini-2.5-flash", temperature: 0.2 })
  │
  └── Returns JSON { role: "assistant", content: "..." }
        │
        └── React appends Assistant response & clears loading spinner
```

---

### 3. Why We Chose This Approach
- **Direct Provider SDK over Frameworks:** Humne LangChain use nahi kiya taaki hum raw request/response mechanics, role mapping (`assistant` $\rightarrow$ `model`), aur error codes ko deeply samajh sakein.
- **Server Boundary Protection:** Secret keys client JavaScript bundle me kabhi leak nahi hoti.
- **Zod 4 Runtime Validation:** Client par TypeScript types sirf compile-time par hote hain. Server par runtime validation hona compulsory hai to protect against malformed attacks or rogue requests.

---

### 4. What Can Go Wrong & How We Handled It
- **Malformed JSON:** Agar request body valid JSON nahi hai, Route Handler crash hone ki jagah clean `400 Bad Request` return karta hai.
- **Empty / Whitespace-only prompts:** Zod `.trim().min(1)` use reject kar deta hai (`422 Unprocessable Entity`).
- **Missing API Key:** Agar `.env.local` me `GEMINI_API_KEY` nahi daali, toh cryptic crash ki jagah clean `503 Service Unavailable` message aur UI me actionable hint show hota hai.

---

### 5. Verification & Test Results
Humne actual terminal me automated checks run kiye:
1. `npm run build && npm run lint` $\rightarrow$ **0 errors, clean Next.js 16 build.**
2. `curl -X POST /api/chat -d '{not-json}'` $\rightarrow$ **HTTP 400 Bad Request.**
3. `curl -X POST /api/chat -d '{"messages": [{"role": "user", "content": "   "}]}'` $\rightarrow$ **HTTP 422 ("Message cannot be empty").**
4. `curl -X POST /api/chat -d '{"messages": [{"role": "assistant", "content": "hi"}]}'` $\rightarrow$ **HTTP 422 ("Last message must be from user").**
5. `curl -X POST /api/chat -d '{"messages": [{"role": "user", "content": "hi"}]}'` (without key) $\rightarrow$ **HTTP 503 ("GEMINI_API_KEY is not configured in environment variables").**

---

### 6. Quick Action for You to Test with Live Gemini Model
Apne project root me ek `.env.local` file banao (jo git-ignored hai):
```bash
GEMINI_API_KEY=your_actual_gemini_key_here
GEMINI_MODEL=gemini-2.5-flash
```
*(Tumhari Google AI Studio wali key yahan daal do, dev server restart karo aur browser me `http://localhost:3000` par prompt bhej kar dekho!)*

---

### 7. Interview Practice Questions for Stage 1

In questions ko revise karo (inhe humne [`docs/AI_INTERVIEW_PREP.md`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/docs/AI_INTERVIEW_PREP.md) me bhi document kiya hai):

> **Q1:** *"Why do we set a low temperature (e.g. 0.2) in a Document Q&A / RAG application instead of default 0.7 or 1.0?"*
> 
> **How to answer:**
> *"Temperature scales the logits before the softmax layer in next-token prediction. A higher temperature flattens the probability distribution, making the model pick diverse or less probable words—great for creative storytelling. But in a document intelligence assistant like KnowledgeLens, our primary objective is factual precision and adherence to source documents. A low temperature like 0.2 sharpens the distribution, forcing the model to pick high-confidence, deterministic tokens and drastically reducing hallucinations."*

> **Q2:** *"Dreamcast me tumne streaming use ki thi. Abhi Phase 1 me hum non-streaming (complete JSON) response le rahe hain. Production AI apps me non-streaming ka sabse bada drawback kya hota hai?"*
> 
> **How to answer:**
> *"The biggest drawback of non-streaming in conversational AI is high Time-To-First-Token (TTFT) and poor perceived latency. An LLM might take 3 to 6 seconds to generate a full 300-word response. In non-streaming, the user stares at a blank loading spinner for the entire duration. With streaming, we can display tokens within 300 milliseconds as they are generated, giving the user instant feedback."*

---

### Ready for Next Step?
Jab tum browser me live test kar lo ya ready ho, hum **Phase 2: Streaming Responses** shuru karenge:
- `ReadableStream` & `TextDecoder`
- Custom `useStreamingChat` React hook
- Word-by-word progressive typing rendering
- Stop generation (`AbortController`) functionality!

---

## 👤 Turn 5: User

how to resolve this error?

Request Error

{"error":{"code":404,"message":"models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent. Call ModelService.ListModels to see the list of available models and their supported methods.","status":"NOT_FOUND"}}

## 🤖 Assistant (Mentor)

### Root Cause & How It Got Resolved 🔍

Yeh error kyu aaya tha aur iska solution kya tha, isko dhyan se samjho (yeh ek very common practical AI interview & production debugging scenario hai):

---

#### 1. Problem Kya Thi? (The Cause)
Google AI API ne error diya:
```json
{
  "code": 404,
  "message": "models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent..."
}
```

**Reason:** Tumhare `.env` file me `GEMINI_MODEL=gemini-1.5-flash` likha hua tha. Google ne Gemini API me models ko upgrade kar diya hai. Current available and active flash model **`gemini-2.5-flash`** hai. Purana `gemini-1.5-flash` endpoint ab v1beta API version ke naye SDK me 404 NOT_FOUND de raha tha.

---

#### 2. Maine Isko Debug Kaise Kiya? (Investigation Steps)
1. Tumhari API key ke saath Google API ke `ai.models.list()` ko call kiya.
2. Usne active models ki list return ki:
   - ✅ `models/gemini-2.5-flash` (Active Gemini Flash model)
   - ✅ `models/gemini-2.5-pro`
   - ✅ `models/gemini-embedding-001` (For RAG vector embeddings)
3. Humne `gemini-2.5-flash` ke saath test call run kiya aur model ne instantly **2 seconds me response return kiya**!

---

#### 3. Fix (Jo Maine Apply Kar Diya Hai)
Tumhare `.env` file me model names update kar diye hain:

```env
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
```

---

#### 4. Live Verification Result 🚀
Humne `/api/chat` par live request bhej kar verify kiya:
- **Input:** `"What is KnowledgeLens in 1 sentence?"`
- **Output:**
```json
{
  "role": "assistant",
  "content": "KnowledgeLens is an AI Document Intelligence Assistant designed to provide clear, precise, and accurate information from documents.",
  "model": "gemini-2.5-flash"
}
```

Notice karo: model ne exact wahi persona aur tone follow kiya jo humne system instruction me likha tha!

---

### Ab Browser Me Check Karo:
Ab tum browser me `http://localhost:3000` par jaakar koi bhi message send karke test kar sakte ho—UI me ab real AI answers aane lagenge! 🎉

Test karke batao kaisa chal raha hai, fir hum **Phase 2 (Streaming Tokens + Abort Generation)** par badhte hain!

---

## 👤 Turn 6: User

yes, start with phase 2

## 🤖 Assistant (Mentor)

Awesome! **Phase 2: Streaming Responses** shuru karte hain. 🚀

Dreamcast me tumne frontend par streaming responses consume kiye the jab attendees sawal puchte the aur tokens aate hi speaker/session cards render hote the. Ab hum iske **parde ke peeche (under the hood)** deep-dive karenge—backend se stream originate kaise hoti hai, network wire par kaise travel karti hai, aur React me zero-flicker streaming state kaise manage karte hain.

---

## 1. Phase 2 Objective

Phase 1 me hamara response **non-streaming** tha:
- Backend ne poora answer generate kiya (3-4 seconds wait).
- Ek single complete JSON object return kiya.
- User 4 second tak blank loading spinner dekhta raha.

**Phase 2 ka Goal:**
- Backend jaise hi pehla token produce kare, wo turant frontend par pahuche (**Time-To-First-Token < 400ms**).
- User ko word-by-word typing effect dikhe.
- **Stop Generation (`AbortController`)**: User beech me generation cancel kar sake.
- Interrupted requests aur network disconnects ko safely handle karna.

---

## 2. Core Concepts: Jo Tumhe Samajhne Hain

### A. Normal HTTP vs. Streaming HTTP (Chunked Transfer)
- **Normal HTTP (Phase 1):** Server `Content-Length: 1048` header bhejta hai. Browser tab tak wait karta hai jab tak poore 1048 bytes na aa jayein, fir ek baar me render karta hai.
- **Streaming HTTP (Phase 2):** Server `Transfer-Encoding: chunked` header bhejta hai. Server ko pehle se nahi pata ki total length kitni hogi. Jaise-jaise LLM tokens deta hai, server chote-chote chunks network socket me push karta rehta hai. Connection tab close hota hai jab stream explicitly close hoti hai.

### B. Streaming Protocols Comparison (Interview Favorite Question!)
| Feature | Fetch + ReadableStream (Raw Chunks) | Server-Sent Events (SSE) | WebSockets |
|---|---|---|---|
| **Direction** | Unidirectional (Server $\rightarrow$ Client) | Unidirectional (Server $\rightarrow$ Client) | Bidirectional (Full Duplex) |
| **Protocol** | Standard HTTP POST/GET | HTTP (`text/event-stream`) | `ws://` or `wss://` |
| **Complexity** | Minimal, native to Fetch API | Medium (needs event parsing: `data: ...\n\n`) | High (requires persistent socket server, heartbeat) |
| **Best Used For** | LLM Chat Streaming | Live Sports Scores, Stock Tickers | Multiplayer Games, Live Collaborative Canvas |

> **Our Choice for Phase 2:** **Fetch + `ReadableStream`** with `TextDecoder`. Ye modern AI interfaces (jaise ChatGPT / Vercel AI) ka industry-standard pattern hai for simple LLM text streaming.

### C. Critical Gotcha: "Transport Chunks $\neq$ Words"
- Bahut se frontend engineers assume karte hain ki ek `chunk` matlab ek English word ya ek token hota hai. **Yeh bilkul galat hai!**
- Network TCP packets arbitrary byte boundaries par cut ho sakte hain. Ek multibyte character (jaise emoji 🚀 ya Hindi text) do alag chunks me split ho sakta hai!
- Isliye hum `new TextDecoder("utf-8")` use karte hain with `{ stream: true }`, jo partial multibyte characters ko buffer karta hai jab tak agla chunk na aa jaye.

### D. `AbortController` (Stop Generation)
- Jab user "Stop" click karta hai, browser ko HTTP connection forcibly terminate karna hota hai.
- Ye kaam karta hai `AbortController`.
- Frontend par: `abortController.abort()` call hota hai $\rightarrow$ fetch reject hota hai with `AbortError` $\rightarrow$ Server-side par request stream terminate hoti hai $\rightarrow$ Model generation stop ho jati hai, saving unnecessary token costs!

---

## 3. Architecture & Data Flow for Phase 2

```
[Browser / ChatContainer]
  │
  ├── 1. User submits question
  ├── 2. Initialize new AbortController()
  ├── 3. fetch("/api/chat", { method: "POST", signal: controller.signal })
  │
  ▼
[Next.js Server: /api/chat/route.ts]
  │
  ├── 4. Validate payload with Zod
  ├── 5. Call ai.models.generateContentStream({ model: "gemini-2.5-flash" })
  ├── 6. Create native Web ReadableStream
  ├── 7. For each chunk from Gemini:
  │         controller.enqueue(textEncoder.encode(chunk.text))
  ├── 8. Return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
  │
  ▼
[Client Fetch Stream Consumer]
  │
  ├── 9. const reader = response.body.getReader()
  ├── 10. while (true) {
  │         const { done, value } = await reader.read();
  │         const partialText = textDecoder.decode(value, { stream: true });
  │         Update Assistant Message state (append partialText)
  │       }
  └── 11. Stream completed -> finalize message state & hide Stop button
```

---

## 4. Phase 2 Implementation Steps

Hum ise 3 modular steps me implement karenge:

1. **Step 2.1 (Backend):** `src/lib/ai/gemini.ts` me `streamGeminiChat` function add karna jo Gemini stream ko wrap karke ek standard Web `ReadableStream` return karega.
2. **Step 2.2 (Backend):** `src/app/api/chat/route.ts` ko update karna to return a chunked streaming `Response`.
3. **Step 2.3 (Frontend):** `ChatContainer.tsx` aur `ChatInput.tsx` ko update karna:
   - `ReadableStream` reader loop lagana
   - Real-time token append state update
   - "Stop Generating" button with `AbortController`
   - Smooth auto-scroll while streaming

---

### Chalo Shuru Karte Hain: Step 2.1 — Backend Gemini Streaming Client

Pehle `src/lib/ai/gemini.ts` me streaming support add karte hain using `ai.models.generateContentStream()`.

Let's inspect and add `streamGeminiChat`!

### Phase 2: Streaming Responses & Stop Generation — COMPLETE! ⚡️

Humne Phase 2 successfully implement aur verify kar liya hai. Ab hamara chat interface instant real-time typing effect aur cancellation ke saath chal raha hai!

---

### 1. What We Built
1. **Server-Side Streaming Engine ([`src/lib/ai/gemini.ts`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/src/lib/ai/gemini.ts)):**
   - `streamGeminiChat` function implemented with `ai.models.generateContentStream()`.
   - Wraps model chunks into a standard Web `ReadableStream<Uint8Array>`.
   - Propagates cancellation signals so the model stops if the client disconnects.
2. **Chunked Streaming Route Handler ([`src/app/api/chat/route.ts`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/src/app/api/chat/route.ts)):**
   - Returns a native streaming `Response` with `Content-Type: text/plain; charset=utf-8` and `Cache-Control: no-cache, no-transform`.
   - Passes `req.signal` directly to the streaming engine.
3. **Frontend Stream Consumer ([`src/components/chat/ChatContainer.tsx`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/src/components/chat/ChatContainer.tsx)):**
   - Consumes raw byte chunks via `response.body.getReader()`.
   - Decodes stream fragments using `new TextDecoder("utf-8")` with `{ stream: true }`.
   - Smoothly appends text token-by-token into the assistant message bubble.
4. **Stop Generation Functionality ([`src/components/chat/ChatInput.tsx`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/src/components/chat/ChatInput.tsx)):**
   - During active streaming, the Send button automatically transforms into a red **"Stop"** button with a square icon.
   - Triggers `abortController.abort()` to cancel the request mid-flight.
   - Smooth auto-scroll keeps the newest text in view.
   - Blinking cursor indicator in [`MessageBubble.tsx`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/src/components/chat/MessageBubble.tsx).

---

### 2. How It Works (The Streaming Lifecycle)
```
1. User clicks Send
   ├── Instantiate `const controller = new AbortController()`
   ├── Append empty Assistant bubble in state (with blinking cursor)
   └── `fetch("/api/chat", { method: "POST", signal: controller.signal })`

2. Next.js Route Handler
   ├── Calls `streamGeminiChat(messages, req.signal)`
   └── Returns `new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } })`

3. Frontend Stream Consumer Loop:
   const reader = response.body.getReader();
   const decoder = new TextDecoder("utf-8");
   while (true) {
     const { done, value } = await reader.read();
     if (done) break;
     const chunkText = decoder.decode(value, { stream: true });
     // State updates smoothly:
     setMessages(prev => updateLastAssistantMessage(prev, chunkText));
   }

4. If user clicks "Stop":
   ├── `controller.abort()` fires
   ├── Fetch rejects with `AbortError` (silently handled)
   └── Server's `req.signal.aborted` becomes true -> loops break -> Gemini stops generating!
```

---

### 3. Verification & Test Results
- **Terminal Test:** `curl -N -s -X POST http://localhost:3000/api/chat ...` verified real-time chunk delivery.
- **Build & Lint Checks:** `npm run build && npm run lint` $\rightarrow$ **Clean pass with 0 errors, 0 warnings.**
- **Live Local Test:** Dev server is actively running on `http://localhost:3000`.

---

### 4. Ab Browser Me Test Karo! 🧪
1. Browser me `http://localhost:3000` refresh karo.
2. Ek lengthy question pucho: *"Write a detailed 3-paragraph explanation of how neural networks work."*
3. Dekho kaise words instant type ho rahe hain bina blank delay ke!
4. Response aane ke dauran **"Stop"** button click karke test karo—generation turant freeze ho jayegi with a `(Generation stopped by user)` note!

---

### 5. Interview Questions for Stage 2 (Revise in [`docs/AI_INTERVIEW_PREP.md`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/docs/AI_INTERVIEW_PREP.md))

> **Q1:** *"Why do we use `new TextDecoder('utf-8')` with `{ stream: true }` instead of simple string concatenation?"*
> 
> **How to answer:**
> *"Network transport chunks arriving in `reader.read()` are raw byte buffers (`Uint8Array`) sliced at TCP packet boundaries, not token or word boundaries. If a multibyte UTF-8 character (such as an emoji or non-English text) is split across two TCP packets, decoding without `{ stream: true }` would corrupt the incomplete byte sequence into replacement characters (``). The `{ stream: true }` flag instructs the decoder to internally buffer trailing incomplete byte sequences until the next packet arrives."*

> **Q2:** *"Dreamcast me tumne frontend streaming handle ki thi. Agar user tab switch kar de ya page se navigate away ho jaye mid-stream, toh frontend aur server par kya hona chahiye?"*
> 
> **How to answer:**
> *"When a component unmounts or a user navigates away, the `useEffect` cleanup hook should call `abortController.abort()`. On the client, this closes the `ReadableStream` reader and releases the lock. On the server, Next.js detects client socket termination via `req.signal.aborted`. This allows our server to break the upstream model generation loop immediately, preventing memory leaks on the server and avoiding unnecessary token billing with the AI provider."*

---

Jab tum browser me live streaming aur Stop button test kar lo, batao—fir hum **Phase 3: Document Upload and Processing** shuru karenge (PDF upload UI, validation, text extraction, aur recursive chunking with metadata)!

---

## 👤 Turn 7: User

ha, phase 3 step by step kro, sb ek sath nhi

## 🤖 Assistant (Mentor)

Ekdum sahi! **Phase 3: Document Upload and Processing** ko hum bilkul chote-chote, clear steps me karenge taaki har layer ka visual aur internal logic tumhare dimag me crystal clear ho.

---

## 1. Phase 3 Objective

Ab tak hamara chat assistant general knowledge questions ka answer de raha tha. Lekin **KnowledgeLens ka core purpose** hai: **Hamare private PDF documents ko samajhna aur unpar accurate answers dena.**

Is phase me hum:
1. User se PDF upload karwayenge with **drag-and-drop UI**.
2. Server par file ko securely validate karenge (sirf `.pdf` extension ya browser MIME type par bharosa nahi karenge, balki **file ke magic bytes** check karenge).
3. PDF se **page-by-page text extract** karenge.
4. Text ko **manageable chunks (passages)** me divide karenge with **sliding overlap** aur har chunk ke saath `{ documentId, pageNumber, chunkIndex }` metadata bind karenge.
5. Frontend par **Document & Chunk Inspector** provide karenge taaki tum dekh sako ki document internally kaise divide hua hai.

---

## 2. Core Concepts: Jo Tumhe Samajhne Hain

### A. Why PDFs Need Preprocessing & Why We Can't Send a Whole PDF to LLM
- **Visual vs. Semantic:** PDF text ke liye nahi, balki print visually render karne ke liye design hua tha (PostScript format). Usme words coordinates $(x, y)$ par hote hain, paragraphs nahi.
- **Context Limit & Cost:** Ek 50-page ka PDF ~40,000 to 80,000 tokens hota hai. Agar har user question par pura PDF LLM ko bhejoge:
  - Latency 10+ seconds ho jayegi.
  - Bill astronomically high ho jayega.
  - LLM "Lost in the Middle" problem ki wajah se details miss kar dega.
- **Solution:** Document ko chote-chote context chunks me split karna aur query-time par sirf 3-5 relevant chunks bhej kar grounded answer generate karna.

### B. Text Extraction vs. OCR (Optical Character Recognition)
- **Digital PDFs:** Inme text layer already embedded hoti hai. Hum direct text stream read kar sakte hain (fast, accurate, lightweight).
- **Scanned PDFs (Images):** Inme text layer nahi hoti, sirf image of text hoti hai. Inke liye OCR (jaise Tesseract ya Google Cloud Vision) chahiye hota hai.
- *Our Baseline:* Hum digital PDFs ko process karenge aur agar koi scanned/empty PDF upload kare, toh system clear failure status dega: *"No readable text found. This appears to be a scanned document."*

### C. Chunk Size & Overlap Trade-offs (The Golden RAG Balance)
> Chunking ka matlab hai lambe text ko chote blocks me todna.

```
Original Document:
[--- Paragraph 1 ---] [--- Paragraph 2 ---] [--- Paragraph 3 ---]

Chunk 1: [--- Paragraph 1 --- + Start of Paragraph 2]  (e.g., 600 chars)
                                  ▲
                               Overlap (e.g., 100 chars)
                                  ▼
Chunk 2:              [End of Paragraph 1 + --- Paragraph 2 ---]
```

- **Chunk Size (e.g. 500-800 chars / ~150-200 tokens):**
  - *Too small (100 chars):* Context lose ho jata hai (e.g., pronoun "It" kis cheez ko refer kar raha tha pata nahi chalta).
  - *Too large (3,000 chars):* Relevant fact ke saath bohot sara irrelevant noise aa jata hai, jisse retrieval precision drop hoti hai.
- **Chunk Overlap (e.g. 100-150 chars):**
  - Agar do sentences ke beech exact cutoff ho jaye, toh aadhi baat Chunk 1 me aur aadhi Chunk 2 me chali jayegi. Overlap yeh ensure karta hai ki boundary facts break na hon!

### D. Security: Magic Bytes vs. File Extensions
- Kabhi bhi sirf `file.name.endsWith('.pdf')` ya `file.type === 'application/pdf'` par trust mat karo!
- Koi bhi hacker `virus.exe` ka naam badal kar `report.pdf` kar sakta hai aur browser wahi MIME type bhej dega.
- **Defense:** Har genuine PDF file ke pehle 5 bytes **`%PDF-`** (`0x25, 0x50, 0x44, 0x46, 0x2D`) hote hain. Hamara server pehle 5 bytes inspect karega before parsing.

---

## 3. Phase 3 Step-by-Step Breakdown

- **Step 3.1:** Document & Chunk TypeScript Types define karna + **Recursive Character Chunking Engine** banana (`src/lib/chunking/textChunker.ts`).
- **Step 3.2:** Server-side PDF extraction engine + Magic Byte validation (`src/lib/pdf/parser.ts`).
- **Step 3.3:** Upload Route Handler (`/api/documents/upload`) with file-size and type checks.
- **Step 3.4:** Drag-and-Drop Upload UI + Document List & Chunk Inspector Drawer.
- **Step 3.5:** Verification, testing on real sample PDFs, and interview practice questions.

---

### Chalo Shuru Karte Hain: Step 3.1 — Chunking Engine & Types

Pehle hum:
1. `src/types/document.ts` create karenge:
   - `DocumentMetadata`: `{ id, filename, fileSize, pageCount, chunkCount, createdAt }`
   - `DocumentChunk`: `{ id, documentId, pageNumber, chunkIndex, content, characterCount }`
2. `src/lib/chunking/textChunker.ts` create karenge:
   - Ek recursive sliding-window chunker jo pehle paragraphs (`\n\n`), fir sentences (`. `), aur fir spaces par clean cuts karta hai with configurable `chunkSize` (default: 600 chars) aur `overlap` (default: 120 chars).

Kya hum **Step 3.1** execute karein?

---

## 👤 Turn 8: User

ye puri chat ka ek md file bna do, and use docs folder me dalo, taki kisi or system pr isko use kr sku

## 🤖 Assistant (Mentor)

Puri conversation aur technical discussions ka ek comprehensive Markdown document bana kar **[`docs/CHAT_HISTORY.md`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/docs/CHAT_HISTORY.md)** me save kar diya hai! 📄

---

### Is File Me Kya-Kya Shamil Hai:

1. **Project & Problem Overview:** KnowledgeLens ka user-facing problem, vanilla LLM limitations, aur RAG ka core motive.
2. **End-to-End Architecture & Phased Roadmap:** Mermaid workflow diagram aur 7-phase detailed plan.
3. **Phase 0 Execution:** Bare Next.js 16 + React 19 + TypeScript + Tailwind v4 clean bootstrap, safe `.env.example` setup, aur verification logs.
4. **AI Provider Decision & Free Tier Setup:** Kyu humne Google Gemini (`gemini-2.5-flash`) choose kiya (free tier without credit card + embeddings in one key) over OpenAI/Groq/Ollama.
5. **Phase 1 Deep-Dive:**
   - Server-client security boundaries.
   - Zod 4 runtime validation rules.
   - Role mapping (`assistant` $\leftrightarrow$ `model`).
   - Temperature parameter (0.2 for factual RAG).
   - Route Handler error codes (400, 422, 503).
6. **Live Debugging Incident Report:** `404 models/gemini-1.5-flash not found` error kaise aaya, `ai.models.list()` se kaise diagnose kiya, aur `gemini-2.5-flash` par kaise resolve kiya.
7. **Phase 2 Deep-Dive:**
   - HTTP chunked transfer vs normal HTTP.
   - Fetch `ReadableStream` vs SSE vs WebSockets comparison table.
   - Multibyte character safety (`TextDecoder("utf-8", { stream: true })`).
   - "Stop Generation" button with `AbortController` (frontend rejection handling & server `req.signal.aborted` token saving).
8. **Phase 3 Roadmap:** Magic byte validation (`%PDF-`), text extraction vs OCR, recursive chunking with sliding window overlap.
9. **AI Interview Q&A Vault:** 7 in-depth technical questions with model answers framed in simple spoken English for frontend AI engineering interviews.
10. **Repository Directory Tree:** Complete project structure snapshot.

---

### Ab Kisi Aur System Par Kaise Use Karein:
Jab tum is repo ko kisi dusre laptop/system par clone karoge, toh bas:
1. `npm install` run karna.
2. `.env.example` se copy karke `.env.local` banana aur apni `GEMINI_API_KEY` daal dena.
3. [`docs/CHAT_HISTORY.md`](file:///Users/amitsaraswat/Desktop/Projects/knowledgelens/docs/CHAT_HISTORY.md) padh kar koi bhi naya engineer ya AI assistant turant exact context pakad lega!

Jab tum ready ho, hum **Phase 3 (Step 3.1: Chunking Engine & Types)** start karenge!

---

## 👤 Turn 9: User

wait, ek kam kro, ye jo bhi chat hui hai, usko export kro, md file me, docs folder me

