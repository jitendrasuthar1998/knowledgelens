"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, AlertCircle, Loader2 } from "lucide-react";
import { DocumentUploadResponse, DocumentUploadError } from "@/types/document";

interface DocumentUploaderProps {
  onUploadSuccess: (data: DocumentUploadResponse) => void;
  disabled?: boolean;
}

export function DocumentUploader({ onUploadSuccess, disabled = false }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Frontend pre-validation
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Please upload a valid .pdf document.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 10MB.`
      );
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading & validating magic bytes...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("Extracting digital text & detecting pages...");
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data: DocumentUploadResponse | DocumentUploadError = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = "message" in data ? data.message : `Upload failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      setUploadStatus("Chunking document with sliding overlap...");
      // Trigger parent callback
      onUploadSuccess(data);
      setUploadStatus(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload and process PDF.";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
      setUploadStatus(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={onFileSelect}
        disabled={disabled || isUploading}
      />

      {/* Dropzone container */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isUploading && !disabled && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer text-center ${
          isDragging
            ? "border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-500/10 scale-[1.01]"
            : "border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700"
        } ${isUploading || disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          ) : (
            <UploadCloud className="w-6 h-6 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-200">
            {isUploading ? (
              <span className="text-cyan-400 flex items-center gap-2 justify-center">
                <span>{uploadStatus || "Processing document..."}</span>
              </span>
            ) : (
              <>
                <span className="text-indigo-400 hover:underline">Click to upload</span> or drag and drop
              </>
            )}
          </p>
          <p className="text-xs text-slate-500">
            Digital PDF documents up to 10MB (Validated via %PDF- magic bytes)
          </p>
        </div>
      </div>

      {/* Error state alert */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-rose-200">Ingestion Error: </span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
