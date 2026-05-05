"use client";

import React, { createContext, useContext, useState } from "react";
import { Document } from "@/types";
import { sampleDocuments } from "./sampleDocuments";

type DocumentContextType = {
  documents: Document[];
  addDocument: (doc: Document) => void;
  updateDocument: (id: string, data: Partial<Document>) => void;
  removeDocument: (id: string) => void;
};

const DocumentContext = createContext<DocumentContextType | null>(null);

export const DocumentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);

  const addDocument = (doc: Document) => setDocuments((prev) => [doc, ...prev]);

  const updateDocument = (id: string, data: Partial<Document>) =>
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );

  const removeDocument = (id: string) =>
    setDocuments((prev) => prev.filter((d) => d.id !== id));

  return (
    <DocumentContext.Provider
      value={{ documents, addDocument, updateDocument, removeDocument }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error("useDocuments must be used inside provider");
  return ctx;
};
