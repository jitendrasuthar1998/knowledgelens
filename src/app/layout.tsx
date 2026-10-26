import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KnowledgeLens — AI Document Intelligence Assistant",
  description:
    "Production-minded AI Knowledge Assistant with grounded RAG, verifiable citations, and hallucination safeguards.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
