import useSWR from "swr";

export function useUserChart() {
  return useSWR("/api/user/chart", {
    refreshInterval: 60000 // 1 minute
  });
}
