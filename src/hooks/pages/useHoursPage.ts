import { useState } from "react";
import { useWorkLog } from "@/hooks/workLog/useWorkLog";
import { useCreateWorkLog } from "@/hooks/workLog/useCreateWorkLog";
import { useDeleteWorklog } from "@/hooks/workLog/useDeleteWorkLog";
import { useUpdateWorklog } from "@/hooks/workLog/useUpdateWorkLog";
import { useCurrentUser } from "@/hooks/user/useCurrentUser";
import { useSearchAndFilter } from "@/hooks/common/useSearchAndFilter";
import { useModal } from "@/hooks/common/useModal";
import { useFormData } from "@/hooks/common/useFormData";
import { useStats } from "@/hooks/common/useStats";
import { useToast } from "@/hooks/use-toast";
import { WorkLog, CreateWorkLogDTO, UpdateWorkLogDTO } from "@/types/workLog";
import { ActivityTask } from '@/types/activity';
import { Clock, Award, Calendar } from "lucide-react";

interface HoursFormData {
  date: string;
  hours: string;
  activity: ActivityTask | null;
  description: string;
}

const initialFormData: HoursFormData = {
  date: new Date().toISOString().split('T')[0],
  hours: "",
  activity: null,
  description: ""
};

export const useHoursPage = () => {
  const { toast } = useToast();
  const [editingEntry, setEditingEntry] = useState<WorkLog | null>(null);
  
  // Data hooks
  const { data: worklog = [], isLoading, error } = useWorkLog();
  const createWorkLogMutation = useCreateWorkLog();
  const { data: user, isLoading: isUserLoading, error: userError } = useCurrentUser();
  const deleteWorklog = useDeleteWorklog();
  const updateWorklog = useUpdateWorklog();
  
  const activities: ActivityTask[] = user?.user.volunteerActivities ?? [];

  // Search and filtering
  const searchAndFilter = useSearchAndFilter({
    data: worklog,
    searchFields: ['notes'] as (keyof WorkLog)[],
    itemsPerPage: 10
  });

  // Modal
  const logHoursModal = useModal();

  // Form handling
  const validateForm = (data: HoursFormData) => {
    const errors: Record<string, string> = {};
    if (!data.hours) {
      errors.hours = "Hours is required";
    }
    if (!data.description.trim()) {
      errors.description = "Description is required";
    }
    return Object.keys(errors).length > 0 ? errors : null;
  };

  const form = useFormData({
    initialValues: initialFormData,
    validate: validateForm
  });

  // Stats configuration
  const totalHours = worklog.reduce((sum, entry) => sum + (entry.hours.hours || 0), 0);
  const approvedHours = worklog.filter(e => e.status === "approved").reduce((sum, entry) => sum + (entry.hours.hours || 0), 0);
  const pendingHours = worklog.filter(e => e.status === "pending").reduce((sum, entry) => sum + (entry.hours.hours || 0), 0);

  const statsConfig = [
    {
      key: 'total',
      label: 'Total Hours',
      calculate: () => totalHours,
      icon: Clock,
      color: 'text-primary'
    },
    {
      key: 'approved',
      label: 'Approved Hours',
      calculate: () => approvedHours,
      icon: Award,
      color: 'text-soft-green'
    },
    {
      key: 'pending',
      label: 'Pending Hours',
      calculate: () => pendingHours,
      icon: Clock,
      color: 'text-warm-accent'
    },
    {
      key: 'entries',
      label: 'Total Entries',
      calculate: (data: WorkLog[]) => data.length,
      icon: Calendar,
      color: 'text-destructive'
    }
  ];

  const { stats } = useStats(worklog, statsConfig);

  // Filter options
  const filterOptions = [
    { value: "all", label: "All Status" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" }
  ];

  // Actions
  const handleSubmitHours = async () => {
    try {
      const newWorkLog: CreateWorkLogDTO = {
        week_start: form.formData.date,
        hours: `${form.formData.hours} hours`,
        notes: form.formData.description,
        activity: form.formData.activity
      };

      if (editingEntry !== null) {
        const editing: UpdateWorkLogDTO = newWorkLog;
        await updateWorklog.mutateAsync({ id: editingEntry.id, data: editing });
      } else {
        await createWorkLogMutation.mutateAsync(newWorkLog);
      }

      toast({
        title: "Hours Logged",
        description: "Your hours have been logged successfully."
      });

      logHoursModal.closeModal();
      form.resetForm();
      setEditingEntry(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log hours. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditEntry = (entry: WorkLog) => {
    setEditingEntry(entry);
    form.updateFormData({
      date: entry.week_start,
      hours: entry.hours.hours?.toString() || "",
      activity: entry.activity,
      description: entry.notes
    });
    logHoursModal.openModal();
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteWorklog.mutateAsync(entryId);
      toast({
        title: "Entry Deleted",
        description: "Hour entry has been removed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hours. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleModalClose = () => {
    form.resetForm();
    setEditingEntry(null);
  };

  // Custom filter function for status
  const filteredEntries = worklog.filter(entry => {
    const matchesSearch = entry.notes.toLowerCase().includes(searchAndFilter.searchTerm.toLowerCase()) ||
                         (entry.activity?.description && entry.activity.description.toLowerCase().includes(searchAndFilter.searchTerm.toLowerCase()));
    
    const matchesFilter = searchAndFilter.filters.status === "all" || entry.status === searchAndFilter.filters.status;
    
    return matchesSearch && matchesFilter;
  });

  return {
    // Data
    worklog,
    activities,
    isLoading,
    error,
    stats,
    filterOptions,
    filteredEntries,
    
    // Search and filter
    searchAndFilter,
    
    // Modal and form
    logHoursModal,
    form,
    editingEntry,
    
    // Actions
    handleSubmitHours,
    handleEditEntry,
    handleDeleteEntry,
    handleModalClose,
    
    // Loading states
    isSubmitting: createWorkLogMutation.isPending || updateWorklog.isPending,
    isDeleting: deleteWorklog.isPending
  };
};