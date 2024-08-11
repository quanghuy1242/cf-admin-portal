export const withPagination = (page: number, pageSize: number): string => {
  return `page=${page}&pageSize=${pageSize}`;
};
