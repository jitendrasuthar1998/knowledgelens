import { NextRequest, NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/validation/chat";
import { streamGeminiChat } from "@/lib/ai/gemini";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { searchSimilarChunks } from "@/lib/db/documents";
import {
  buildRagSystemInstruction,
  buildAbstentionInstruction,
  DEFAULT_CHAT_INSTRUCTION,
  RAG_SIMILARITY_THRESHOLD,
} from "@/lib/ai/rag";
import { ChatErrorResponse } from "@/types/chat";

export async function POST(req: NextRequest) {
  try {
    // 1. Safe JSON parsing
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json<ChatErrorResponse>(
        {
          error: "Bad Request",
          message: "Request body must be valid JSON.",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // 2. Runtime Schema Validation via Zod
    const validationResult = chatRequestSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const firstErrorMessage =
        validationResult.error.issues[0]?.message || "Invalid request payload.";

      return NextResponse.json<ChatErrorResponse>(
        {
          error: "Unprocessable Entity",
          message: firstErrorMessage,
          statusCode: 422,
        },
        { status: 422 }
      );
    }

    const { messages, documentId } = validationResult.data;

    // 3. RAG: If a document is active, retrieve relevant chunks via vector search
    let systemInstruction = DEFAULT_CHAT_INSTRUCTION;

    console.log("[RAG] documentId received:", documentId);
    console.log("[RAG] DATABASE_URL present:", !!process.env.DATABASE_URL);

    if (documentId && process.env.DATABASE_URL) {
      try {
        // Get the user's latest question
        const userQuery = messages[messages.length - 1].content;
        console.log("[RAG] Generating embedding for query:", userQuery.slice(0, 80));

        // Embed the query and search for the top 5 most relevant chunks
        const queryEmbedding = await generateEmbedding(userQuery);
        console.log("[RAG] Embedding generated, dimensions:", queryEmbedding.length);

        const rawChunks = await searchSimilarChunks(queryEmbedding, 5, documentId);
        console.log(
          "[RAG] Chunks retrieved:",
          rawChunks.length,
          rawChunks.map(
            (c) => `[#${c.chunkIndex}] score=${(c.similarityScore * 100).toFixed(1)}%`
          )
        );

          // Step 6.1: Confidence thresholding — isolate confident matches from background noise
          const confidentChunks = rawChunks.filter(
            (chunk) => chunk.similarityScore >= RAG_SIMILARITY_THRESHOLD
          );

          console.log(
            `[RAG] Confident chunks (>= ${(RAG_SIMILARITY_THRESHOLD * 100).toFixed(0)}%):`,
            `${confidentChunks.length} / ${rawChunks.length}`
          );

          if (confidentChunks.length > 0) {
            // Grounded Generation: We have high-confidence document chunks
            systemInstruction = buildRagSystemInstruction(confidentChunks);
            console.log(
              "[RAG] ✅ Grounded RAG system instruction built with",
              confidentChunks.length,
              "confident chunk(s)"
            );
          } else {
            // Explicit Abstention: Query is off-topic or information does not exist in the document
            const docName = rawChunks[0]?.documentName;
            systemInstruction = buildAbstentionInstruction(docName);
            console.warn(
              `[RAG] ⚠️ 0 chunks met confidence threshold (${(RAG_SIMILARITY_THRESHOLD * 100).toFixed(0)}%). Triggering explicit abstention mode.`
            );
          }
        } catch (ragErr) {
          // If RAG retrieval fails, gracefully fall back to default assistant mode
          console.error("[RAG] ❌ RAG retrieval error (falling back to default):", ragErr);
        }
      } else {
        console.log("[RAG] Skipping RAG — no documentId or DATABASE_URL missing");
      }

      // 4. Stream grounded response from Gemini
      const stream = await streamGeminiChat(messages, req.signal, systemInstruction);

      // 5. Return chunked streaming Response
      return new Response(stream, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (error: unknown) {
      const err = error as Error;
      const message = err.message || "Internal server error occurred.";

      const isConfigError = message.includes("GEMINI_API_KEY is not configured");
      const statusCode = isConfigError ? 503 : 500;

      return NextResponse.json<ChatErrorResponse>(
        {
          error: isConfigError ? "Service Unavailable" : "Internal Server Error",
          message,
          statusCode,
        },
        { status: statusCode }
      );
    }
  }
