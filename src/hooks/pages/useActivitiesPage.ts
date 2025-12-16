import { useActivities } from '@/hooks/activity/useActivities';
import { useCreateActivity } from '@/hooks/activity/useCreateActivity';
import { useUpdateActivity } from '@/hooks/activity/useUpdateActivity';
import { useDeleteActivity } from '@/hooks/activity/useDeleteActivity';
import { useSearchAndFilter } from '@/hooks/common/useSearchAndFilter';
import { useModal } from '@/hooks/common/useModal';
import { useFormData } from '@/hooks/common/useFormData';
import { useStats } from '@/hooks/common/useStats';
import { useConfirmDialog } from '@/hooks/common/useConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateWorkLog } from '@/hooks/workLog/useCreateWorkLog';
import { ActivityTask } from '@/types/activity';
import { Clock, CheckCircle, FileText, Calendar, Users } from 'lucide-react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { getActivityStats } from '@/services/activityService';
import { ActivityStats } from '@/types/activity';

interface ActivityFormData {
  name: string;
  description: string;
  date: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  projectId: string;
}

const initialFormData: ActivityFormData = {
  name: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  status: 'planned',
  projectId: '',
};

/**
 * Calcular horas completadas por el usuario actual en una actividad
 */
const getMyHours = (activity: ActivityTask, userId: string | undefined): number => {
  if (!userId || !activity.user_hours) return 0;
  const myEntry = activity.user_hours.find(uh => uh.user_id === userId);
  return myEntry?.hours || 0;
};

/**
 * Verificar si el usuario es COORDINATOR
 */
const isCoordinator = (role: string | undefined): boolean => role === 'COORDINATOR';

/**
 * Verificar si el usuario es PROJECT_MANAGER
 */
const isProjectManager = (role: string | undefined): boolean => role === 'PROJECT_MANAGER';

/**
 * Verificar si el usuario es VOLUNTEER
 */
const isVolunteer = (role: string | undefined): boolean => role === 'VOLUNTEER';

export const useActivitiesPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Data hooks
  const { data: activities = [], isLoading } = useActivities();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();

  // Search and filtering
  const searchAndFilter = useSearchAndFilter({
    data: activities,
    searchFields: ['title', 'description', 'status', 'date'] as (keyof ActivityTask)[],
    itemsPerPage: 10,
  });

  

  // Modals
  const createModal = useModal();
  const editModal = useModal<ActivityTask>();
  const confirmDialog = useConfirmDialog();
  const showVolunteersModal = useModal<ActivityTask>();

  // Form handling
  const validateForm = (data: ActivityFormData) => {
    const errors: Record<string, string> = {};
    if (!data.name.trim()) {
      errors.name = 'Activity name is required';
    }
    if (!data.date) {
      errors.date = 'Date is required';
    }
    return Object.keys(errors).length > 0 ? errors : null;
  };

  const form = useFormData({
    initialValues: initialFormData,
    validate: validateForm,
  });

  // Add Hours (worklog) modal and form
  const logHoursModal = useModal<ActivityTask>();
  const createWorkLog = useCreateWorkLog();

  const hoursFormInitial = {
    date: new Date().toISOString().split('T')[0],
    hours: '',
    description: '',
    activity: null as ActivityTask | null,
  };

  const hoursForm = useFormData({
    initialValues: hoursFormInitial,
    validate: (data: any) => {
      const errors: Record<string, string> = {};
      if (!data.hours) errors.hours = 'Hours is required';
      if (!data.description || !data.description.trim()) errors.description = 'Description is required';
      return Object.keys(errors).length > 0 ? errors : null;
    }
  });

  // Stats configuration
  const statsConfig = [
    {
      key: 'total',
      label: 'Total Activities',
      calculate: (data: ActivityTask[]) => data.length,
      icon: FileText,
      color: 'text-primary',
    },
    {
      key: 'active',
      label: 'Active',
      calculate: (data: ActivityTask[]) => data.filter(a => a.status === 'active').length,
      icon: Calendar,
      color: 'text-amber-600',
    },
    {
      key: 'completed',
      label: 'Completed',
      calculate: (data: ActivityTask[]) => data.filter(a => a.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      key: 'upcoming',
      label: 'Upcoming (7d)',
      calculate: (data: ActivityTask[]) => {
        const today = new Date();
        const in7 = new Date();
        in7.setDate(today.getDate() + 7);
        return data.filter(a => {
          if (!a.date) return false;
          const d = new Date(a.date);
          return d >= today && d <= in7;
        }).length;
      },
      icon: Calendar,
      color: 'text-primary',
    },
    {
      key: 'hours',
      label: 'Total Logged Hours',
      calculate: (data: ActivityTask[]) => {
        // Prefer aggregate completed_hours if available, otherwise sum user_hours
        const sumFromCompleted = data.reduce((s, a) => s + (a.completed_hours ?? a.completedHours ?? 0), 0);
        if (sumFromCompleted > 0) return `${sumFromCompleted}h`;

        const sumFromUsers = data.reduce((s, a) => {
          if (!a.user_hours) return s;
          return s + a.user_hours.reduce((ss, uh) => ss + (uh.hours || 0), 0);
        }, 0);
        return `${sumFromUsers}h`;
      },
      icon: Clock,
      color: 'text-sky-600',
    },
  ];

  const { stats } = useStats(activities, statsConfig);

  // Server-provided aggregated stats (preferred). Fetch with same filters as UI.
  const statsParams: Record<string, any> = {};
  if (searchAndFilter.filters?.project && searchAndFilter.filters.project !== 'all') statsParams.projectId = searchAndFilter.filters.project;
  if (searchAndFilter.filters?.status && searchAndFilter.filters.status !== 'all') statsParams.status = searchAndFilter.filters.status;
  if (searchAndFilter.filters?.dateFrom) statsParams.dateFrom = searchAndFilter.filters.dateFrom;
  if (searchAndFilter.filters?.dateTo) statsParams.dateTo = searchAndFilter.filters.dateTo;
  if (searchAndFilter.searchTerm) statsParams.search = searchAndFilter.searchTerm;
  if (user?.id) statsParams.userId = user.id;
  if (isVolunteer(user?.role)) statsParams.userScoped = true;

  const activityStatsQuery = useQuery({
    queryKey: ['activities', 'stats', statsParams, user?.id],
    queryFn: () => getActivityStats(statsParams),
    // keep using client-side stats while loading
    staleTime: 1000 * 60, // 1 minute
  });

  // Map server response to stats format expected by StatsGrid (fallback to client stats)
  const serverStats: ActivityStats | undefined = activityStatsQuery.data;
  const finalStats = serverStats
    ? [
        { key: 'total', label: 'Total Activities', value: serverStats.total ?? 0, icon: FileText, color: 'text-primary' },
        { key: 'active', label: 'Active', value: serverStats.statusCounts?.active ?? 0, icon: Calendar, color: 'text-amber-600' },
        { key: 'completed', label: 'Completed', value: serverStats.statusCounts?.completed ?? 0, icon: CheckCircle, color: 'text-green-600' },
        { key: 'upcoming', label: 'Upcoming (7d)', value: serverStats.upcoming7Days ?? 0, icon: Calendar, color: 'text-primary' },
        { key: 'hours', label: 'Total Logged Hours', value: serverStats.totalLoggedHours ?? 0, icon: Clock, color: 'text-sky-600' },
      ]
    : stats;

  // Actions
  const handleCreate = async () => {
    // Validate form data
    const errors = validateForm(form.formData);
    if (errors) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Do not send completedHours on create — backend computes completed_hours from work_logs
      await createActivity.mutateAsync({
        title: form.formData.name.trim(),
        description: form.formData.description.trim() || undefined,
        date: new Date(form.formData.date).toISOString(),
        status: form.formData.status,
        projectId: form.formData.projectId || undefined,
      } as any);

      createModal.closeModal();
      form.resetForm();
      toast({
        title: 'Success',
        description: 'Activity created successfully',
      });
    } catch (error) {
      const status = (error as any)?.response?.status;
      if (status === 409) {
        form.setFieldError?.('name', 'Ya existe una actividad con ese nombre. Por favor cámbielo.');
        toast({
          title: 'Error',
          description: 'Nombre duplicado. Cambia el nombre.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Error',
        description: 'Failed to create activity',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (activity: ActivityTask) => {
    form.updateFormData({
      name: activity.title,
      description: activity.description || '',
      date: activity.date ? new Date(activity.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: (activity.status as any) || 'planned',
      projectId: (activity.projectId as string) || '',
    });
    editModal.openModal(activity);
  };

  const handleUpdate = async () => {
    if (!editModal.data) return;

    // Validate form data
    const errors = validateForm(form.formData);
    if (errors) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Build payload without completedHours (must be updated via work_logs)
      const payload: any = {
        title: form.formData.name.trim(),
        description: form.formData.description.trim() || undefined,
        date: new Date(form.formData.date).toISOString(),
        status: form.formData.status,
      };

      // Only allow changing projectId if current user is coordinator
      if (isCoordinator(user?.role) && form.formData.projectId) {
        payload.projectId = form.formData.projectId;
      }

      await updateActivity.mutateAsync({
        id: editModal.data.id,
        data: payload,
      } as any);

      editModal.closeModal();
      form.resetForm();
      toast({
        title: 'Success',
        description: 'Activity updated successfully',
      });
    } catch (error) {
      const status = (error as any)?.response?.status;
      if (status === 409) {
        form.setFieldError?.('name', 'Ya existe una actividad con ese nombre. Por favor cámbielo.');
        toast({
          title: 'Error',
          description: 'Nombre duplicado. Cambia el nombre.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Error',
        description: 'Failed to update activity',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = (activity: ActivityTask) => {
    confirmDialog.showDialog({
      title: 'Delete Activity',
      description: `Are you sure you want to delete "${activity.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await deleteActivity.mutateAsync(activity.id);
          toast({
            title: 'Success',
            description: 'Activity deleted successfully',
          });
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to delete activity',
            variant: 'destructive',
          });
        }
      },
    });
  };

  const handleModalClose = () => {
    form.resetForm();
  };

  const handleShowVolunteers = (activity: ActivityTask) => {
    showVolunteersModal.openModal(activity);
  };

  const handleOpenAddHours = (activity: ActivityTask) => {
    hoursForm.updateFormData({
      date: new Date().toISOString().split('T')[0],
      hours: '',
      description: '',
      activity
    });
    logHoursModal.openModal(activity);
  };
  const handleSubmitHours = async () => {
    const valid = hoursForm.validateForm();
    if (!valid) {
      toast({ title: 'Validation Error', description: 'Please fix the errors', variant: 'destructive' });
      return;
    }

    try {
      const payload: any = {
        week_start: hoursForm.formData.date,
        hours: `${hoursForm.formData.hours} hours`,
        notes: hoursForm.formData.description,
        activity: hoursForm.formData.activity,
      };

      await createWorkLog.mutateAsync(payload);
      toast({ title: 'Success', description: 'Hours logged successfully' });
      logHoursModal.closeModal();
      hoursForm.resetForm();
      // refresh activities/worklogs
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['worklog'] });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to log hours', variant: 'destructive' });
    }
  };

  return {
    // Data
    activities,
    isLoading,
    stats: finalStats,
    user,

    // Search and filter
    searchAndFilter,

    // Modals
    createModal,
    editModal,
    confirmDialog,
    showVolunteersModal,

    // Add Hours modal
    logHoursModal,

    // Form
    form,
    hoursForm,

    // Actions
    handleCreate,
    isLoggingHours: createWorkLog.isPending,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleModalClose,
    handleShowVolunteers,
    handleOpenAddHours,
    handleSubmitHours,

    // Utilities
    getMyHours,
    isCoordinator,
    isProjectManager,
    isVolunteer,

    // Loading states
    isCreating: createActivity.isPending,
    isUpdating: updateActivity.isPending,
    isDeleting: deleteActivity.isPending,
  };
};
