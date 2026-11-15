import { GoogleGenAI } from "@google/genai";

const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";
export const VECTOR_DIMENSION = 768; // Matryoshka output dimensionality

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured in environment variables. Please add a valid GEMINI_API_KEY to your .env file."
    );
  }

  return new GoogleGenAI({ apiKey });
}

/**
 * Computes a 768-dimensional vector embedding for a single text input.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Cannot generate embedding for an empty string.");
  }

  const ai = getGeminiClient();

  try {
    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: trimmed,
      config: {
        outputDimensionality: VECTOR_DIMENSION,
      },
    });

    const values = response.embeddings?.[0]?.values;

    if (!values || values.length === 0) {
      throw new Error("Gemini API returned an empty embedding vector.");
    }

    return values;
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };

    if (err.status === 429 || (err.message && err.message.includes("RESOURCE_EXHAUSTED"))) {
      throw new Error("Gemini embedding quota exceeded. Please wait a moment before trying again.");
    }

    throw new Error(
      err.message || "Failed to generate vector embedding from Gemini."
    );
  }
}

/**
 * Generates embeddings for an array of texts in concurrent batches.
 * Batches requests to respect API rate limits.
 */
export async function generateBatchEmbeddings(
  texts: string[],
  concurrency = 5
): Promise<number[][]> {
  const results: number[][] = new Array(texts.length);

  for (let i = 0; i < texts.length; i += concurrency) {
    const slice = texts.slice(i, i + concurrency);
    const promises = slice.map((text, idx) =>
      generateEmbedding(text).then((vec) => {
        results[i + idx] = vec;
      })
    );

    await Promise.all(promises);
  }

  return results;
}

/**
 * Computes the cosine similarity between two equal-length vectors:
 * dot(A, B) / (norm(A) * norm(B))
 * Returns a value between -1.0 and 1.0 (1.0 = identical direction).
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error(`Vector length mismatch: ${vecA.length} vs ${vecB.length}`);
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return 0;

  return dotProduct / magnitude;
}

