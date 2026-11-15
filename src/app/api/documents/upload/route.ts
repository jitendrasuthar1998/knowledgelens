import { NextRequest, NextResponse } from "next/server";
import { validateFileBasics, validatePdfMagicBytes } from "@/lib/pdf/validation";
import { extractPdfText } from "@/lib/pdf/extractor";
import { chunkDocumentPages } from "@/lib/ai/chunking";
import { generateBatchEmbeddings } from "@/lib/ai/embeddings";
import { saveDocumentWithVectors } from "@/lib/db/documents";
import {
  DocumentMetadata,
  DocumentUploadResponse,
  DocumentUploadError,
} from "@/types/document";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse Multipart Form Data
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json<DocumentUploadError>(
        {
          success: false,
          error: "Bad Request",
          message: "Request must be multipart/form-data with a 'file' field.",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;

    // 2. File size and extension validation
    const basicValidation = validateFileBasics(file);
    if (!basicValidation.isValid) {
      return NextResponse.json<DocumentUploadError>(
        {
          success: false,
          error: basicValidation.statusCode === 413 ? "Payload Too Large" : "Bad Request",
          message: basicValidation.error || "Invalid file provided.",
          statusCode: basicValidation.statusCode || 400,
        },
        { status: basicValidation.statusCode || 400 }
      );
    }

    // TypeScript check: file is non-null here
    const validFile = file!;

    // 3. Convert File to binary buffer
    const arrayBuffer = await validFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // 4. Server-Side Security: Inspect PDF Magic Bytes (%PDF-)
    const magicValidation = validatePdfMagicBytes(buffer);
    if (!magicValidation.isValid) {
      return NextResponse.json<DocumentUploadError>(
        {
          success: false,
          error: "Unprocessable Entity",
          message: magicValidation.error || "File signature does not match PDF format.",
          statusCode: 422,
        },
        { status: 422 }
      );
    }

    // 5. Digital Text Extraction page-by-page
    const extractionResult = await extractPdfText(buffer);
    const { totalPages, totalCharacters, pages } = extractionResult;

    // 6. Generate UUID for the document
    const documentId = crypto.randomUUID();

    // 7. Parse optional chunking configuration
    const chunkSizeParam = formData.get("chunkSize");
    const chunkOverlapParam = formData.get("chunkOverlap");

    const chunkSize = chunkSizeParam ? parseInt(chunkSizeParam.toString(), 10) : undefined;
    const chunkOverlap = chunkOverlapParam !== null && chunkOverlapParam !== undefined
      ? parseInt(chunkOverlapParam.toString(), 10)
      : undefined;

    // 8. Recursive Character Chunking
    const chunks = chunkDocumentPages(pages, documentId, validFile.name, {
      chunkSize: !isNaN(Number(chunkSize)) ? chunkSize : undefined,
      chunkOverlap: !isNaN(Number(chunkOverlap)) ? chunkOverlap : undefined,
    });

    // 9. Assemble Document Metadata
    const documentMetadata: DocumentMetadata = {
      id: documentId,
      name: validFile.name,
      size: validFile.size,
      pageCount: totalPages,
      uploadedAt: new Date().toISOString(),
      chunkCount: chunks.length,
      extractedCharacters: totalCharacters,
    };

    // 10. Generate Vector Embeddings & Persist to pgvector
    if (process.env.DATABASE_URL && chunks.length > 0) {
      try {
        const chunkTexts = chunks.map((c) => c.content);
        const embeddings = await generateBatchEmbeddings(chunkTexts);
        await saveDocumentWithVectors(documentMetadata, chunks, embeddings);
      } catch (dbErr: unknown) {
        console.error("Vector storage warning:", dbErr);
        // Continue and return chunks even if vector persistence warning occurs
      }
    }

    const responsePayload: DocumentUploadResponse = {
      success: true,
      document: documentMetadata,
      chunks,
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    const message = err.message || "Failed to process document upload.";

    const isClientError =
      message.includes("scanned") ||
      message.includes("password") ||
      message.includes("corrupt") ||
      message.includes("does not contain");

    const statusCode = isClientError ? 422 : 500;

    return NextResponse.json<DocumentUploadError>(
      {
        success: false,
        error: isClientError ? "Unprocessable Entity" : "Internal Server Error",
        message,
        statusCode,
      },
      { status: statusCode }
    );
  }
}

