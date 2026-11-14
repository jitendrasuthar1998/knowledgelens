"use client";

import React, { useState } from "react";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { DocumentDrawer } from "@/components/documents/DocumentDrawer";
import { DocumentMetadata, DocumentChunk, DocumentUploadResponse } from "@/types/document";
import { BookOpen, FileText, Upload } from "lucide-react";

export default function Home() {
  const [activeDocument, setActiveDocument] = useState<DocumentMetadata | null>(null);
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDocumentLoaded = (data: DocumentUploadResponse) => {
    setActiveDocument(data.document);
    setChunks(data.chunks);
  };

  const handleDocumentRemoved = () => {
    setActiveDocument(null);
    setChunks([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <nav className="h-14 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white">
              Knowledge<span className="text-cyan-400">Lens</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
            {/* Phase 3 Document Ingestion Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${activeDocument
                  ? "bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10 hover:bg-cyan-900/40"
                  : "bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                }`}
            >
              {activeDocument ? (
                <>
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="max-w-[130px] truncate">{activeDocument.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                    {chunks.length} chunks
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Upload PDF</span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Phase 3
                  </span>
                </>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Phase 3 Active</span>
            </div>
          </div>
      </nav>

      {/* Main Chat View */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatContainer
          activeDocument={activeDocument}
          onOpenDocumentDrawer={() => setIsDrawerOpen(true)}
        />
      </main>

      {/* Slide-over Document Ingestion & Chunk Inspector Drawer */}
      <DocumentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        document={activeDocument}
        chunks={chunks}
        onDocumentLoaded={handleDocumentLoaded}
        onDocumentRemoved={handleDocumentRemoved}
      />
    </div>
  );
}
