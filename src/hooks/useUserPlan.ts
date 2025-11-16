import useSWR from "swr";

export function useUserPlan() {
  return useSWR("/api/user/plan", {
    refreshInterval: 60000 // 1 minute
  });
}
