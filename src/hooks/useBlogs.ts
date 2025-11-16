import useSWR from "swr";

export function useBlogs() {
  return useSWR("/api/createdBlogs");
}
