import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { WorkLog, WorkLogReponse, CreateWorkLogDTO, UpdateWorkLogDTO } from "@/types/workLog";
import { camelizeKeys, snakeifyKeys } from "@/lib/caseUtils";

// type CreateUserResponse = {
//   user: User;
// };

type CreateWorkLog = {
    worklog: WorkLog;
}

export const getWorkLogsByUser = async (): Promise<WorkLog[]> => {
  const response = await api.get(`${ENDPOINTS.WORKLOG}/me`);
  const raw = response.data?.worklog ?? [];
  const normalized = camelizeKeys<WorkLog[]>(raw).map((w) => ({
    ...w,
    weekStart: w.weekStart ?? ((w as unknown as Record<string, unknown>)['week_start'] as string | undefined),
    activityTitle: w.activityTitle ?? ((w as unknown as Record<string, unknown>)['activity_title'] as string | undefined),
  }));
  return normalized as WorkLog[];
};


export const createWorkLog = async (workLogData: CreateWorkLogDTO): Promise<WorkLog> => {
  const payload = snakeifyKeys(workLogData);
  const response = await api.post(`${ENDPOINTS.WORKLOG}/create`, payload);
  const raw = response.data?.worklog ?? response.data;
  const created = camelizeKeys<WorkLog>(raw);
  created.weekStart = created.weekStart ?? ((raw as Record<string, unknown>)['week_start'] as string | undefined);
  created.activityTitle = created.activityTitle ?? ((raw as Record<string, unknown>)['activity_title'] as string | undefined);
  return created;
};

export const deleteWorklog = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.WORKLOG}/${id}`);
};

export const updateWorklog = async (id: string, worklogData: Partial<UpdateWorkLogDTO>): Promise<WorkLog> => {
  const payload = snakeifyKeys(worklogData);
  const response = await api.put(`${ENDPOINTS.WORKLOG}/${id}`, payload);
  const raw = response.data;
  const updated = camelizeKeys<WorkLog>(raw);
  updated.weekStart = updated.weekStart ?? ((raw as Record<string, unknown>)['week_start'] as string | undefined);
  updated.activityTitle = updated.activityTitle ?? ((raw as Record<string, unknown>)['activity_title'] as string | undefined);
  return updated;
};