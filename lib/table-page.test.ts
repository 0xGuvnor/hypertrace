import { describe, expect, test } from "bun:test";

import { TABLE_PAGE_SIZE, paginateItems } from "./table-page";

describe("paginateItems", () => {
  test("empty list", () => {
    expect(paginateItems([], 0)).toEqual({
      page: 0,
      pageItems: [],
      pageCount: 1,
      pageStart: 0,
      rangeStart: 0,
      rangeEnd: 0,
      showPagination: false,
    });
  });

  test("exact page size shows no pagination", () => {
    const items = Array.from({ length: TABLE_PAGE_SIZE }, (_, i) => i);
    const result = paginateItems(items, 0);
    expect(result.showPagination).toBe(false);
    expect(result.page).toBe(0);
    expect(result.pageItems).toEqual(items);
    expect(result.pageCount).toBe(1);
    expect(result.rangeStart).toBe(1);
    expect(result.rangeEnd).toBe(TABLE_PAGE_SIZE);
  });

  test("more than page size slices correctly", () => {
    const items = Array.from({ length: TABLE_PAGE_SIZE + 5 }, (_, i) => i);
    const page0 = paginateItems(items, 0);
    expect(page0.showPagination).toBe(true);
    expect(page0.page).toBe(0);
    expect(page0.pageCount).toBe(2);
    expect(page0.pageItems).toEqual(items.slice(0, TABLE_PAGE_SIZE));
    expect(page0.rangeStart).toBe(1);
    expect(page0.rangeEnd).toBe(TABLE_PAGE_SIZE);

    const page1 = paginateItems(items, 1);
    expect(page1.page).toBe(1);
    expect(page1.pageItems).toEqual(items.slice(TABLE_PAGE_SIZE));
    expect(page1.rangeStart).toBe(TABLE_PAGE_SIZE + 1);
    expect(page1.rangeEnd).toBe(TABLE_PAGE_SIZE + 5);
  });

  test("page out of range clamps", () => {
    const items = Array.from({ length: TABLE_PAGE_SIZE + 1 }, (_, i) => i);
    expect(paginateItems(items, -1).page).toBe(0);
    expect(paginateItems(items, -1).pageStart).toBe(0);
    expect(paginateItems(items, 99).page).toBe(1);
    expect(paginateItems(items, 99).pageStart).toBe(TABLE_PAGE_SIZE);
    expect(paginateItems(items, 99).pageItems).toEqual([
      items[TABLE_PAGE_SIZE],
    ]);
  });
});
