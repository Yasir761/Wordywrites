import useSWR from "swr";

export function useBlogProfile(id: string) {
  return useSWR("api/blog-profile/" + id);
}
