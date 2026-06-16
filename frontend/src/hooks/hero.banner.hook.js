import { useQuery } from "@tanstack/react-query";
import { getHeroSectionApi } from "../api/hero.banner.api";

export const useGetHeroSectionHook = () => {
  return useQuery({
    queryFn: getHeroSectionApi,
    queryKey: ["getHeroSections"],
  });
};