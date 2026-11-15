-- KnowledgeLens Vector Database Schema (PostgreSQL + pgvector)

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Documents Metadata Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  page_count INTEGER NOT NULL,
  chunk_count INTEGER NOT NULL,
  extracted_characters INTEGER NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Document Chunks Table with Vector(768) Column
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  page_number INTEGER NOT NULL,
  character_count INTEGER NOT NULL,
  token_estimate INTEGER NOT NULL,
  embedding vector(768) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Fast Approximate Nearest Neighbor (ANN) HNSW Index for Cosine Distance (<=>)
CREATE INDEX IF NOT EXISTS document_chunks_embedding_hnsw_idx
ON document_chunks
USING hnsw (embedding vector_cosine_ops);

