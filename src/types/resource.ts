export interface Resource {
  id: string;
  filename: string;
  description: string;
  type: string;
  category: string;
  format: string;
  user_id: string;
  size?: number;
  downloads: number;
  created_at: string;
  tags: string;
  fileUrl?: string;
  visibility?: string;
  permissions?: string;
  storage_path?: string;
  resource_type_id?: string;
  category_id?: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
}

export interface ResourceType {
  id: string;
  name: string;
}

export interface CreateResourceDTO {
  title: string;
  description: string;
  resource_type_id: string;
  category_id: string;
  file: File;
  format: string;
  size: string;
  tags: string[];
  fileUrl?: string;
  visibility?: string;
  permissions?: string;
}

export interface CreateResourceWithFileDTO {
  file: File;
  title: string;
  description: string;
  resource_type_id: string;
  category_id: string;
  format: string;
  type: string;
  size: string;
  tags: string[];
  visibility?: string;
  permissions?: string;
  folder?: string;
}
