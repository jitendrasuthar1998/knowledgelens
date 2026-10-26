import { NextRequest, NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/validation/chat";
import { generateGeminiChat } from "@/lib/ai/gemini";
import { ChatErrorResponse } from "@/types/chat";


export async function POST(req: NextRequest) {
  try {
    // 1. Safe JSON parsing
    let rawBody: unknown;
    try {
      rawBody = await req.json();
      console.log("request body", rawBody);
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
    console.log("validationResult", validationResult);
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

    // 3. Forward to Server-Side AI Client
    const { messages } = validationResult.data;
    const aiResponse = await generateGeminiChat(messages);

    console.log("ai respnose", aiResponse);
    // 4. Return formatted response
    return NextResponse.json(aiResponse, { status: 200 });
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
