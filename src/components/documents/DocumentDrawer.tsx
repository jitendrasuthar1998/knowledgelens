"use client";

import React from "react";
import { DocumentMetadata, DocumentChunk, DocumentUploadResponse } from "@/types/document";
import { DocumentUploader } from "./DocumentUploader";
import { ChunkInspector } from "./ChunkInspector";
import { X, Layers, Sparkles } from "lucide-react";

interface DocumentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentMetadata | null;
  chunks: DocumentChunk[];
  onDocumentLoaded: (res: DocumentUploadResponse) => void;
  onDocumentRemoved: () => void;
}

export function DocumentDrawer({
  isOpen,
  onClose,
  document,
  chunks,
  onDocumentLoaded,
  onDocumentRemoved,
}: DocumentDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-lg bg-slate-950 border-l border-slate-800 shadow-2xl h-full flex flex-col z-10 animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                Document Intelligence
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Phase 3
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                PDF Ingestion & Recursive Chunking Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-850 transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!document ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 space-y-1.5">
                <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  How Ingestion Works:
                </p>
                <p className="leading-relaxed text-slate-400">
                  Upload a PDF. Our server verifies standard <code className="text-cyan-300">%PDF-</code> magic bytes, extracts digital text page-by-page, and recursively partitions it into 600-character semantic passages with 120-character sliding overlap.
                </p>
              </div>

              <DocumentUploader onUploadSuccess={onDocumentLoaded} />
            </div>
          ) : (
            <div className="space-y-4">
              <ChunkInspector
                document={document}
                chunks={chunks}
                onRemoveDocument={onDocumentRemoved}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950 text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            {document
              ? `Ready for Phase 4: Vector Embeddings (${chunks.length} chunks generated)`
              : "No document loaded yet. Upload a PDF to begin."}
          </p>
        </div>
      </div>
    </div>
  );
}
