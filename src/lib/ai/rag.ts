import { RetrievedChunk } from "@/lib/db/documents";

/**
 * Minimum cosine similarity required for a chunk to be considered relevant.
 * Cosine similarity ranges from 0.0 to 1.0 (1 - cosine distance).
 * Values below 0.50 are typically background noise or off-topic queries.
 */
export const RAG_SIMILARITY_THRESHOLD = 0.50;

/**
 * Builds a strict grounded RAG system instruction.
 * Injects retrieved document excerpts and enforces the model to answer
 * ONLY from provided context — the core hallucination safeguard.
 */
export function buildRagSystemInstruction(chunks: RetrievedChunk[]): string {
  const excerpts = chunks
    .map(
      (chunk, i) =>
        `[Excerpt ${i + 1} | ${chunk.documentName} | Page ${chunk.pageNumber} | Similarity: ${(chunk.similarityScore * 100).toFixed(1)}%]\n${chunk.content}`
    )
    .join("\n\n---\n\n");

  return `You are KnowledgeLens, an AI Document Intelligence Assistant.

DOCUMENT CONTEXT (Retrieved via semantic vector search):
==========================================================
${excerpts}
==========================================================

STRICT GROUNDING RULES — YOU MUST FOLLOW THESE:
1. Answer ONLY using information found in the document excerpts above.
2. If the answer is not present in the excerpts, respond with: "I could not find relevant information about this in the uploaded document."
3. After every factual claim, cite your source inline using this EXACT format: [Source: <DocumentName>, Page <N>]
4. Do not hallucinate, speculate, or draw from general knowledge outside the excerpts.
5. Keep answers concise, structured, and factual.`;
}

/**
 * Builds an explicit abstention system instruction when NO chunks pass the confidence threshold.
 * Instructs the model to state clearly that the document does not contain the answer,
 * completely preventing hallucination or guesswork.
 */
export function buildAbstentionInstruction(documentName?: string): string {
  const docRef = documentName ? `the uploaded document ("${documentName}")` : "the uploaded document";

  return `You are KnowledgeLens, an AI Document Intelligence Assistant.

STRICT GROUNDING & ABSTENTION MODE:
The user has asked a question, but semantic vector search found NO relevant passages with sufficient confidence in ${docRef}.

RULES:
1. Clearly and politely inform the user that ${docRef} does not contain information to answer their query.
2. If the user sent a general greeting (e.g., "hi", "hello"), greet them politely and invite them to ask questions about ${docRef}.
3. DO NOT attempt to answer off-topic questions from general world knowledge.
4. Never invent facts or hallucinate content not present in the document.
5. Do NOT include any [Source: ...] citation tags since no document chunks matched.`;
}

/**
 * Builds a default non-RAG system instruction (when no document is loaded).
 */
export const DEFAULT_CHAT_INSTRUCTION = `You are KnowledgeLens, an AI Document Intelligence Assistant.
Your goal is to assist users with clarity, precision, and accuracy.
Keep responses concise, well-structured, and factual.
If you are unsure of an answer, state that clearly rather than inventing facts.
Let the user know they can upload a PDF document to enable grounded document Q&A.`;

/**
 * Parses inline citations from the LLM response text.
 * Pattern: [Source: <docName>, Page <N>]
 */
export interface ParsedCitation {
  raw: string;        // e.g. "[Source: Job Description.pdf, Page 1]"
  documentName: string;
  pageNumber: number;
  index: number;      // position in full text
}

export function parseCitations(text: string): ParsedCitation[] {
  const regex = /\[Source:\s*([^,\]]+),\s*Page\s*(\d+)\]/g;
  const citations: ParsedCitation[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    citations.push({
      raw: match[0],
      documentName: match[1].trim(),
      pageNumber: parseInt(match[2], 10),
      index: match.index,
    });
  }

  return citations;
}

