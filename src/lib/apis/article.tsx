import { Article, ArticleState, PdfMetadata } from "@/lib/types/media";
import { PaginationData } from "@/lib/types/pagination";
import { invoke } from "@tauri-apps/api/core";

export const parsePdf = async (pdf: string): Promise<PdfMetadata> => {
  const meta = await invoke<PdfMetadata>("parse_pdf", { pdf });
  return meta;
};

export const removeArticleTempFiles = async (
  meta: PdfMetadata,
): Promise<void> => {
  await invoke("article_remove_temp", { data: JSON.stringify(meta) });
};

export const saveArticle = async (meta: PdfMetadata, article: Article) => {
  await invoke("save_article", {
    meta: JSON.stringify(meta),
    data: JSON.stringify(article),
  });
};

export const getArticleList = async (
  state?: ArticleState,
  page?: number,
  limit?: number,
): Promise<PaginationData<Article>> => {
  const articles = await invoke<PaginationData<Article>>("get_article_list", {
    state,
    page: page || 1,
    limit: limit || 10,
  });
  return articles;
};

export const deleteArticle = async (id: number) => {
  await invoke("delete_article", { id });
};

export const publishArticle = async (article: Article) => {
  await invoke("update_article", {
    data: JSON.stringify({
      ...article,
      state: "Published",
    }),
  });
};
