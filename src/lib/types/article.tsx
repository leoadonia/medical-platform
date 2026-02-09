export interface PdfMetadata {
  title?: string;
  summary?: string;
  covers: string[];
}

export type ArticleState = "Init" | "Published";

export interface Article {
  id: number;
  title: string;
  summary: string;
  cover?: string;
  state: ArticleState;
  origin_file: string;
  created_at: number;
  updated_at: number;
}
