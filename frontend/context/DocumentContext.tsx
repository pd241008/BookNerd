"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Document, StorageType } from "@/types";
import { sampleDocuments } from "./sampleDocuments";

type DocumentContextType = {
  documents: Document[];
  addDocument: (doc: Document) => void;
  updateDocument: (id: string, data: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  resetSession: () => void;
};

const DocumentContext = createContext<DocumentContextType | null>(null);

export const DocumentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from sessionStorage to handle refreshes, but clearable
  useEffect(() => {
    const saved = sessionStorage.getItem("biblio_docs");
    if (saved) {
      setDocuments(JSON.parse(saved));
    } else {
      // Default sample documents are considered "standard" and non-persistent
      setDocuments(sampleDocuments.map(d => ({ ...d, storageType: "standard" })));
    }
    setIsInitialized(true);
  }, []);

  // Save to sessionStorage whenever documents change
  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem("biblio_docs", JSON.stringify(documents));
    }
  }, [documents, isInitialized]);

  const addDocument = (doc: Document) => {
    const newDoc = { ...doc, storageType: doc.storageType || "standard" };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const updateDocument = (id: string, data: Partial<Document>) =>
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );

  const removeDocument = (id: string) =>
    setDocuments((prev) => prev.filter((d) => d.id !== id));

  const resetSession = () => {
    sessionStorage.removeItem("biblio_docs");
    // When session is reset, we only keep persistent items if any existed, 
    // but the user said "Standard storage is not persistent", so we clear everything or reset to samples.
    // Let's clear everything to satisfy "does not show when I reset the session".
    setDocuments([]);
  };

  return (
    <DocumentContext.Provider
      value={{ documents, addDocument, updateDocument, removeDocument, resetSession }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error("useDocuments must be used inside provider");
  return ctx;
};
