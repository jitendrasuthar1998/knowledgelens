import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { searchSimilarChunks } from "@/lib/db/documents";

const searchRequestSchema = z.object({
  query: z
    .string({
      error: "Query must be a string.",
    })
    .trim()
    .min(1, "Search query cannot be empty.")
    .max(1000, "Search query exceeds 1,000 characters limit."),
  topK: z
    .number()
    .int()
    .min(1)
    .max(20)
    .optional()
    .default(5),
  documentId: z
    .string()
    .uuid("documentId must be a valid UUID.")
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Bad Request",
          message: "Request body must be valid JSON.",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const validationResult = searchRequestSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const firstErrorMessage =
        validationResult.error.issues[0]?.message || "Invalid search request payload.";

      return NextResponse.json(
        {
          success: false,
          error: "Unprocessable Entity",
          message: firstErrorMessage,
          statusCode: 422,
        },
        { status: 422 }
      );
    }

    const { query, topK, documentId } = validationResult.data;

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "Service Unavailable",
          message: "DATABASE_URL is not configured for vector search.",
          statusCode: 503,
        },
        { status: 503 }
      );
    }

    // 1. Generate 768-dimensional embedding for user query
    const queryEmbedding = await generateEmbedding(query);

    // 2. Perform Cosine Similarity Vector Retrieval in pgvector
    const results = await searchSimilarChunks(queryEmbedding, topK, documentId);

    return NextResponse.json(
      {
        success: true,
        query,
        count: results.length,
        results,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    const message = err.message || "Failed to execute vector search.";

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message,
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

