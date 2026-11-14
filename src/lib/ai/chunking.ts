import type { DocumentChunk, DocumentPage, ChunkingOptions } from "@/types/document";

export const DEFAULT_CHUNK_SIZE = 600; // Target character length per chunk
export const DEFAULT_CHUNK_OVERLAP = 0; // Default to 0 for clean, non-repeating distinct chunks

const HIERARCHICAL_SEPARATORS = ["\n\n", "\n", ". ", "? ", "! ", " ", ""];

/**
 * Recursively splits a text into segments smaller than or equal to `chunkSize`
 * using the highest-priority semantic separator that fits.
 */
function splitTextRecursively(
  text: string,
  chunkSize: number,
  separatorIndex = 0
): string[] {
  const trimmed = text.trim();
  if (trimmed.length <= chunkSize) {
    return trimmed.length > 0 ? [trimmed] : [];
  }

  // If we have exhausted all separators, perform a hard character slice
  if (separatorIndex >= HIERARCHICAL_SEPARATORS.length) {
    const hardSlices: string[] = [];
    for (let i = 0; i < trimmed.length; i += chunkSize) {
      hardSlices.push(trimmed.slice(i, i + chunkSize));
    }
    return hardSlices;
  }

  const separator = HIERARCHICAL_SEPARATORS[separatorIndex];
  const parts = separator === "" ? trimmed.split("") : trimmed.split(separator);

  // If separator didn't split text, try the next separator
  if (parts.length <= 1) {
    return splitTextRecursively(trimmed, chunkSize, separatorIndex + 1);
  }

  const result: string[] = [];
  let currentAccumulator = "";

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    // Reconstruct with separator (unless it's the last part or character split)
    const piece = i < parts.length - 1 && separator !== "" ? part + separator : part;

    if (currentAccumulator.length + piece.length <= chunkSize) {
      currentAccumulator += piece;
    } else {
      if (currentAccumulator.trim().length > 0) {
        result.push(currentAccumulator.trim());
      }

      // If a single piece is itself larger than chunkSize, recursively split it with next separator
      if (piece.length > chunkSize) {
        const subChunks = splitTextRecursively(piece, chunkSize, separatorIndex + 1);
        result.push(...subChunks);
        currentAccumulator = "";
      } else {
        currentAccumulator = piece;
      }
    }
  }

  if (currentAccumulator.trim().length > 0) {
    result.push(currentAccumulator.trim());
  }

  return result;
}

/**
 * Safely extracts trailing overlap text from the previous chunk,
 * snapping forward to the next whitespace boundary so words are NEVER sliced in half
 * (e.g., prevents "user-friendly" from becoming "ser-friendly").
 */
function getCleanTrailingOverlap(text: string, targetOverlap: number): string {
  if (targetOverlap <= 0 || text.length <= targetOverlap) return "";

  const rawCutIndex = text.length - targetOverlap;
  // Snap forward to the next space boundary
  const spaceIndex = text.indexOf(" ", rawCutIndex);

  if (spaceIndex !== -1 && spaceIndex < text.length - 1) {
    return text.slice(spaceIndex + 1).trim();
  }

  return "";
}

/**
 * Applies sliding window overlap across generated chunks to preserve
 * context across boundaries without butchering words.
 */
function mergeWithOverlap(
  splits: string[],
  chunkSize: number,
  chunkOverlap: number
): string[] {
  if (chunkOverlap <= 0 || splits.length <= 1) return splits;

  const overlappingChunks: string[] = [];

  for (let i = 0; i < splits.length; i++) {
    const current = splits[i];

    if (i === 0) {
      overlappingChunks.push(current);
      continue;
    }

    // Grab cleanly aligned trailing words from previous chunk
    const previous = splits[i - 1];
    const cleanOverlap = getCleanTrailingOverlap(previous, chunkOverlap);

    if (cleanOverlap.length > 0) {
      overlappingChunks.push(`${cleanOverlap} ${current}`.trim());
    } else {
      overlappingChunks.push(current);
    }
  }

  return overlappingChunks;
}

/**
 * Chunks an array of DocumentPage objects recursively while preserving page provenance.
 * Each chunk tracks its original page number for grounded RAG citations.
 */
export function chunkDocumentPages(
  pages: DocumentPage[],
  documentId: string,
  documentName: string,
  options?: ChunkingOptions
): DocumentChunk[] {
  const chunkSize = options?.chunkSize || DEFAULT_CHUNK_SIZE;
  const chunkOverlap =
    options?.chunkOverlap !== undefined
      ? options.chunkOverlap
      : DEFAULT_CHUNK_OVERLAP;

  const allChunks: DocumentChunk[] = [];
  let globalChunkIndex = 0;

  for (const page of pages) {
    if (!page.text || page.text.trim().length === 0) {
      continue;
    }

    // 1. Recursive semantic split on page text
    const rawSplits = splitTextRecursively(page.text, chunkSize);

    // 2. Apply sliding overlap across splits
    const finalPassages = mergeWithOverlap(rawSplits, chunkSize, chunkOverlap);

    // 3. Transform to DocumentChunk with metadata
    for (const passage of finalPassages) {
      if (passage.trim().length === 0) continue;

      const characterCount = passage.length;
      // Heuristic token estimation: ~4 English characters per LLM token
      const tokenEstimate = Math.ceil(characterCount / 4);

      allChunks.push({
        id: crypto.randomUUID(),
        documentId,
        documentName,
        chunkIndex: globalChunkIndex++,
        content: passage,
        pageNumber: page.pageNumber,
        characterCount,
        tokenEstimate,
      });
    }
  }

  return allChunks;
}
