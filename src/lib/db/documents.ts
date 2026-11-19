import { query, initializeDatabase } from "./index";
import { DocumentMetadata, DocumentChunk } from "@/types/document";

export interface RetrievedChunk extends DocumentChunk {
  similarityScore: number;
}

/**
 * Inserts a document and all its chunks with their vector embeddings in a single transaction.
 */
export async function saveDocumentWithVectors(
  document: DocumentMetadata,
  chunks: DocumentChunk[],
  embeddings: number[][]
): Promise<void> {
  await initializeDatabase();

  if (chunks.length !== embeddings.length) {
    throw new Error(
      `Chunk and embedding count mismatch: ${chunks.length} chunks vs ${embeddings.length} embeddings.`
    );
  }

  // 1. Insert document record
  await query(
    `
    INSERT INTO documents (id, name, size, page_count, chunk_count, extracted_characters, uploaded_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      size = EXCLUDED.size,
      page_count = EXCLUDED.page_count,
      chunk_count = EXCLUDED.chunk_count,
      extracted_characters = EXCLUDED.extracted_characters,
      uploaded_at = EXCLUDED.uploaded_at;
  `,
    [
      document.id,
      document.name,
      document.size,
      document.pageCount,
      document.chunkCount,
      document.extractedCharacters,
      document.uploadedAt,
    ]
  );

  // 2. Batch insert chunks with vector embeddings
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = embeddings[i];
    const vectorString = `[${embedding.join(",")}]`;

    await query(
      `
      INSERT INTO document_chunks (
        id, document_id, document_name, chunk_index, content, 
        page_number, character_count, token_estimate, embedding
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::vector)
      ON CONFLICT (id) DO NOTHING;
    `,
      [
        chunk.id,
        chunk.documentId,
        chunk.documentName,
        chunk.chunkIndex,
        chunk.content,
        chunk.pageNumber,
        chunk.characterCount,
        chunk.tokenEstimate,
        vectorString,
      ]
    );
  }
}

/**
 * Performs Cosine Similarity Vector Search using pgvector's <=> distance operator.
 * Returns the Top-K most semantically relevant chunks with their similarity score (0.0 to 1.0).
 *
 * NOTE: Does NOT call initializeDatabase() — the schema is already set up in Supabase.
 * initializeDatabase() is only needed during document upload (saveDocumentWithVectors).
 */
export async function searchSimilarChunks(
  queryEmbedding: number[],
  topK = 5,
  documentId?: string,
  minSimilarity = 0
): Promise<RetrievedChunk[]> {
  // Skip initializeDatabase() here — schema is already set up in Supabase.
  // Calling it on every RAG request causes DDL timeout on cold connections.
  const vectorString = `[${queryEmbedding.join(",")}]`;

  const sql = `
    SELECT
      id,
      document_id AS "documentId",
      document_name AS "documentName",
      chunk_index AS "chunkIndex",
      content,
      page_number AS "pageNumber",
      character_count AS "characterCount",
      token_estimate AS "tokenEstimate",
      1 - (embedding <=> $1::vector) AS "similarityScore"
    FROM document_chunks
    WHERE ($2::UUID IS NULL OR document_id = $2::UUID)
    ORDER BY embedding <=> $1::vector
    LIMIT $3;
  `;

  const result = await query<{
    id: string;
    documentId: string;
    documentName: string;
    chunkIndex: number;
    content: string;
    pageNumber: number;
    characterCount: number;
    tokenEstimate: number;
    similarityScore: string | number;
  }>(sql, [vectorString, documentId || null, topK]);

  return result.rows
    .map((row) => ({
      ...row,
      similarityScore: parseFloat(String(row.similarityScore)),
    }))
    .filter((chunk) => chunk.similarityScore >= minSimilarity);
}

/**
 * Deletes a document and cascades deletion of its vector chunks.
 */
export async function deleteDocument(documentId: string): Promise<void> {
  await query("DELETE FROM documents WHERE id = $1", [documentId]);
}

