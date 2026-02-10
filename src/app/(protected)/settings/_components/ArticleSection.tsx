"use client";

import { GradientCircularProgress } from "@/components/animation/Loading";
import { TextField } from "@/components/input/TextField";
import { parsePdf, saveArticle } from "@/lib/apis/article";
import { articleSelector } from "@/lib/apis/selector";
import { PdfMetadata } from "@/lib/types/media";
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
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");

  useEffect(() => {
    startTransition(async () => {
      try {
        const meta = await parsePdf(pdf);
        setMetadata(meta);
        if (meta.title) {
          setTitle(meta.title);
        }

        if (meta.summary) {
          setSummary(meta.summary);
        }
      } catch (err) {
        toast.error(err as string);
      }
    });
  }, [pdf]);

  const handleCancel = async () => {
    onCompleted(false);
  };

  const handleSubmit = async () => {
    if (!metadata) {
      return;
    }

    try {
      await saveArticle({
        id: 0,
        title: title,
        summary: summary,
        origin_file: pdf,
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
            <TextField
              label="标题"
              value={title}
              onValueChange={setTitle}
              fullWidth
            />
            <TextField
              label="摘要"
              value={summary}
              onValueChange={setSummary}
              fullWidth
              multiline
            />
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
        className="items-center rounded-xl"
        icon={<Info className="h-4 w-4" />}
      >
        <div className="text-info-600 flex flex-col gap-2 text-xs font-medium">
          <li>只能上传 PDF 文件, 文件大小小于 20M.</li>
          <li>
            系统会尝试解析出 PDF 中的 标题, 摘要 和 封面信息. 由于 PDF
            本质上是图片, 无法有效区分布局信息, 只能根据常见的标点 (。！ 和 ？)
            来识别标题. 如果识别有误, 请手动修改.
          </li>
          <li>
            在识别过程中会产生临时文件, 如果不需要保存该文章, 请点击{" "}
            <em className="text-pink-400">取消</em> 按钮, 以删除临时文件.
          </li>
          <li>
            文章只有在点击 <strong className="text-pink-400">发布</strong> 后,
            才会在首页展示.
          </li>
        </div>
      </Alert>

      {pdf && <ArticleMetadata pdf={pdf} onCompleted={handleArticleUploaded} />}

      <ArticleTable key={refreshTable} />
    </Box>
  );
};
