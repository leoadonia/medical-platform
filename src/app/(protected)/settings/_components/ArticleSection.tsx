"use client";

import { GradientCircularProgress } from "@/components/animation/Loading";
import { ImageViewer } from "@/components/input/ImageViewer";
import { TextField } from "@/components/input/TextField";
import {
  parsePdf,
  removeArticleTempFiles,
  saveArticle,
} from "@/lib/apis/article";
import { articleSelector } from "@/lib/apis/selector";
import { PdfMetadata } from "@/lib/types/article";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { FolderSearch, Info } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { ArticleTable } from "./ArticleTable";

const ArticleMetadata = ({
  pdf,
  onCompleted,
}: {
  pdf: string;
  onCompleted: (uploaded: boolean) => void;
}) => {
  const [isPending, startTransition] = useTransition();
  const [metadata, setMetadata] = useState<PdfMetadata | null>(null);
  const [selectedCover, setSelectedCover] = useState<string>("");

  useEffect(() => {
    startTransition(async () => {
      try {
        const meta = await parsePdf(pdf);
        setMetadata(meta);
      } catch (err) {
        toast.error(err as string);
      }
    });
  }, [pdf]);

  const handleCoverSelector = (cover: string) => {
    setSelectedCover(cover);
  };

  const handleCancel = async () => {
    if (!metadata) {
      return;
    }

    try {
      await removeArticleTempFiles(metadata);
    } catch (err) {
      toast.error(err as string);
    } finally {
      onCompleted(false);
    }
  };

  const handleSubmit = async () => {
    if (!metadata) {
      return;
    }

    try {
      await saveArticle(metadata, {
        id: 0,
        title: metadata.title!,
        summary: metadata.summary!,
        origin_file: pdf,
        cover: selectedCover || undefined,
        state: "Init",
        created_at: 0,
        updated_at: 0,
      });
    } catch (err) {
      toast.error(err as string);
    } finally {
      onCompleted(true);
    }
  };

  return (
    <Card className="rounded-xl bg-white/80 shadow-md shadow-gray-400">
      <CardHeader title={<Typography variant="h6">文章信息</Typography>} />
      <CardContent className="flex flex-col gap-4">
        {isPending && (
          <div className="flex justify-center gap-4">
            <GradientCircularProgress size={20} />
            <span className="text-sm font-medium">正在解析文件...</span>
          </div>
        )}
        {metadata && (
          <>
            <TextField label="标题" value={metadata.title || ""} fullWidth />
            <TextField
              label="摘要"
              value={metadata.summary || ""}
              fullWidth
              multiline
            />
            <div className="flex flex-wrap gap-2">
              <Typography variant="subtitle1">选择文章封面:</Typography>
              {metadata.covers.map((cover) => (
                <div
                  key={cover}
                  onClick={() => handleCoverSelector(cover)}
                  className="data-[active=true]:border-2 data-[active=true]:border-pink-600"
                  data-active={cover === selectedCover}
                >
                  <ImageViewer src={cover} viewMode={false} />
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
      <CardActions>
        <div className="ml-auto flex gap-4">
          <Button
            color="warning"
            variant="outlined"
            onClick={handleCancel}
            disabled={isPending}
          >
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            上传
          </Button>
        </div>
      </CardActions>
    </Card>
  );
};

export const ArticleSection = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pdf, setPdf] = useState<string | null>(null);

  const [refreshTable, setRefreshTable] = useState<number>(1);

  const handleSelector = async () => {
    setLoading(true);

    const article = await articleSelector();
    if (!article) {
      setLoading(false);
      return;
    }

    setPdf(article);
  };

  const handleArticleUploaded = async (uploaded: boolean) => {
    setLoading(false);
    setPdf(null);

    if (uploaded) {
      setRefreshTable(refreshTable + 1);
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={4}>
      <Button
        variant="outlined"
        className="max-w-3xs gap-2"
        startIcon={<FolderSearch className="h-4 w-4" />}
        onClick={handleSelector}
        disabled={loading}
      >
        选择科普文件
      </Button>
      <Alert
        color="info"
        className="items-center rounded-xl text-xs font-medium"
        icon={<Info className="h-4 w-4" />}
      >
        <div className="text-info-600 flex flex-col gap-2">
          <li>只能上传 PDF 文件, 文件大小小于 20M.</li>
          <li>
            系统会尝试解析出 PDF 中的 标题, 摘要 和 封面信息. 由于 PDF
            本质上是图片, 无法有效区分布局信息, 只能根据常见的标点 (。！ 和 ？)
            来识别标题. 如果识别有误, 请手动修改.
          </li>
          <li>
            在识别过程中会产生临时文件, 如果不需要保存该文章, 请点击{" "}
            <em>取消</em> 按钮, 以删除临时文件.
          </li>
        </div>
      </Alert>

      {pdf && <ArticleMetadata pdf={pdf} onCompleted={handleArticleUploaded} />}

      <ArticleTable key={refreshTable} />
    </Box>
  );
};
