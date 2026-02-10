"use client";

import { Article } from "@/lib/types/media";
import { Dialog } from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";

const PdfViewer = dynamic(() => import("@/components/data/PdfViewer"), {
  ssr: false,
});

export const ArticleView = ({
  article,
  onClick,
}: {
  article: Article;
  onClick: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = () => {
    setOpen(false);
    onClick();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen className="bg-gray-50">
      <div className="flex justify-center">
        <PdfViewer src={article.origin_file} onClose={handleClose} />
      </div>
    </Dialog>
  );
};
