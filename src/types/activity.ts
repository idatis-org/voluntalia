export interface UserHours {
  user_id: string;
  user_name: string;
  hours: number;
}

export interface ActivityTask {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD (backend stores DATEONLY)
  projectId?: string;
  project_id?: string;
  createdBy?: string;
  created_by?: {
    id: string;
    name: string;
  };
  status: 'planned' | 'active' | 'completed' | 'cancelled'; // Estado según backend
  completedHours?: number;
  completed_hours?: number;
  project?: {
    id: string;
    name: string;
    startDate?: string;
  };
  user_hours?: UserHours[]; // Array de horas aprobadas por usuario
  volunteers?: Volunteer[];
  totalVolunteers?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  hoursContributed?: number; // Horas que contribuyó este voluntario
}
