import { fetchCategories } from "@/services/categories";
import { useQuery } from "@tanstack/react-query";

export enum CateQueryKey {
  categories = "categories",
}

export const useCategories = () => {
  const { data, isFetching } = useQuery({
    queryKey: [CateQueryKey.categories],
    queryFn: () => fetchCategories({ page: 1, pageSize: 100 }),
  });
  return { data, isFetching };
};
