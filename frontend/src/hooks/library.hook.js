import { useQuery } from "@tanstack/react-query";
import { getLibrariesApi, searchLibrariesApi, getNearestLibrariesApi } from "../api/library.api";

// Hook to get all libraries
export const useGetLibrariesHook = (options = {}) => {
  return useQuery({
    queryKey: ["libraries", options],
    queryFn: () => getLibrariesApi(options),
    keepPreviousData: true,
  });
};

// Hook to search libraries (enabled only when a query exists)
export const useSearchLibrariesHook = (query, options = {}) => {
  return useQuery({
    queryKey: ["search-libraries", query, options],
    queryFn: () => searchLibrariesApi(query, options),
    enabled: !!query, // Don't run unless search query is present
    keepPreviousData: true,
  });
};

// Hook to get nearest libraries
export const useGetNearestLibrariesHook = (coords, options = {}) => {
  return useQuery({
    queryKey: ["nearest-libraries", coords, options],
    queryFn: () => getNearestLibrariesApi({ ...coords, ...options }),
    enabled: !!coords?.latitude && !!coords?.longitude,
    keepPreviousData: true,
  });
};
