import { NextRequest, NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/validation/chat";
import { streamGeminiChat } from "@/lib/ai/gemini";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { searchSimilarChunks } from "@/lib/db/documents";
import { buildRagSystemInstruction, DEFAULT_CHAT_INSTRUCTION } from "@/lib/ai/rag";
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

    if (documentId && process.env.DATABASE_URL) {
      try {
        // Get the user's latest question
        const userQuery = messages[messages.length - 1].content;

        // Embed the query and search for the top 5 most relevant chunks
        const queryEmbedding = await generateEmbedding(userQuery);
        const relevantChunks = await searchSimilarChunks(queryEmbedding, 5, documentId);

        if (relevantChunks.length > 0) {
          // Build a strict grounded RAG system instruction
          systemInstruction = buildRagSystemInstruction(relevantChunks);
        }
      } catch (ragErr) {
        // If RAG retrieval fails, gracefully fall back to default assistant mode
        console.error("RAG retrieval warning (falling back to default):", ragErr);
      }
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
