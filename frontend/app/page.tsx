"use client";

import { useRef, useState } from "react";
import { useDocuments } from "@/context/DocumentContext";

export default function HomePage() {
  const { addDocument } = useDocuments();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpload = async (selectedFile: File) => {
    if (!name) {
      setMessage({ type: "error", text: "Please enter a document name first." });
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("myFile", selectedFile);
      formData.append("name", name);

      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      addDocument({
        id: data.id || Date.now().toString(),
        name,
        type: "document",
        uploadDate: new Date().toISOString().split("T")[0],
        fileUrl: URL.createObjectURL(selectedFile),
      });

      setMessage({ type: "success", text: `Successfully uploaded: ${name}` });
      setName("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Upload failed" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-white text-center">Book Reader</h1>
        <p className="text-slate-400 text-center mb-8">Upload your PDF books to get started</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Document Name</label>
            <input
              type="text"
              placeholder="e.g. The Great Gatsby"
              value={name}
              disabled={isUploading}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white"
            />
          </div>

          <div 
            onClick={() => !isUploading && fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
              isUploading ? "opacity-50 cursor-not-allowed border-slate-800" : "border-slate-700 hover:border-blue-500 hover:bg-slate-950"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) handleUpload(selected);
              }}
            />
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <p className="font-semibold text-white">
              {isUploading ? "Uploading..." : "Click to select PDF"}
            </p>
            <p className="text-xs text-slate-500 mt-1">PDF files only, up to 10MB</p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm ${
              message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-slate-500 text-sm">
        Aegis Book Reader • Backend v1.0
      </p>
    </main>
  );
}