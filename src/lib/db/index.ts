import { Pool, QueryResult, QueryResultRow } from "pg";

let pool: Pool | null = null;
let isInitialized = false;
// Prevents concurrent init calls from racing each other
let initializationPromise: Promise<void> | null = null;

/**
 * Returns a singleton connection pool to PostgreSQL.
 * Uses longer timeouts suitable for cloud databases (Supabase, Neon)
 * which may have cold-start latency on idle connections.
 */
export function getDbPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.trim() === "" || connectionString.includes("your_password_here")) {
    throw new Error(
      "DATABASE_URL is not configured. Please add a valid PostgreSQL connection string to your .env file."
    );
  }

  // Cloud databases (Neon, Supabase) require SSL
  const isCloudDb =
    connectionString.includes("neon.tech") ||
    connectionString.includes("supabase") ||
    connectionString.includes("sslmode=require");

  pool = new Pool({
    connectionString,
    ssl: isCloudDb ? { rejectUnauthorized: false } : undefined,
    max: 5,                        // Keep pool small for serverless / free-tier
    idleTimeoutMillis: 60000,      // Keep idle connections alive longer
    connectionTimeoutMillis: 15000, // 15s — enough for Supabase cold-start
    allowExitOnIdle: false,
  });

  pool.on("error", (err) => {
    console.error("[DB] Unexpected error on idle PostgreSQL client:", err.message);
  });

  return pool;
}

/**
 * Executes a parameterized SQL query against the connection pool.
 */
export async function query<R extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<R>> {
  const db = getDbPool();
  return db.query<R>(text, params);
}

/**
 * Ensures the pgvector extension + schema tables exist.
 * - Protected by a singleton promise so concurrent requests don't race.
 * - If the DB tables already exist (Supabase setup), this is a no-op after first run.
 * - Does NOT block query() — only called explicitly from upload & search routes.
 */
export async function initializeDatabase(): Promise<void> {
  // Already done — fast path
  if (isInitialized) return;

  // If another concurrent call is already initializing, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

    initializationPromise = (async () => {
      const db = getDbPool();
      try {
        await db.query(`CREATE EXTENSION IF NOT EXISTS vector;`);

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

        await db.query(`
        CREATE INDEX IF NOT EXISTS document_chunks_embedding_hnsw_idx
        ON document_chunks
        USING hnsw (embedding vector_cosine_ops);
      `);

      isInitialized = true;
      console.log("[DB] ✅ PostgreSQL + pgvector schema ready.");
    } catch (err: unknown) {
      const error = err as Error;
      // Reset so the next request can retry
      initializationPromise = null;
      console.error("[DB] ❌ Schema initialization failed:", error.message);
      throw new Error(`Database schema initialization failed: ${error.message}`);
    }
  }) ();

  return initializationPromise;
}

