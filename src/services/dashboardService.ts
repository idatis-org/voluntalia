import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { DashboardStats } from "@/types/dashboard";

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>(ENDPOINTS.STATS);
    return response.data;
};
