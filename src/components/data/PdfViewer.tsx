"use client";

import { GradientCircularProgress } from "@/components/animation/Loading";
import { Button, IconButton, Tooltip } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { ArrowLeft, ArrowRight, ChevronsLeft, CircleX } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const PdfViewer = React.memo(
  ({ src, onClose = () => {} }: { src: string; onClose?: () => void }) => {
    const [content, setContent] = useState<string | null>(null);
    const [pages, setPages] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
      startTransition(async () => {
        try {
          const content = await invoke<string>("read_pdf", {
            path: src,
          });
          setContent(content);
        } catch (err) {
          toast.error(err as string);
          onClose();
        }
      });
    }, [src, onClose]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
      setPages(numPages);
      setPage(1);
    }

    function changePage(offset: number) {
      setPage((prev) => {
        const newPage = prev + offset;
        return Math.min(Math.max(1, newPage), pages);
      });
    }

    if (isPending || !content) {
      return (
        <div className="flex min-h-screen items-center gap-4 font-medium">
          <GradientCircularProgress size={24} />
          正在加载文件...
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6 overflow-hidden rounded-lg shadow-xl">
          <Document
            file={content}
            onLoadSuccess={onDocumentLoadSuccess}
            loading=""
            error={<div className="p-8 text-center text-red-500">加载失败</div>}
          >
            <Page
              pageNumber={page}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>

        {pages > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm font-medium">
              第 {page} 页 / 共 {pages} 页
            </div>

            <Button
              startIcon={<CircleX className="h-4 w-4" />}
              variant="text"
              color="warning"
              onClick={onClose}
            >
              关闭阅读模式
            </Button>

            <div className="flex items-center gap-2">
              <Tooltip title="首页">
                <IconButton onClick={() => setPage(1)} color="secondary">
                  <ChevronsLeft className="h-5 w-5" />
                </IconButton>
              </Tooltip>

              <Tooltip title="上一页">
                <IconButton onClick={() => changePage(-1)} color="info">
                  <ArrowLeft className="h-5 w-5" />
                </IconButton>
              </Tooltip>

              <Tooltip title="下一页">
                <IconButton onClick={() => changePage(1)} color="info">
                  <ArrowRight className="h-5 w-5" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    );
  },
);

PdfViewer.displayName = "PdfViewer";

export default PdfViewer;
