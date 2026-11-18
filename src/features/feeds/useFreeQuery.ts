import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "./feedApi";

export function useFeedQuery(url: string | null) {
  return useQuery({
    queryKey: ["feed", url],
    queryFn: () => {
      if (!url) {
        throw new Error("Select a feed first");
      }

      return fetchFeed(url);
    },
    enabled: Boolean(url),
  });
}