import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import config from "../config/config";

export const API_BASE_URL =
  import.meta.env.VITE_APP_MODE === "development"
    ? config.localUrl
    : config.serverUrl;

// ---------- Normal data fetcher ----------
const fetchData = async (url) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}${url}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// ---------- useApi hook ----------
export const useApi = (endpoint, options = {}) => {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => fetchData(endpoint),
    retry: options.retry ?? 2,
    enabled: !!endpoint,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    refetchInterval: options.refetchInterval || false,
    staleTime: options.staleTime || 0,
  });
};

// ---------- Infinite scroll data fetcher ----------
const fetchInfiniteData = async ({ queryKey, pageParam = 1 }) => {
  const endpoint = queryKey[0];
  try {
    const { data } = await axios.get(`${API_BASE_URL}${endpoint}?page=${pageParam}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// ---------- useInfiniteApi hook ----------
export const useInfiniteApi = (endpoint, options = {}) => {
  return useInfiniteQuery({
    queryKey: [endpoint],
    queryFn: fetchInfiniteData,
    initialPageParam: 1,
    retry: options.retry ?? 0,
    getNextPageParam: (lastPage) => {
      return lastPage.pageInfo?.hasNextPage
        ? lastPage.pageInfo.currentPage + 1
        : undefined;
    },
    refetchInterval: options.refetchInterval || false,
    staleTime: options.staleTime || 0,
  });
};
