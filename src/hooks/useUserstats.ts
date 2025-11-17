import useSWR from "swr";

export function useUserStats() {
  return useSWR("/api/user/stats", {
    refreshInterval: 60000 // 1 minute
  });
}
