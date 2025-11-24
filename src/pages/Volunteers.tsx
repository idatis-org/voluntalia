import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Filter, Users } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import AddVolunteerModal from '@/components/modals/AddVolunteerModal';
import ViewProfileModal from '@/components/modals/ViewProfileModal';
import { Spinner } from '@/components/Spinner';
import { PageLayout } from '@/components/common/PageLayout';
import { StatsGrid } from '@/components/common/StatsGrid';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { VolunteerCard } from '@/components/volunteers/VolunteerCard';
import { ActivityManagementModal } from '@/components/volunteers/ActivityManagementModal';
import { AdvancedFilters } from '@/components/volunteers/AdvancedFilters';
import { useVolunteersPage } from '@/hooks/pages/useVolunteersPage';

const Volunteers: React.FC = () => {
  const {
    // Data
    volunteers,
    activities,
    isLoading,
    error,
    stats,

    // Pagination
    totalItems,
    totalPages,
    currentPage,
    startIndex,
    setCurrentPage,

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

    // Modals
    addVolunteerModal,
    viewProfileModal,
    activityModal,

    // Handlers
    handleDeleteVolunteer,
    handleContactVolunteer,
    handleViewProfile,
    handleManageActivities,
    handleAssignActivity,
    handleRemoveActivity,
  } = useVolunteersPage();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" color="text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error loading volunteers</p>;
  }

  const filterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <PageLayout
      title="Volunteers"
      description="Manage and connect with our volunteer community"
    >
      {/* Stats Grid */}
      <StatsGrid stats={stats} className="mb-8" />

      {/* Search and Filters */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search volunteers by name, email, or skills..."
        filterValue={filters.main}
        onFilterChange={setMainFilter}
        filterOptions={filterOptions}
        filterPlaceholder="Status"
        className="mb-6"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
            <Button
              onClick={() => addVolunteerModal.openModal()}
              className="bg-gradient-primary hover:shadow-hover transition-smooth"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Volunteer
            </Button>
          </div>
        }
      />

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <AdvancedFilters
              skillFilter={skillFilter}
              onSkillFilterChange={setSkillFilter}
              hoursRange={hoursRange}
              onHoursRangeChange={setHoursRange}
              eventsRange={eventsRange}
              onEventsRangeChange={setEventsRange}
              joinDateFilter={joinDateFilter}
              onJoinDateFilterChange={setJoinDateFilter}
            />
          </CardContent>
        </Card>
      )}

      {/* Filter Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
        <span>
          Showing {startIndex + 1}-{Math.min(startIndex + 6, totalItems)} of{' '}
          {totalItems} volunteers
        </span>
        {hasActiveFilters() && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Volunteers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {volunteers.map((volunteer) => (
          <VolunteerCard
            key={volunteer.id}
            volunteer={volunteer}
            onViewProfile={handleViewProfile}
            onManageActivities={handleManageActivities}
            onContact={handleContactVolunteer}
            onDelete={handleDeleteVolunteer}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first page, last page, current page, and pages around current
                  const shouldShow =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  if (!shouldShow) return null;

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Empty State */}
      {totalItems === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No volunteers found</p>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <AddVolunteerModal
        open={addVolunteerModal.isOpen}
        onOpenChange={addVolunteerModal.closeModal}
      />

      <ViewProfileModal
        isOpen={viewProfileModal.isOpen}
        onClose={() => viewProfileModal.closeModal()}
        volunteer={viewProfileModal.data}
      />

      <ActivityManagementModal
        isOpen={activityModal.isOpen}
        onClose={() => activityModal.closeModal()}
        volunteer={activityModal.data}
        activities={activities}
        searchActivity={searchActivity}
        onSearchActivityChange={setSearchActivity}
        onAssignActivity={handleAssignActivity}
        onRemoveActivity={handleRemoveActivity}
      />
    </PageLayout>
  );
};

export default Volunteers;
