import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import config from "../config/config";

export const API_BASE_URL =
  import.meta.env.VITE_APP_MODE &&
  import.meta.env.VITE_APP_MODE === "development"
    ? config.localUrl
    : config.serverUrl;

// Normal data fetcher
const fetchData = async (url) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}${url}`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

// ✅ Updated useApi (adds timestamp + auto refresh support)
export const useApi = (endpoint, options = {}) => {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => fetchData(`animes/${endpoint}`), // prevent cache
    retry: 2,
    enabled: !!endpoint,
    refetchOnWindowFocus: false,
    refetchInterval: options.refetchInterval || false, // background refresh
    staleTime: options.staleTime || 0, // always refetch
  });
};

// Infinite scroll data fetcher
const fetchInfiniteData = async ({ queryKey, pageParam }) => {
  try {
    const { data } = await axios.get(API_BASE_URL + queryKey + pageParam);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

// Infinite scroll hook
export const useInfiniteApi = (endpoint) => {
  return useInfiniteQuery({
    queryKey: [endpoint],
    queryFn: fetchInfiniteData,
    initialPageParam: 1,
    retry: 0,
    getNextPageParam: (lastpage) => {
      if (lastpage.data.pageInfo.hasNextPage) {
        return lastpage.data.pageInfo.currentPage + 1;
      } else {
        return undefined;
      }
    },
  });
};
