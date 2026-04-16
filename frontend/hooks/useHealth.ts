import { useQuery } from "@tanstack/react-query";
import { healthApi } from "@/lib/api";

export function useHealthScore() {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => healthApi.getScore(),
  });
}

export function useHealthHistory() {
  return useQuery({
    queryKey: ["health", "history"],
    queryFn: () => healthApi.getHistory(),
    select: (data) => data.history,
  });
}

export function useHealthSuggestions() {
  return useQuery({
    queryKey: ["health", "suggestions"],
    queryFn: () => healthApi.getSuggestions(),
    select: (data) => data.suggestions,
  });
}
