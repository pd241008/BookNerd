"use client";

import { useRef, useState, useCallback } from "react";
import { useDocuments } from "@/context/DocumentContext";
import {
  Upload,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Info,
  BookOpen,
  ArrowRight,
  X,
} from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  const { addDocument } = useDocuments();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    docId?: string;
  } | null>(null);

  const handleFileSelect = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      setMessage({
        type: "error",
        text: "Only PDF and DOCX files are supported.",
      });
      return;
    }
    setSelectedFile(file);
    setMessage(null);
    // Auto-fill name if empty
    if (!name) {
      setName(file.name.replace(/\.(pdf|docx)$/i, ""));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: "error", text: "Please select a file first." });
      return;
    }
    if (!name.trim()) {
      setMessage({ type: "error", text: "Please enter a book title." });
      return;
    }

    setIsUploading(true);
    setMessage(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("myFile", selectedFile);
      formData.append("name", name);

      // Simulate progress (real XHR progress would use XMLHttpRequest)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 15, 90));
      }, 200);

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/upload";
      const response = await fetch(backendUrl, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      setProgress(100);

      const docId = data.id || Date.now().toString();
      addDocument({
        id: docId,
        name,
        type: "document",
        uploadDate: new Date().toISOString().split("T")[0],
        fileUrl: URL.createObjectURL(selectedFile),
        storageType: "standard",
      });

      setMessage({
        type: "success",
        text: `Successfully uploaded: ${name}`,
        docId,
      });
      setName("");
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Upload failed",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }, [name]);

  return (
    <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-6 animate-fade-in">
      <div className="max-w-5xl w-full">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left — Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                Upload Book
              </h1>
              <p className="text-slate-400 leading-relaxed">
                Add PDF or DOCX files to your personal library. We&apos;ll
                handle the rest.
              </p>
            </div>

            <div className="space-y-3">
              <InfoCard
                icon={<FileText className="w-5 h-5" />}
                iconColor="text-indigo-400"
                iconBg="bg-indigo-500/10"
                title="Supported Formats"
                description="PDF and DOCX files up to 10MB."
              />
              <InfoCard
                icon={<Info className="w-5 h-5" />}
                iconColor="text-emerald-400"
                iconBg="bg-emerald-500/10"
                title="Smart Naming"
                description="Selecting a file auto-fills the title from the filename."
              />
            </div>

            <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/15">
              <p className="text-sm text-indigo-300">
                <strong>Tip:</strong> You can also discover and import books
                from online sources.
              </p>
              <Link
                href="/sources"
                className="text-sm font-bold text-indigo-400 hover:text-indigo-300 mt-2 inline-flex items-center gap-1 transition-colors"
              >
                Explore Sources <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Right — Upload Form */}
          <div className="lg:col-span-3">
            <div className="card p-8 md:p-10 relative overflow-hidden">
              {/* Decorative */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 blur-[80px] -z-10" />

              <div className="space-y-6">
                {/* Book Title */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Book Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the name of the book..."
                    value={name}
                    disabled={isUploading}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                  />
                </div>

                {/* Drop Zone */}
                <div
                  onDrag={handleDrag}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isUploading && fileRef.current?.click()}
                  className={`group border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isDragOver
                      ? "border-indigo-500 bg-indigo-500/5 scale-[1.01]"
                      : isUploading
                      ? "opacity-50 cursor-not-allowed border-slate-800"
                      : "border-slate-800 hover:border-indigo-500/40 hover:bg-indigo-500/3"
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const selected = e.target.files?.[0];
                      if (selected) handleFileSelect(selected);
                    }}
                  />
                  <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-1.5">
                    {isDragOver
                      ? "Drop it here!"
                      : selectedFile
                      ? selectedFile.name
                      : "Select or drop a file"}
                  </h3>
                  <p className="text-slate-500 text-sm text-center">
                    PDF or DOCX up to 10MB
                  </p>
                </div>

                {/* Selected File Preview */}
                {selectedFile && !isUploading && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                    <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="p-1.5 text-slate-500 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Progress Bar */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Uploading...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className={`btn-primary w-full justify-center py-4 ${
                    !selectedFile || isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isUploading ? "Uploading..." : "Upload Book"}
                  {!isUploading && <Upload className="w-4 h-4" />}
                </button>

                {/* Message */}
                {message && (
                  <div
                    className={`p-4 rounded-xl text-sm flex items-start gap-3 animate-fade-in ${
                      message.type === "success"
                        ? "bg-emerald-500/8 text-emerald-400 border border-emerald-500/15"
                        : "bg-rose-500/8 text-rose-400 border border-rose-500/15"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p>{message.text}</p>
                      {message.type === "success" && message.docId && (
                        <Link
                          href={`/read/${message.docId}`}
                          className="inline-flex items-center gap-1 text-indigo-400 font-semibold mt-2 hover:text-indigo-300 transition-colors"
                        >
                          <BookOpen className="w-4 h-4" /> Read Now
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  iconColor,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-white/3 border border-white/5">
      <div
        className={`shrink-0 w-10 h-10 ${iconBg} ${iconColor} rounded-xl flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-white text-sm">{title}</h4>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}