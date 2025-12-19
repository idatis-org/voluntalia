import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Edit, Trash2 } from "lucide-react";
import { PageLayout } from "@/components/common/PageLayout";
import { StatsGrid } from "@/components/common/StatsGrid";
import { SearchFilterBar } from "@/components/common/SearchFilterBar";
import { Spinner } from "@/components/Spinner";
import { useHoursPage } from "@/hooks/pages/useHoursPage";
import { LogHoursModal } from "@/components/modals/LogHoursModal";

const Hours: React.FC = () => {
  const {
    // Data
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
    isSubmitting
  } = useHoursPage();

  if (isLoading) 
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" color="text-indigo-600" />
      </div>
    );

  if (error) return <p style={{ color: "red" }}>Error loading hours</p>;

  return (
    <div className="min-h-screen bg-background">
      <PageLayout 
        title="Volunteer Hours" 
        description="Track and manage your volunteer time contributions"
      >
        {/* Stats Cards */}
        <StatsGrid stats={stats} columns={4} className="mb-8" />

        {/* Search and Filters */}
        <SearchFilterBar
          searchTerm={searchAndFilter.searchTerm}
          onSearchChange={searchAndFilter.setSearchTerm}
          searchPlaceholder="Search hours by description or activity..."
          filterValue={searchAndFilter.filters.status}
          onFilterChange={(value) => searchAndFilter.setCustomFilter('status', value)}
          filterOptions={filterOptions}
          filterPlaceholder="All Status"
          actions={
            <Button 
              className="bg-gradient-primary hover:shadow-hover transition-smooth"
              onClick={() => logHoursModal.toggleModal()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Log Hours
            </Button>
          }
          className="mb-6"
        />

        <LogHoursModal 
          open={logHoursModal.isOpen}
          onOpenChange={logHoursModal.toggleModal}
          activities={activities}
          editingEntry={editingEntry}
          onSuccess={() => {
            handleModalClose();
          }}
        />

        {/* Hours Entries */}
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="shadow-card hover:shadow-hover transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      {entry.hours.hours} {entry.hours.hours === 1 ? 'hour' : 'hours'} - {new Date(entry.week_start).toLocaleDateString()}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {entry.activity && `• ${entry.activity.description || entry.activity}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        entry.status === 'approved' ? 'default' : 
                        entry.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {entry.status || 'pending'}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditEntry(entry)}
                      disabled={entry.status === 'approved'}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.id)}
                      disabled={entry.status === 'approved'}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{entry.notes}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                {searchAndFilter.searchTerm || searchAndFilter.filters.status !== 'all' 
                  ? "No hours found" 
                  : "No hours logged yet"
                }
              </p>
              <p className="text-muted-foreground">
                {searchAndFilter.searchTerm || searchAndFilter.filters.status !== 'all'
                  ? "Try adjusting your search or filter criteria."
                  : "Start by logging your first volunteer hours!"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </PageLayout>
    </div>
  );
};

export default Hours;