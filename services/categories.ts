import { ICategoriesFilter, ICategory } from "@/types/category";
import { IPagination } from "@/types/pagination";

export const fetchCategories = async (
  pagination: IPagination,
  filter?: ICategoriesFilter,
) => {
  const response = await fetch(
    `/api/category?page=${pagination.page}&pageSize=${pagination.pageSize || 10}`,
  );
  return (await response.json()) as ICategory[];
};
