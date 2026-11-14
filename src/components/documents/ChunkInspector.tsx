"use client";

import React, { useState } from "react";
import { DocumentMetadata, DocumentChunk } from "@/types/document";
import { FileText, Search, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface ChunkInspectorProps {
  document: DocumentMetadata;
  chunks: DocumentChunk[];
  onRemoveDocument: () => void;
}

export function ChunkInspector({
  document,
  chunks,
  onRemoveDocument,
}: ChunkInspectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPage, setSelectedPage] = useState<number | "all">("all");
  const [expandedChunkId, setExpandedChunkId] = useState<string | null>(null);

  // Filter chunks based on search query and page filter
  const filteredChunks = chunks.filter((chunk) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      chunk.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPage =
      selectedPage === "all" || chunk.pageNumber === selectedPage;
    return matchesSearch && matchesPage;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const pagesList = Array.from(
    new Set(chunks.map((c) => c.pageNumber))
  ).sort((a, b) => a - b);

  return (
    <div className="space-y-4">
      {/* Document Overview Card */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-slate-100 truncate" title={document.name}>
                {document.name}
              </h4>
              <p className="text-xs text-slate-500">
                {formatFileSize(document.size)} • Uploaded {new Date(document.uploadedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          <button
            onClick={onRemoveDocument}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Remove document from session"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>

        {/* Metrics Pill Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-500">Pages</div>
            <div className="text-sm font-bold text-slate-200">{document.pageCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-500">Chunks</div>
            <div className="text-sm font-bold text-cyan-400">{document.chunkCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-500">Total Chars</div>
            <div className="text-sm font-bold text-slate-200">
              {document.extractedCharacters.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chunk content..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {pagesList.length > 1 && (
          <select
            value={selectedPage}
            onChange={(e) =>
              setSelectedPage(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="all">All Pages ({pagesList.length})</option>
            {pagesList.map((pg) => (
              <option key={pg} value={pg}>
                Page {pg}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Chunks List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredChunks.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 rounded-xl border border-slate-800/80 bg-slate-900/30">
            No chunks match the current search filter.
          </div>
        ) : (
          filteredChunks.map((chunk) => {
            const isExpanded = expandedChunkId === chunk.id;
            return (
              <div
                key={chunk.id}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition-all text-xs space-y-2"
              >
                {/* Chunk Card Header */}
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() =>
                    setExpandedChunkId(isExpanded ? null : chunk.id)
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono text-[10px] font-semibold">
                      Chunk #{chunk.chunkIndex}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px]">
                      Page {chunk.pageNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ~{chunk.tokenEstimate} tokens ({chunk.characterCount} chars)
                    </span>
                  </div>

                  <button className="text-slate-400 hover:text-slate-200">
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Chunk Passage Content */}
                <div
                  className={`text-slate-300 leading-relaxed font-sans text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 ${
                    !isExpanded ? "line-clamp-2" : ""
                  }`}
                >
                  {chunk.content}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
