import { GradientCircularProgress } from "@/components/animation/Loading";
import { ColumnDef, Table } from "@/components/data";
import {
  deleteArticle,
  getArticleList,
  publishArticle,
} from "@/lib/apis/article";
import { Article } from "@/lib/types/media";
import { PaginationData } from "@/lib/types/pagination";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { Eye, Send, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

export const ArticleTable = () => {
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<PaginationData<Article>>({
    total: 0,
    page: 1,
    items: [],
  });

  const [isPending, startTransition] = useTransition();

  const retriever = async () => {
    const items = await getArticleList(undefined, page);
    setItems(items);
  };

  useEffect(() => {
    startTransition(async () => {
      const items = await getArticleList(undefined, page);
      setItems(items);
    });
  }, [page]);

  const handlePublish = async (article: Article) => {
    try {
      await publishArticle(article);
      toast.success("已发布");

      await retriever();
    } catch (err) {
      toast.error(err as string);
    }
  };

  const handleDelete = async (article: Article) => {
    try {
      await deleteArticle(article.id);
      toast.success("已删除");

      await retriever();
    } catch (err) {
      toast.error(err as string);
    }
  };

  const columns: readonly ColumnDef<Article>[] = [
    {
      field: "title",
      headerName: "标题",
      render: (article: Article) => article.title,
      width: 10,
    },
    {
      field: "summary",
      headerName: "摘要",
      render: (article: Article) => (
        <Typography className="line-clamp-4 overflow-hidden text-start text-ellipsis">
          {article.summary}
        </Typography>
      ),
      width: 60,
    },
    {
      field: "operator",
      headerName: "操作",
      render: (article: Article) => (
        <>
          {article.state === "Init" && (
            <Tooltip title="发布">
              <IconButton
                color="secondary"
                onClick={() => handlePublish(article)}
              >
                <Send className="h-4 w-4" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="删除">
            <IconButton color="error" onClick={() => handleDelete(article)}>
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="查看文件">
            <IconButton color="info">
              <Eye className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </>
      ),
      width: 20,
    },
  ];

  if (isPending) {
    return (
      <div className="flex justify-center">
        <GradientCircularProgress />
      </div>
    );
  }

  return (
    <Table
      columns={columns as ColumnDef<unknown>[]}
      rows={items}
      onPageSwitch={setPage}
    />
  );
};
