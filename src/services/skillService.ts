import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { Skill, CreateSkillDTO } from "@/types/skill";

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get<{ skills: Skill[] }>(ENDPOINTS.SKILLS);
  return response.data.skills;
};

export const createSkill = async (skill: CreateSkillDTO): Promise<Skill> => {
  const response = await api.post<Skill>(`${ENDPOINTS.SKILLS}/create`, skill);
  return response.data;
};

export const updateSkill = async (id: string, skill: CreateSkillDTO): Promise<Skill> => {
  const response = await api.put<Skill>(`${ENDPOINTS.SKILLS}/update/${id}`, skill);
  return response.data;
};

export const deleteSkill = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.SKILLS}/delete/${id}`);
};

export const getUserSkills = async (userId: string): Promise<Skill[]> => {
  const response = await api.get<{ skills: Skill[] }>(`${ENDPOINTS.USERS}/${userId}/skills`);
  return response.data.skills;
};

export const assignSkillToUser = async (userId: string, skillId: string): Promise<void> => {
  await api.post(`${ENDPOINTS.USERS}/${userId}/skills`, { skillId });
};

export const removeSkillFromUser = async (userId: string, skillId: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.USERS}/${userId}/skills/${skillId}`);
};
