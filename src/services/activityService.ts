import api from '@/api/axios';
import { ActivityTask, Volunteer } from '@/types/activity';
import { camelizeKeys, snakeifyKeys } from '@/lib/caseUtils';

const ENDPOINTS = {
  ACTIVITIES: '/activity',
};

export const getActivities = async (): Promise<ActivityTask[]> => {
  console.log('[activityService] getActivities request START');
  const response = await api.get<{ activities: ActivityTask[] }>(
    ENDPOINTS.ACTIVITIES
  );
  const raw = response.data.activities ?? [];
  const result = camelizeKeys<ActivityTask[]>(raw);
  console.log('[activityService] getActivities response:', result.length, 'activities:', result.map(a => ({ id: a.id, title: a.title, status: a.status })));
  return result;
};

export const createActivity = async (
  activity: Omit<ActivityTask, 'id'>
): Promise<ActivityTask> => {
  const payload = snakeifyKeys(activity as any);
  const response = await api.post<{ activity: ActivityTask }>(
    `${ENDPOINTS.ACTIVITIES}/create`,
    payload
  );
  const raw = response.data.activity ?? response.data;
  return camelizeKeys<ActivityTask>(raw);
};

export const updateActivity = async (
  id: string,
  activity: Partial<Omit<ActivityTask, 'id'>>
): Promise<ActivityTask> => {
  const payload = snakeifyKeys(activity as any);
  console.log('[activityService] updateActivity REQUEST - id:', id, 'status sent:', (activity as any).status, 'full payload:', payload);
  const response = await api.put<{ activity: ActivityTask }>(
    `${ENDPOINTS.ACTIVITIES}/${id}`,
    payload
  );
  console.log('[activityService] updateActivity RAW RESPONSE:', response.data);
  const raw = response.data.activity ?? response.data;
  console.log('[activityService] updateActivity RAW (before camelize):', raw);
  const result = camelizeKeys<ActivityTask>(raw);
  console.log('[activityService] updateActivity RESPONSE (after camelize) - id:', result.id, 'status:', result.status, 'full:', result);
  return result;
};

export const deleteActivity = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.ACTIVITIES}/${id}`);
};

export const assignActivity = async (
  activityId: string,
  userId: string
): Promise<void> => {
  await api.post(`${ENDPOINTS.ACTIVITIES}/${activityId}/assign`, {
    volunteer_id: userId,
  });
};

export const unassignActivity = async (
  activityId: string,
  userId: string
): Promise<void> => {
  await api.post(`${ENDPOINTS.ACTIVITIES}/${activityId}/unassign`, {
    volunteer_id: userId,
  });
};

export const getVolunteersByActivity = async (
  activityId: string
): Promise<Volunteer[]> => {
  const response = await api.get<{ volunteers: Volunteer[] }>(
    `${ENDPOINTS.ACTIVITIES}/${activityId}/volunteers`
  );
  return response.data.volunteers;
};
