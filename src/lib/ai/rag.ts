import { RetrievedChunk } from "@/lib/db/documents";

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

