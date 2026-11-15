import { Pool, QueryResult, QueryResultRow } from "pg";

let pool: Pool | null = null;
let isInitialized = false;

/**
 * Returns a singleton connection pool to PostgreSQL.
 */
export function getDbPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.trim() === "" || connectionString.includes("your_password_here")) {
    throw new Error(
      "DATABASE_URL is not configured. Please add a valid PostgreSQL connection string (Neon or Supabase) to your .env file."
    );
  }

  // Cloud databases (Neon, Supabase) require SSL
  const isCloudDb = connectionString.includes("neon.tech") || connectionString.includes("supabase") || connectionString.includes("sslmode=require");

  pool = new Pool({
    connectionString,
    ssl: isCloudDb ? { rejectUnauthorized: false } : undefined,
    max: 10, // Max clients in connection pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client:", err);
  });

  return pool;
}

/**
 * Executes a parameterized SQL query.
 */
export async function query<R extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<R>> {
  const db = getDbPool();
  return db.query<R>(text, params);
}

/**
 * Ensures the pgvector extension, documents, and document_chunks tables exist.
 * Runs once upon server startup / first database interaction.
 */
export async function initializeDatabase(): Promise<void> {
  if (isInitialized) return;

  const db = getDbPool();

  try {
    // 1. Enable pgvector
    await db.query(`CREATE EXTENSION IF NOT EXISTS vector;`);

    // 2. Documents table
    await db.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        size INTEGER NOT NULL,
        page_count INTEGER NOT NULL,
        chunk_count INTEGER NOT NULL,
        extracted_characters INTEGER NOT NULL,
        uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 3. Document chunks with vector(768)
    await db.query(`
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
    `);

    // 4. HNSW cosine index
    await db.query(`
      CREATE INDEX IF NOT EXISTS document_chunks_embedding_hnsw_idx
      ON document_chunks
      USING hnsw (embedding vector_cosine_ops);
    `);

    isInitialized = true;
    console.log("✅ PostgreSQL + pgvector schema initialized successfully.");
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Failed to initialize database schema:", error.message);
    throw new Error(`Database schema initialization failed: ${error.message}`);
  }
}

