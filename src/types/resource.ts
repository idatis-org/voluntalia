export interface Resource {
  id: string;
  filename: string;
  description: string;
  type: string;
  category: string;
  format: string;
  size: string;
  downloads: number;
  uploadDate: string;
  tags: string[];
  fileUrl?: string;
  visibility?: string;
  permissions?: string;
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
  type: string;
  category: string;
  format: string;
  size: string;
  tags: string[];
  fileUrl?: string;
  visibility?: string;
  permissions?: string;
}