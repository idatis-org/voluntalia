import { ActivityTask } from "./activity";

export interface PostgresInterval {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

// Interface principal
export interface WorkLog {
  id: string;
  week_start: string; 
  hours: PostgresInterval;
  notes: string;
  status?: string;
  activity_title?: string;
  activity: ActivityTask | null;
}

export interface CreateWorkLogDTO{
  week_start: string; 
  hours: string;
  notes: string;
  activity: ActivityTask | null;
}

export type UpdateWorkLogDTO = Partial<CreateWorkLogDTO>


export interface WorkLogReponse{
    worklog: WorkLog[];
}