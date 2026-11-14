import { extractText } from "unpdf";
import type { DocumentPage } from "@/types/document";

export interface ExtractedPdfResult {
  totalPages: number;
  totalCharacters: number;
  pages: DocumentPage[];
}

/**
 * Normalizes extracted page text:
 * - Replaces CRLF with LF
 * - Cleans excessive horizontal whitespace
 * - Collapses 3+ consecutive line breaks into 2
 * - Strips unprintable control characters (keeping standard newlines and tabs)
 */
export function normalizeExtractedText(rawText: string): string {
  if (!rawText) return "";

  return rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Replace non-breaking spaces with standard space
    .replace(/\u00A0/g, " ")
    // Clean horizontal tabs and redundant spaces on the same line
    .replace(/[ \t]+/g, " ")
    // Trim lines
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    // Collapse excessive blank lines
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Extracts digital text from a PDF buffer page-by-page.
 * Returns an array of DocumentPage objects, maintaining page indices for citations.
 * Throws if the PDF is corrupt, password-protected, or scanned/empty.
 */
export async function extractPdfText(buffer: Uint8Array): Promise<ExtractedPdfResult> {
  let extractionResult;
  try {
    extractionResult = await extractText(buffer, { mergePages: false });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.toLowerCase().includes("password")) {
      throw new Error("Cannot process password-protected PDF. Please upload an unprotected file.");
    }
    throw new Error(`Failed to parse PDF document: ${errorMsg}`);
  }

  const { totalPages, text: rawPages } = extractionResult;

  if (totalPages === 0 || !rawPages || rawPages.length === 0) {
    throw new Error("The PDF document does not contain any readable pages.");
  }

  const pages: DocumentPage[] = [];
  let totalCharacters = 0;

  for (let i = 0; i < rawPages.length; i++) {
    const pageNumber = i + 1;
    const cleanedText = normalizeExtractedText(rawPages[i] || "");

    pages.push({
      pageNumber,
      text: cleanedText,
      characterCount: cleanedText.length,
    });

    totalCharacters += cleanedText.length;
  }

  // Scanned / Image-only PDF Detection
  // If a multi-page document has virtually 0 extractable characters, it's likely a scanned bitmap.
  if (totalCharacters < 20) {
    throw new Error(
      "The uploaded PDF contains no extractable digital text. It appears to be a scanned image or an empty document. (Optical Character Recognition / OCR is required for scanned documents)."
    );
  }

  return {
    totalPages,
    totalCharacters,
    pages,
  };
}
