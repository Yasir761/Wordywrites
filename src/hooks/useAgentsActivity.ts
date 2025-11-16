import useSWR from "swr";

export function useAgentsActivity() {
  return useSWR("/api/agents/activity");
}
