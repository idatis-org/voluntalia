import { ActivityTask } from "./activity";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  volunteerActivities?: ActivityTask[] | null;
  createdAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  country: string;
  city: string;
  volunteerActivities?: null;
  role?: string;
}

export interface UserResponse {
  users: User[];
}
