/**
 * PDF Validation Utilities
 * Validates file size, file extensions, and magic bytes (%PDF-).
 */

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const PDF_MAGIC_BYTES = "%PDF-";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  statusCode?: number;
}

/**
 * Validates file size, name, and MIME type before processing.
 */
export function validateFileBasics(file: File | null | undefined): ValidationResult {
  if (!file) {
    return {
      isValid: false,
      error: "No file provided in the upload request.",
      statusCode: 400,
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: "The uploaded file is empty (0 bytes).",
      statusCode: 400,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds the 10MB limit (uploaded: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`,
      statusCode: 413, // Payload Too Large
    };
  }

  const filename = file.name.trim();
  if (!filename.toLowerCase().endsWith(".pdf")) {
    return {
      isValid: false,
      error: "Invalid file extension. Only .pdf files are supported.",
      statusCode: 422, // Unprocessable Entity
    };
  }

  return { isValid: true };
}

/**
 * Inspects the raw binary buffer for standard PDF magic bytes (%PDF-).
 * Defends against disguised malware or renamed executables (MIME spoofing).
 */
export function validatePdfMagicBytes(buffer: Uint8Array): ValidationResult {
  // A standard PDF file must start with '%PDF-' within the first 1024 bytes
  const headerSlice = buffer.subarray(0, Math.min(buffer.length, 1024));
  const headerString = new TextDecoder("latin1").decode(headerSlice);

  if (!headerString.includes(PDF_MAGIC_BYTES)) {
    return {
      isValid: false,
      error: "Security validation failed: File signature does not match a valid PDF format (missing %PDF- header).",
      statusCode: 422,
    };
  }

  return { isValid: true };
}

