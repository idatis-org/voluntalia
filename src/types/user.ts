import { ActivityTask } from './activity';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  role?: string; // 'COORDINATOR' | 'PROJECT_MANAGER' | 'VOLUNTEER' | 'LEGAL'
  project_id?: string | null; // Presente si user es PROJECT_MANAGER
  volunteerActivities?: ActivityTask[] | null;
  totalWorkHours?: number | null;
  createdAt: string;
}

export interface UserProject {
  id: string;
  name: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  country: string;
  city: string;
  volunteerActivities?: null;
  role?: string;
  skills?: string[];
}

export interface UserResponse {
  users: User[];
}
