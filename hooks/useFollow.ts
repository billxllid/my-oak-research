
import { useQuery } from "@tanstack/react-query";
import { Keyword, Category, Source, Proxy, Query } from "@/lib/generated/prisma";

const fetcher = async <T,>(url: string): Promise<T[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}`);
  }
  const data = await response.json();
  // Adapt to different API response structures
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.items)) {
    return data.items;
  }
  return [];
};

export const useFollow = () => {
  const { data: keywords = [], ...keywordsQuery } = useQuery<Keyword[]>({
    queryKey: ["keywords"],
    queryFn: () => fetcher("/api/follow/keywords")
  });

  const { data: categories = [], ...categoriesQuery } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetcher("/api/follow/categories"),
  });

  const { data: sources = [], ...sourcesQuery } = useQuery<Source[]>({
    queryKey: ["sources"],
    queryFn: () => fetcher("/api/follow/sources"),
  });

  const { data: proxies = [], ...proxiesQuery } = useQuery<Proxy[]>({
    queryKey: ["proxies"],
    queryFn: () => fetcher("/api/follow/proxy"),
  });

  const { data: queries = [], ...queriesQuery } = useQuery<Query[]>({
    queryKey: ["queries"],
    queryFn: () => fetcher("/api/follow/queries")
  });

  return {
    keywords,
    keywordsQuery,
    categories,
    categoriesQuery,
    sources,
    sourcesQuery,
    proxies,
    proxiesQuery,
    queries,
    queriesQuery,
  };
};
