import api from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import {
  CreateResourceDTO,
  CreateResourceWithFileDTO,
  Resource,
  ResourceCategory,
  ResourceType,
} from '@/types/resource';

export const getFiles = async (): Promise<Resource[]> => {
  const response = await api.get<{ documents: Resource[] }>(ENDPOINTS.RESOURCE);
  return response.data.documents || [];
};

export const uploadFile = async (
  resource: CreateResourceDTO
): Promise<Resource> => {
  const response = await api.post<{ resource: Resource }>(
    `${ENDPOINTS.RESOURCE}/upload`,
    resource
  );
  return response.data.resource;
};

export const uploadResourceWithFile = async (
  dto: CreateResourceWithFileDTO
): Promise<Resource> => {
  const formData = new FormData();

  // archivo
  formData.append('file', dto.file);

  // resto de campos como texto
  formData.append('title', dto.title);
  formData.append('description', dto.description);
  formData.append('resource_type_id', dto.resource_type_id);
  formData.append('category_id', dto.category_id);
  formData.append('format', dto.format);
  formData.append('size', dto.size);
  formData.append('type', dto.type);
  formData.append('visibility', dto.visibility ?? 'public');
  formData.append('permissions', dto.permissions ?? '');
  formData.append('tags', JSON.stringify(dto.tags)); // array como string

  const folderQuery = dto.folder
    ? `?folder=${encodeURIComponent(dto.folder)}`
    : '';

  const response = await api.post<{ resource: Resource }>(
    `${ENDPOINTS.RESOURCE}/upload${folderQuery}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }, // axios se encarga del boundary
    }
  );
  return response.data.resource;
};

export const downloadDocument = async (id: string): Promise<void> => {
  const { data, headers } = await api.get(
    `${ENDPOINTS.RESOURCE}/${id}/download`,
    { responseType: 'blob' }
  );

  const filename =
    headers['content-disposition']
      ?.split('filename=')[1]
      ?.replace(/["']/g, '') || 'archivo';

  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Category and resource type management can be geetted from the backend if needed in the future.
export const getResourceCategories = async (): Promise<ResourceCategory[]> => {
  const response = await api.get<{ categories: ResourceCategory[] }>(
    `${ENDPOINTS.RESOURCE}/categories`
  );
  return response.data.categories;
};

export const getResourceTypes = async (): Promise<ResourceType[]> => {
  const response = await api.get<{ types: ResourceType[] }>(
    `${ENDPOINTS.RESOURCE}/types`
  );
  return response.data.types;
};

export const deleteResource = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.RESOURCE}/${id}`);
};
