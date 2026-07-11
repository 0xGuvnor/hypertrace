export const TABLE_PAGE_SIZE = 20;

export type ClientTablePage<T> = {
  page: number;
  pageItems: T[];
  pageCount: number;
  pageStart: number;
  rangeStart: number;
  rangeEnd: number;
  showPagination: boolean;
};

export function paginateItems<T>(
  items: readonly T[],
  page: number,
): ClientTablePage<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / TABLE_PAGE_SIZE));
  const clampedPage = Math.min(Math.max(0, page), pageCount - 1);
  const pageStart = clampedPage * TABLE_PAGE_SIZE;
  const pageItems = items.slice(pageStart, pageStart + TABLE_PAGE_SIZE);
  const showPagination = items.length > TABLE_PAGE_SIZE;

  return {
    page: clampedPage,
    pageItems,
    pageCount,
    pageStart,
    rangeStart: items.length === 0 ? 0 : pageStart + 1,
    rangeEnd: pageStart + pageItems.length,
    showPagination,
  };
}
