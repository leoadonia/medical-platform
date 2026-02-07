"use client";

import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const PdfViewer = ({ src }: { src: string }) => {
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const content = await invoke<string>("read_pdf", {
          path: src,
        });
        setPdfData(content);
      } catch (err) {
        console.error("Failed to load PDF:", err);
        alert("无法加载 PDF 文件");
      }
    };

    loadPdf();
  }, [src]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prev) => {
      const newPage = prev + offset;
      return Math.min(Math.max(1, newPage), numPages!);
    });
  }

  function goToPage(page: number) {
    if (numPages && page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  }

  if (!pdfData) {
    return <div>正在加载 PDF...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* PDF 渲染区域 */}
      <div className="shadow-info-400 mb-6 overflow-hidden rounded-lg shadow-xl">
        <Document
          file={pdfData}
          onLoadSuccess={onDocumentLoadSuccess}
          loading=""
          error={<div className="p-8 text-center text-red-500">加载失败</div>}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={window.innerWidth > 768 ? 700 : window.innerWidth - 40}
          />
        </Document>
      </div>

      {/* 分页控件 - Radix + Tailwind 风格 */}
      {numPages && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* 页码信息 */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            第 <span className="font-medium">{pageNumber}</span> 页，共{" "}
            <span className="font-medium">{numPages}</span> 页
          </div>

          {/* 导航按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                pageNumber <= 1
                  ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800"
                  : "bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-900/50"
              }`}
              aria-label="上一页"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* 页码输入 */}
            <div className="relative">
              <input
                type="number"
                min="1"
                max={numPages}
                value={pageNumber}
                onChange={(e) => goToPage(Number(e.target.value))}
                className="w-16 rounded-lg border border-gray-300 bg-white text-center text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <button
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                pageNumber >= numPages
                  ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800"
                  : "bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-900/50"
              }`}
              aria-label="下一页"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
