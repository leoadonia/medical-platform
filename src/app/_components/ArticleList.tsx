"use client";

import { getArticleList } from "@/lib/apis/article";
import { Article } from "@/lib/types/media";
import { PaginationData } from "@/lib/types/pagination";
import {
  Card,
  CardContent,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { ArticleView } from "./ArticleView";

const PrimaryArticle = ({
  article,
  onClick,
}: {
  article: Article;
  onClick: () => void;
}) => (
  <Tooltip title="点击查看全文">
    <div
      className="border-info-50 hover:shadow-info-200 cursor-default rounded-lg border-2 bg-white/60 p-4 shadow-lg shadow-gray-300 hover:shadow-2xl"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <Typography variant="subtitle1">{article.title}</Typography>
        <Typography variant="body2">{article.summary}</Typography>
      </div>
    </div>
  </Tooltip>
);

const ArticleItem = ({
  article,
  index,
  onClick,
}: {
  article: Article;
  index: number;
  onClick: () => void;
}) => {
  const styles = {
    odd: "bg-info-50 shadow-pink-100  hover:shadow-pink-200",
    even: "bg-secondary-50 shadow-warning-50 hover:shadow-warning-100",
  };

  const style = index % 2 === 0 ? styles.even : styles.odd;

  return (
    <Tooltip title="点击查看全文">
      <div
        className={`cursor-default rounded-lg border-2 border-white p-2 shadow-md hover:shadow-lg ${style}`}
        onClick={onClick}
      >
        <div className="flex flex-col gap-2">
          <Typography variant="subtitle1">{article.title}</Typography>
          <Typography
            variant="body2"
            className="line-clamp-2 overflow-hidden text-ellipsis text-gray-700"
          >
            {article.summary}
          </Typography>
        </div>
      </div>
    </Tooltip>
  );
};

export const ArticleList = () => {
  const limit = 5;
  const [page, setPage] = useState<number>(1);
  const [articles, setArticles] = useState<PaginationData<Article>>({
    page,
    items: [],
    total: 0,
    limit,
  });
  const [isPending, startTransition] = useTransition();
  const [articleInView, setArticleInView] = useState<Article | null>(null);

  const totalPage = Math.ceil(articles.total / limit);

  useEffect(() => {
    startTransition(async () => {
      const items = await getArticleList("Published", page, limit);
      setArticles(items);
    });
  }, [page]);

  if (isPending || articles.items.length === 0) {
    return (
      <Skeleton
        sx={{
          minHeight: 160,
          maxHeight: 240,
        }}
        animation="wave"
        variant="rounded"
        className="rounded-lg"
      />
    );
  }

  const handlePervious = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(totalPage, prev + 1));
  };

  const handleView = (article: Article) => {
    setArticleInView(article);
  };

  return (
    <>
      <div className="flex flex-row-reverse gap-4">
        <div className="flex min-w-[40%] flex-col gap-8">
          <PrimaryArticle
            article={articles.items[0]}
            onClick={() => handleView(articles.items[0])}
          />
          <div className="mx-auto flex">
            <div className="from-info-200 flex min-w-3xs items-center justify-between rounded-xl bg-linear-to-r via-gray-50 to-pink-300 p-1">
              <Tooltip title="上一页">
                <IconButton
                  className="hover:bg-info-300 ml-8 text-white"
                  onClick={handlePervious}
                >
                  <ArrowLeft className="h-4 w-4" />
                </IconButton>
              </Tooltip>
              <div className="text-xs font-medium text-gray-500">
                第 {page} 页 / 共 {totalPage} 页
              </div>
              <Tooltip title="下一页">
                <IconButton
                  className="mr-8 hover:bg-pink-400"
                  onClick={handleNext}
                >
                  <ArrowRight className="h-4 w-4" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        {articles.items.length > 1 && (
          <div className="flex max-w-[60%] flex-col gap-2">
            <Card className="rounded-lg bg-gray-50/80">
              <CardContent className="flex flex-col gap-4 p-2">
                {articles.items.slice(1).map((article, index) => (
                  <ArticleItem
                    key={article.id}
                    article={article}
                    index={index}
                    onClick={() => handleView(article)}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      {articleInView && (
        <ArticleView
          article={articleInView}
          onClick={() => setArticleInView(null)}
        />
      )}
    </>
  );
};
