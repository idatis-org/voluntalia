import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { CreateResourceDTO, Resource, ResourceCategory, ResourceType } from "@/types/resource";

export const getFiles = async (): Promise<Resource[]> => {
  const response = await api.get<{ documents: Resource[] }>(ENDPOINTS.RESOURCE);
  console.log(response.data.documents);
  return response.data.documents || [];
}

export const uploadFile = async (resource: CreateResourceDTO): Promise<Resource> => {
  const response = await api.post<{ resource: Resource }>(`${ENDPOINTS.RESOURCE}/upload`, resource);
  return response.data.resource;
};


// Category and resource type management can be geetted from the backend if needed in the future.
export const getResourceCategories = async (): Promise<ResourceCategory[]> => {
  const response = await api.get<{ categories: ResourceCategory[] }>(`${ENDPOINTS.RESOURCE}/categories`);
  return response.data.categories;
};

export const getResourceTypes = async (): Promise<ResourceType[]> => {
  const response = await api.get<{ types: ResourceType[] }>(`${ENDPOINTS.RESOURCE}/types`);
  return response.data.types;
};