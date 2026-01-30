export interface PaginationData<T> {
  // The content of this page.
  items: T[];

  // The total number of items.
  total: number;

  // The current page number. Defaults to 1.
  page?: number;

  // The number of items per page. Defaults to 10.
  limit?: number;
}
