export interface ActivityTask {
  id: string;
  title: string;
  description?: string;
  date: Date | null;
  total_volunteers?: number;
  volunteers?: VolunteersByActivity[];
}

export interface VolunteersByActivity {
  id: string;
  name: string;
  email: string;
}
