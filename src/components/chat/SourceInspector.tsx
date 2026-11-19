"use client";

import { ParsedCitation } from "@/lib/ai/rag";
import { DocumentChunk } from "@/types/document";
import { X, BookOpen, FileText, Sparkles } from "lucide-react";

interface SourceInspectorProps {
  citation: ParsedCitation | null;
  chunks: DocumentChunk[];
  onClose: () => void;
}

export function SourceInspector({ citation, chunks, onClose }: SourceInspectorProps) {
  if (!citation) return null;

  // Find all chunks from the cited page
  const matchingChunks = chunks.filter(
    (c) =>
      c.pageNumber === citation.pageNumber &&
      c.documentName === citation.documentName
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Panel */}
      <div className="relative w-full max-w-2xl mx-4 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-10 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Source Inspector</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <FileText className="w-3 h-3" />
                {citation.documentName}
                <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px]">
                  Page {citation.pageNumber}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {matchingChunks.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-slate-700" />
              <p>No matching chunks found for this citation.</p>
              <p className="text-xs mt-1">The document may need to be re-uploaded.</p>
            </div>
          ) : (
            matchingChunks.map((chunk) => (
              <div
                key={chunk.id}
                className="p-4 rounded-xl bg-slate-900 border border-cyan-500/20 space-y-2"
              >
                {/* Chunk Meta */}
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                    Chunk #{chunk.chunkIndex}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Page {chunk.pageNumber}
                  </span>
                  <span className="text-slate-500">
                    ~{chunk.tokenEstimate} tokens · {chunk.characterCount} chars
                  </span>
                </div>

                {/* Chunk Content */}
                <div className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 rounded-lg p-3 border border-slate-800 font-sans whitespace-pre-wrap">
                  {chunk.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            Retrieved via cosine similarity search · gemini-embedding-001 · vector(768)
          </p>
        </div>
      </div>
    </div>
  );
}
