import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DataTableToolbar, ToolbarAction } from '@/components/common/DataTableToolbar';
import { Award, Filter, Plus } from 'lucide-react';

export interface ActivitiesFilters {
  project?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface ActivitiesToolbarProps {
  // Search
  searchTerm: string;
  onSearchChange: (value: string) => void;

  // Filters
  filters: ActivitiesFilters;
  onFilterChange: (filterName: keyof ActivitiesFilters, value: string) => void;
  onResetFilters: () => void;

  // Projects data for dropdown
  projects: Array<{ id: string; name: string }>;

  // Active filters display
  activeFilters: string[];

  // Actions
  onManageSkills: () => void;
  onAddActivity: () => void;
  canAdd: boolean;

  // Show/hide advanced filters panel
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: (show: boolean) => void;

  className?: string;
}

/**
 * Specialized toolbar for Activities page
 * 
 * Features:
 * - Search activities
 * - Advanced filters panel (project, status, date range)
 * - Manage Skills button
 * - Add Activity button
 * - Display active filters
 * - Reset all filters
 */
export const ActivitiesToolbar: React.FC<ActivitiesToolbarProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onResetFilters,
  projects,
  activeFilters,
  onManageSkills,
  onAddActivity,
  canAdd,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  className = '',
}) => {
  const leftActions: ToolbarAction[] = [
    {
      id: 'manage-skills',
      label: 'Manage Skills',
      icon: <Award className="h-4 w-4" />,
      onClick: onManageSkills,
      variant: 'outline',
    },
    {
      id: 'toggle-filters',
      label: 'Advanced Filters',
      icon: <Filter className="h-4 w-4" />,
      onClick: () => onToggleAdvancedFilters(!showAdvancedFilters),
      variant: 'outline',
    },
  ];

  const rightActions: ToolbarAction[] = canAdd
    ? [
        {
          id: 'add-activity',
          label: 'Add Activity',
          icon: <Plus className="h-4 w-4" />,
          onClick: onAddActivity,
          variant: 'default',
          className: 'bg-gradient-primary hover:shadow-hover transition-smooth',
        },
      ]
    : [];

  return (
    <div className={className}>
      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search activities..."
        activeFilters={activeFilters}
        onReset={onResetFilters}
        leftActions={leftActions}
        rightActions={rightActions}
      >
        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Project Filter */}
                <div>
                  <Label className="block text-sm font-medium mb-1">Project</Label>
                  <Select
                    value={filters.project || 'all'}
                    onValueChange={(v) => onFilterChange('project', v)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="All Projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <Label className="block text-sm font-medium mb-1">Status</Label>
                  <Select
                    value={filters.status || 'all'}
                    onValueChange={(v) => onFilterChange('status', v)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="planned">Planificada</SelectItem>
                      <SelectItem value="active">En curso</SelectItem>
                      <SelectItem value="completed">Completada</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date From Filter */}
                <div>
                  <Label className="block text-sm font-medium mb-1">From</Label>
                  <Input
                    type="date"
                    className="h-10"
                    value={filters.dateFrom || ''}
                    onChange={(e) => onFilterChange('dateFrom', e.target.value)}
                  />
                </div>

                {/* Date To Filter */}
                <div>
                  <Label className="block text-sm font-medium mb-1">To</Label>
                  <Input
                    type="date"
                    className="h-10"
                    value={filters.dateTo || ''}
                    onChange={(e) => onFilterChange('dateTo', e.target.value)}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex gap-2">
                <Button
                  className="h-10"
                  variant="outline"
                  onClick={() => {
                    onResetFilters();
                    onToggleAdvancedFilters(false);
                  }}
                >
                  Clear
                </Button>
                <Button
                  className="h-10"
                  onClick={() => onToggleAdvancedFilters(false)}
                >
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DataTableToolbar>
    </div>
  );
};

export default ActivitiesToolbar;
