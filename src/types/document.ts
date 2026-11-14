/**
 * Document Intelligence & Ingestion Types
 * Used throughout Document Upload, Text Extraction, and Chunking (Phase 3).
 */

export interface DocumentMetadata {
  id: string; // Unique UUID
  name: string; // Original filename (e.g., "quarterly_report.pdf")
  size: number; // File size in bytes
  pageCount: number; // Total extracted pages
  uploadedAt: string; // ISO 8601 timestamp
  chunkCount: number; // Total semantic chunks generated
  extractedCharacters: number; // Total extracted character count
}

export interface DocumentPage {
  pageNumber: number; // 1-indexed page number
  text: string; // Cleaned and normalized text of the page
  characterCount: number;
}

export interface DocumentChunk {
  id: string; // Unique UUID for chunk
  documentId: string; // Associated document UUID
  documentName: string; // Original filename for citation reference
  chunkIndex: number; // 0-indexed position within document
  content: string; // Passage text
  pageNumber: number; // Document page where this chunk originated
  characterCount: number; // Raw length of passage
  tokenEstimate: number; // Heuristic token count (~Math.ceil(chars / 4))
}

export interface DocumentUploadResponse {
  success: true;
  document: DocumentMetadata;
  chunks: DocumentChunk[];
}

export interface DocumentUploadError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

export interface ChunkingOptions {
  chunkSize?: number; // Target chunk character size (default: 600)
  chunkOverlap?: number; // Overlap character size between consecutive chunks (default: 120)
}

