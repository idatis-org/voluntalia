import api from "@/api/axios";
import { ActivityTask } from "@/types/activity";

const ENDPOINTS = {
  ACTIVITIES: "/activity"
};

export const getActivities = async (): Promise<ActivityTask[]> => {
  const response = await api.get<{ activities: ActivityTask[] }>(ENDPOINTS.ACTIVITIES);
  return response.data.activities;
};

export const createActivity = async (activity: Omit<ActivityTask, "id">): Promise<ActivityTask> => {
  const response = await api.post<{ activity: ActivityTask }>(`${ENDPOINTS.ACTIVITIES}/create`, activity);
  return response.data.activity;
};

export const updateActivity = async (id: string, activity: Partial<Omit<ActivityTask, "id">>): Promise<ActivityTask> => {
  const response = await api.put<{ activity: ActivityTask }>(`${ENDPOINTS.ACTIVITIES}/${id}`, activity);
  return response.data.activity;
};

export const deleteActivity = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.ACTIVITIES}/${id}`);
};

export const assignActivity = async (activityId: string, userId: string): Promise<void> => {
  await api.post(`${ENDPOINTS.ACTIVITIES}/${activityId}/assign`, {volunteer_id: userId});
}

export const unassignActivity = async (activityId: string, userId: string): Promise<void> => {
  await api.post(`${ENDPOINTS.ACTIVITIES}/${activityId}/unassign`, {volunteer_id: userId});
}