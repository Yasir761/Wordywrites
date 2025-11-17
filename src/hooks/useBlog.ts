import useSWR from "swr";

export function useBlog(id: string) {
  return useSWR(id ? `/api/blogs/${id}` : null);
}
