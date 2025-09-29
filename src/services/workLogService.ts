import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { User, UserResponse } from "@/types/user";
import { WorkLog, WorkLogReponse, CreateWorkLogDTO, UpdateWorkLogDTO } from "@/types/workLog";

// type CreateUserResponse = {
//   user: User;
// };

type CreateWorkLog = {
    worklog: WorkLog;
}

export const getWorkLogsByUser = async (): Promise<WorkLog[]> => {
  const response = await api.get<WorkLogReponse>(`${ENDPOINTS.WORKLOG}/me`);
  console.log(response);
  return response.data.worklog ?? [];
};


export const createWorkLog = async (workLogData: CreateWorkLogDTO): Promise<WorkLog> => {
  const response = await api.post<CreateWorkLog>(`${ENDPOINTS.WORKLOG}/create`, workLogData);
  console.log(response);
  return response.data.worklog;
};

export const deleteWorklog = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.WORKLOG}/${id}`);
};

export const updateWorklog = async (id: string, worklogData: Partial<UpdateWorkLogDTO>): Promise<void> => {
  await api.put<User>(`${ENDPOINTS.WORKLOG}/${id}`, worklogData);
  //return response.data;
};