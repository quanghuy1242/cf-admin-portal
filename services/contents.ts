import {
  IContentFilter,
  IContent,
  IContentUpdate,
  IContentCreate,
} from "@/types/content";
import { IPagination } from "@/types/pagination";

export const fetchContent = async (id: string) => {
  const response = await fetch(`/api/content/${id}`);
  return (await response.json()) as IContent;
};

export const fetchContents = async (
  pagination: IPagination,
  filter?: IContentFilter,
) => {
  const response = await fetch(
    `/api/content?page=${pagination.page}&pageSize=${pagination.pageSize || 10}`,
  );
  return (await response.json()) as IContent[];
};

export const updateContent = async (id: string, data: IContentUpdate) => {
  const response = await fetch(`/api/content/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return (await response.json()) as IContent;
};

export const createContent = async (data: IContentCreate) => {};
