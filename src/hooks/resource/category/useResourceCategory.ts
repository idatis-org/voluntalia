import { useQuery } from "@tanstack/react-query";
import { getResourceCategories } from "@/services/resourceService";
import { ResourceCategory } from "@/types/resource";

export const useResourceCategory = () => {
  return useQuery<ResourceCategory[], Error>({
    queryKey: ['resource-categories'],
    queryFn: getResourceCategories,
  });
};