import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateActivity } from "@/services/activityService";
import { ActivityTask } from "@/types/activity";

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ActivityTask, Error, { id: string; data: Partial<Omit<ActivityTask, "id">> }>(
    {
      mutationFn: async ({ id, data }) => {
        console.log('[useUpdateActivity] mutate - ID:', id, 'STATUS in data:', data.status, 'full data:', data);
        return updateActivity(id, data);
      },
      onSuccess: async (updated, variables) => {
        console.log('[useUpdateActivity] onSuccess updated:', updated, 'vars:', variables);

        // If backend returned full updated activity, update cache entry optimistically
        if (updated && (updated as any).id) {
          try {
            queryClient.setQueryData<ActivityTask[] | undefined>(["activities"], (old) =>
              old ? old.map((a) => ((a.id === (updated as any).id ? (updated as ActivityTask) : a))) : old
            );
          } catch (e) {
            // ignore
          }

          // Invalidate related queries to ensure fresh data where needed
          queryClient.invalidateQueries({ queryKey: ["activities"] });
          if ((updated as any).projectId) {
            queryClient.invalidateQueries({ queryKey: ["projects", (updated as any).projectId] });
          }
          queryClient.invalidateQueries({ queryKey: ["projects"] });
          return;
        }

        // Backend returned minimal response (e.g. { ok: true })
        // Try to infer projectId from mutation variables or from cached activities
        const activityId = variables?.id;
        const projectIdFromVars = variables?.data?.projectId as string | undefined;
        let projectId = projectIdFromVars;

        if (!projectId && activityId) {
          const current = queryClient.getQueryData<ActivityTask[] | undefined>(["activities"]);
          projectId = current?.find(a => a.id === activityId)?.projectId;
        }

        console.warn('[useUpdateActivity] backend did not return updated activity object; invalidating/forcing refetch, inferred projectId:', projectId);

        // Invalidate activities and force refetch to ensure fresh data
        queryClient.invalidateQueries({ queryKey: ["activities"] });
        const activitiesRefetch = await queryClient.refetchQueries({ queryKey: ["activities"] });
        console.log('[useUpdateActivity] after refetchQueries activities:', activitiesRefetch);
        
        // Verify that the activity was actually updated by checking the new data
        const newActivities = queryClient.getQueryData<ActivityTask[] | undefined>(["activities"]);
        const updatedActivityData = newActivities?.find(a => a.id === variables?.id);
        console.log('[useUpdateActivity] VERIFICATION - updated activity from cache after refetch:', updatedActivityData);

        // Try to refetch project-specific and projects list queries
        if (projectId) {
          await queryClient.refetchQueries({ queryKey: ["projects", projectId] });
        }

        // Refetch any queries with first key 'projects' or 'project'
        const projectsRefetched: string[] = [];
        await queryClient.refetchQueries({
          predicate: (query) => {
            const k = query.queryKey?.[0] as string | undefined;
            if (!k) return false;
            if (k === 'projects' || k === 'project') {
              projectsRefetched.push(String(query.queryKey));
              return true;
            }
            return false;
          }
        });

        console.log('[useUpdateActivity] refetched project-related queries:', projectsRefetched);
      },
    }
  );
};