"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure worker — use CDN for simplicity and reliability
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface TocItem {
  title: string;
  pageNumber: number;
  level: number;
  children?: TocItem[];
}

interface PdfViewerProps {
  fileUrl: string;
  currentPage: number;
  zoom: number;
  readingMode: "dark" | "light" | "sepia";
  onPageChange: (page: number) => void;
  onTotalPagesChange: (total: number) => void;
  onTocLoad: (toc: TocItem[]) => void;
  onLoadSuccess?: () => void;
  onLoadError?: (error: Error) => void;
}

/**
 * PdfViewer — A reusable wrapper around react-pdf that handles:
 * - PDF loading & rendering with the pdf.js worker
 * - Page display with text layer for copy/paste
 * - Annotation layer for clickable links
 * - Outline (TOC) extraction from the PDF metadata
 * - Reading mode color filters (dark / sepia)
 */
export function PdfViewer({
  fileUrl,
  currentPage,
  zoom,
  readingMode,
  onPageChange,
  onTotalPagesChange,
  onTocLoad,
  onLoadSuccess,
  onLoadError,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten PDF outline tree into our TocItem format
  const flattenOutline = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (outline: any[], pdf: any, level = 0): Promise<TocItem[]> => {
      const items: TocItem[] = [];
      for (const item of outline) {
        let pageNumber = 1;
        try {
          // Resolve the destination to get the page number
          const dest =
            typeof item.dest === "string"
              ? await pdf.getDestination(item.dest)
              : item.dest;
          if (dest) {
            const pageIndex = await pdf.getPageIndex(dest[0]);
            pageNumber = pageIndex + 1;
          }
        } catch {
          // If destination resolution fails, default to page 1
        }

        const children = item.items
          ? await flattenOutline(item.items, pdf, level + 1)
          : undefined;

        items.push({
          title: item.title,
          pageNumber,
          level,
          children,
        });
      }
      return items;
    },
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDocumentLoad = useCallback(async (pdfDocument: any) => {
    const total = pdfDocument.numPages;
    setNumPages(total);
    setIsLoading(false);
    setLoadError(null);
    onTotalPagesChange(total);
    onLoadSuccess?.();

    // Extract table of contents from PDF outline
    try {
      const outline = await pdfDocument.getOutline();
      if (outline && outline.length > 0) {
        const toc = await flattenOutline(outline, pdfDocument);
        onTocLoad(toc);
      }
    } catch {
      // Outline extraction is best-effort
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onTotalPagesChange, onTocLoad, onLoadSuccess, flattenOutline]);

  const handleDocumentError = useCallback(
    (error: Error) => {
      setIsLoading(false);
      setLoadError(error.message || "Failed to load PDF");
      onLoadError?.(error);
    },
    [onLoadError]
  );

  // Apply color filter based on reading mode
  const getPageFilter = () => {
    switch (readingMode) {
      case "dark":
        return "invert(0.88) hue-rotate(180deg)";
      case "sepia":
        return "sepia(0.35) brightness(0.95)";
      case "light":
      default:
        return "none";
    }
  };

  // Scroll to current page when it changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p className="text-red-400 font-medium mb-1">Failed to load PDF</p>
        <p className="text-sm text-slate-500 max-w-xs">{loadError}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full">
      {/* Loading skeleton */}
      {isLoading && (
        <div className="w-full max-w-2xl animate-pulse">
          <div className="aspect-[8.5/11] bg-white/5 rounded-xl animate-shimmer" />
        </div>
      )}

      <Document
        file={fileUrl}
        onLoadSuccess={handleDocumentLoad}
        onLoadError={handleDocumentError}
        loading={null}
        className="flex flex-col items-center"
      >
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease",
            filter: getPageFilter(),
          }}
        >
          <Page
            pageNumber={currentPage}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-2xl rounded-sm"
            width={Math.min(
              typeof window !== "undefined" ? window.innerWidth - 100 : 800,
              800
            )}
            loading={
              <div className="aspect-[8.5/11] w-[800px] max-w-full bg-white/5 rounded-xl animate-shimmer" />
            }
          />
        </div>
      </Document>

      {/* Page indicator (mobile) */}
      {numPages > 0 && (
        <div className="mt-4 flex items-center gap-2 sm:hidden">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage <= 1}
            className="p-2 text-slate-400 disabled:opacity-30"
          >
            ◄
          </button>
          <span className="text-xs text-slate-500 tabular-nums">
            {currentPage} / {numPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, numPages))}
            disabled={currentPage >= numPages}
            className="p-2 text-slate-400 disabled:opacity-30"
          >
            ►
          </button>
        </div>
      )}
    </div>
  );
}
