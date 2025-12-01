import { useState, useMemo } from 'react';
import { useUsers } from '@/hooks/user/useUsers';
import { useActivities } from '@/hooks/activity/useActivities';
import {
  useAssignActivity,
  useUnassignActivity,
} from '@/hooks/activity/useAssignActivity';
import { useToggleUserStatus } from '@/hooks/user/useToggleUserStatus';
import { useToast } from '@/hooks/use-toast';
import { useSearchAndFilter } from '@/hooks/common/useSearchAndFilter';
import { useModal } from '@/hooks/common/useModal';
import { useStats } from '@/hooks/common/useStats';
import { User } from '@/types/user';
import { Users, Award, Clock } from 'lucide-react';

export const useVolunteersPage = () => {
  const { toast } = useToast();
  const [searchActivity, setSearchActivity] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [skillFilter, setSkillFilter] = useState('all');
  const [hoursRange, setHoursRange] = useState('all');
  const [eventsRange, setEventsRange] = useState('all');
  const [joinDateFilter, setJoinDateFilter] = useState('all');
  const [volunteerToToggle, setVolunteerToToggle] = useState<User | null>(null);

  // Data fetching
  const { data: users = [], isLoading, error } = useUsers();
  const { data: activities = [] } = useActivities();

  // Mutations
  const assignActivityMutation = useAssignActivity();
  const unassignActivityMutation = useUnassignActivity();
  const toggleUserStatusMutation = useToggleUserStatus();

  // Search and filter functionality
  const {
    searchTerm,
    filters,
    currentPage,
    filteredData: filteredVolunteers,
    paginatedData: paginatedVolunteers,
    totalItems,
    totalPages,
    setSearchTerm,
    setMainFilter,
    setCurrentPage,
    resetSearch,
  } = useSearchAndFilter({
    data: users,
    searchFields: ['name', 'email'],
    defaultFilter: 'all',
    itemsPerPage: 6,
  });

  // Further filter volunteers based on advanced filters
  const finalFilteredVolunteers = useMemo(() => {
    return filteredVolunteers.filter((volunteer) => {
      const matchesStatus =
        filters.main === 'all' ||
        (filters.main === 'active' && volunteer.isActive === true) ||
        (filters.main === 'inactive' && volunteer.isActive === false);

      const matchesSkill =
        skillFilter === 'all' ||
        (volunteer.role &&
          volunteer.role.toLowerCase() === skillFilter.toLowerCase());

      // Add more filter logic as needed for hoursRange, eventsRange, joinDateFilter
      const matchesHours =
        hoursRange === 'all' ||
        (hoursRange === '0-50' && (volunteer.totalWorkHours || 0) <= 50) ||
        (hoursRange === '51-100' &&
          (volunteer.totalWorkHours || 0) > 50 &&
          (volunteer.totalWorkHours || 0) <= 100) ||
        (hoursRange === '101-200' &&
          (volunteer.totalWorkHours || 0) > 100 &&
          (volunteer.totalWorkHours || 0) <= 200) ||
        (hoursRange === '200+' && (volunteer.totalWorkHours || 0) > 200);

      // return matchesStatus && matchesSkill && matchesHours && matchesEvents && matchesJoinDate;
      return matchesStatus && matchesSkill && matchesHours;
    });
  }, [
    filteredVolunteers,
    filters.main,
    skillFilter,
    hoursRange,
    eventsRange,
    joinDateFilter,
  ]);

  // Recalculate pagination for final filtered data
  const finalTotalItems = finalFilteredVolunteers.length;
  const finalTotalPages = Math.ceil(finalTotalItems / 6);
  const startIndex = (currentPage - 1) * 6;
  const finalPaginatedVolunteers = finalFilteredVolunteers.slice(
    startIndex,
    startIndex + 6
  );

  // Modal management
  const addVolunteerModal = useModal();
  const viewProfileModal = useModal<User>();
  const activityModal = useModal<User>();

  // Stats configuration
  const statsConfig = [
    {
      key: 'total',
      label: 'Total Volunteers',
      icon: Users,
      calculate: (data: User[]) => data.length,
      color: 'text-primary',
    },
    {
      key: 'active',
      label: 'Active Volunteers',
      icon: Award,
      calculate: (data: User[]) =>
        data.filter((u) => u.isActive === true).length,
      color: 'text-soft-green',
    },
    {
      key: 'hours',
      label: 'Hours This Month',
      icon: Clock,
      calculate: () => '3,492', // This would come from actual hours data
      color: 'text-warm-accent',
    },
    {
      key: 'new',
      label: 'New This Month',
      icon: Users,
      calculate: () => '91', // This would come from actual new users data
      color: 'text-destructive',
    },
  ];

  const { stats } = useStats(users, statsConfig);

  // Handlers
  const handleDeleteVolunteer = (volunteerId: string) => {
    const volunteer = users.find((u) => u.id === volunteerId);
    if (volunteer) {
      setVolunteerToToggle(volunteer);
    }
  };

  const confirmToggleVolunteerStatus = async () => {
    if (!volunteerToToggle) return;

    const action = volunteerToToggle.isActive ? 'deactivated' : 'activated';
    const actionCapitalized = volunteerToToggle.isActive
      ? 'Deactivated'
      : 'Activated';

    try {
      await toggleUserStatusMutation.mutateAsync(volunteerToToggle.id);
      toast({
        title: `Volunteer ${actionCapitalized}`,
        description: `${volunteerToToggle.name} has been successfully ${action}.`,
      });
      setVolunteerToToggle(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action.slice(0, -1)} volunteer. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const cancelToggleVolunteerStatus = () => {
    setVolunteerToToggle(null);
  };

  const handleContactVolunteer = (
    volunteer: User,
    method: 'email' | 'phone'
  ) => {
    if (method === 'email') {
      window.location.href = `mailto:${volunteer.email}`;
    } else {
      window.location.href = `tel:`;
    }
  };

  const handleViewProfile = (volunteer: User) => {
    viewProfileModal.openModal(volunteer);
  };

  const handleEditVolunteerProfile = (volunteer: User) => {
    addVolunteerModal.openModal(volunteer, true);
  };

  const handleManageActivities = (volunteer: User) => {
    activityModal.openModal(volunteer);
    setSearchActivity('');
  };

  const handleAssignActivity = async (userId: string, activityId: string) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const activity = activities.find((a) => a.id === activityId);
      if (!activity) return;

      // Check if activity is already assigned
      const isAlreadyAssigned = user.volunteerActivities?.some(
        (a) => a.id === activityId
      );
      if (isAlreadyAssigned) {
        toast({
          title: 'Activity already assigned',
          description: 'This activity is already assigned to the volunteer.',
          variant: 'destructive',
        });
        return;
      }

      await assignActivityMutation.mutateAsync({
        activityId: activityId,
        userId: userId,
      });

      toast({
        title: 'Activity assigned',
        description: `${activity.title} has been assigned to ${user.name}.`,
      });

      // Update modal data to reflect the change
      const updatedUser = {
        ...user,
        volunteerActivities: [...(user.volunteerActivities || []), activity],
      };
      activityModal.openModal(updatedUser);
      setSearchActivity('');
    } catch (error) {
      toast({
        title: 'Error assigning activity',
        description:
          'There was an error assigning the activity. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveActivity = async (userId: string, activityId: string) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      await unassignActivityMutation.mutateAsync({
        activityId: activityId,
        userId: userId,
      });

      toast({
        title: 'Activity removed',
        description: 'The activity has been removed from the volunteer.',
      });

      // Update modal data to reflect the change
      const updatedUser = {
        ...user,
        volunteerActivities:
          user.volunteerActivities?.filter((a) => a.id !== activityId) || [],
      };
      activityModal.openModal(updatedUser);
    } catch (error) {
      toast({
        title: 'Error removing activity',
        description:
          'There was an error removing the activity. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const clearAllFilters = () => {
    setMainFilter('all');
    setSkillFilter('all');
    setHoursRange('all');
    setEventsRange('all');
    setJoinDateFilter('all');
    resetSearch();
  };

  const hasActiveFilters = () => {
    return (
      filters.main !== 'all' ||
      skillFilter !== 'all' ||
      hoursRange !== 'all' ||
      eventsRange !== 'all' ||
      joinDateFilter !== 'all' ||
      searchTerm !== ''
    );
  };
  return {
    // Data
    users,
    activities,
    isLoading,
    error,
    stats,

    // Filtered and paginated data
    volunteers: finalPaginatedVolunteers,
    totalItems: finalTotalItems,
    totalPages: finalTotalPages,
    currentPage,
    startIndex,

    // Search and filters
    searchTerm,
    setSearchTerm,
    filters,
    setMainFilter,
    skillFilter,
    setSkillFilter,
    hoursRange,
    setHoursRange,
    eventsRange,
    setEventsRange,
    joinDateFilter,
    setJoinDateFilter,
    showAdvancedFilters,
    setShowAdvancedFilters,
    clearAllFilters,
    hasActiveFilters,

    // Activity search
    searchActivity,
    setSearchActivity,

    // Pagination
    setCurrentPage,

    // Modals
    addVolunteerModal,
    viewProfileModal,
    activityModal,

    // Toggle status confirmation
    volunteerToToggle,
    confirmToggleVolunteerStatus,
    cancelToggleVolunteerStatus,
    isTogglingStatus: toggleUserStatusMutation.isPending,

    // Handlers
    handleDeleteVolunteer,
    handleContactVolunteer,
    handleViewProfile,
    handleEditVolunteerProfile,
    handleManageActivities,
    handleAssignActivity,
    handleRemoveActivity,
  };
};
