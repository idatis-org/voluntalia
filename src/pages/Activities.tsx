import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/formatDate';
import { Plus, Edit, Trash2, Loader2, Award, Filter, MoreVertical, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PageLayout } from '@/components/common/PageLayout';
import { StatsGrid } from '@/components/common/StatsGrid';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { FormModal } from '@/components/common/FormModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useActivitiesPage } from '@/hooks/pages/useActivitiesPage';
import { useProjects } from '@/hooks/project/useProjects';
import { ManageSkillsModal } from '@/components/modals/ManageSkillsModal';

export default function Activities() {
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const {
    user,
    isLoading,
    stats,
    searchAndFilter,
    createModal,
    editModal,
    confirmDialog,
    showVolunteersModal,
    form,
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleModalClose,
    handleShowVolunteers,
    logHoursModal,
    hoursForm,
    handleOpenAddHours,
    handleSubmitHours,
    isLoggingHours,
    getMyHours,
    isCoordinator,
    isProjectManager,
    isVolunteer,
    isCreating,
    isUpdating,
  } = useActivitiesPage();

  const { data: projects = [] } = useProjects();
  const projectsMap = useMemo(() => {
    const m = new Map<string, string>();
    projects.forEach((p: any) => m.set(p.id, p.name));
    return m;
  }, [projects]);

  // Refs for name inputs to focus on server-side validation errors
  const createNameRef = useRef<HTMLInputElement | null>(null);
  const editNameRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  // Compute active filters to pass to SearchFilterBar (so Clear button counts advanced filters)
  const activeFiltersSummary: string[] = [];
  if (searchAndFilter.searchTerm && searchAndFilter.searchTerm.trim().length > 0) activeFiltersSummary.push(`Search: "${searchAndFilter.searchTerm.length > 20 ? searchAndFilter.searchTerm.slice(0,20) + '…' : searchAndFilter.searchTerm}"`);
  if (searchAndFilter.filters?.project && searchAndFilter.filters.project !== 'all') {
    const p = projects.find((pr: any) => pr.id === searchAndFilter.filters.project);
    activeFiltersSummary.push(p ? `Project: ${p.name}` : 'Project');
  }
  if (searchAndFilter.filters?.status && searchAndFilter.filters.status !== 'all') {
    const s = searchAndFilter.filters.status;
    activeFiltersSummary.push(`Status: ${s}`);
  }
  if (searchAndFilter.filters?.dateFrom) activeFiltersSummary.push(`From: ${searchAndFilter.filters.dateFrom}`);
  if (searchAndFilter.filters?.dateTo) activeFiltersSummary.push(`To: ${searchAndFilter.filters.dateTo}`);
  const activeFiltersCount = activeFiltersSummary.length;

  // Prepare sorted data for both table and mobile card view
  const sortedData = useMemo(() => {
    let sorted = [...searchAndFilter.paginatedData];

    if (sortColumn) {
      sorted.sort((a: any, b: any) => {
        let aVal: any = '';
        let bVal: any = '';

        switch (sortColumn) {
          case 'title':
            aVal = a.title || '';
            bVal = b.title || '';
            break;
          case 'date':
            aVal = new Date(a.date).getTime();
            bVal = new Date(b.date).getTime();
            break;
          case 'createdBy':
            aVal = a.created_by?.name || a.createdBy?.name || '';
            bVal = b.created_by?.name || b.createdBy?.name || '';
            break;
          case 'project':
            aVal = a.project?.name || '';
            bVal = b.project?.name || '';
            break;
          case 'hours':
            aVal = a.completed_hours || a.completedHours || 0;
            bVal = b.completed_hours || b.completedHours || 0;
            break;
          case 'status':
            aVal = a.status || 'planned';
            bVal = b.status || 'planned';
            break;
        }

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
      });
    }

    return sorted;
  }, [searchAndFilter.paginatedData, sortColumn, sortDirection]);

  useEffect(() => {
    if (form.errors.name) {
      if (createModal.isOpen && createNameRef.current) {
        createNameRef.current.focus();
      }
      if (editModal.isOpen && editNameRef.current) {
        editNameRef.current.focus();
      }
    }
  }, [form.errors.name, createModal.isOpen, editModal.isOpen]);

  return (
    <PageLayout title="Activities Management" description="Manage volunteer activities and tasks">
      <StatsGrid stats={stats} columns={3} className="mb-6" />

      <SearchFilterBar
        searchTerm={searchAndFilter.searchTerm}
        onSearchChange={searchAndFilter.setSearchTerm}
        searchPlaceholder="Search activities..."
        onReset={() => searchAndFilter.resetSearch()}
        activeCount={activeFiltersCount}
        activeSummary={activeFiltersSummary}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSkillsModalOpen(true)} className="shadow-soft">
              <Award className="h-4 w-4 mr-2" />
              Manage Skills
            </Button>
            <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
            {(isCoordinator(user?.role) || isProjectManager(user?.role)) && (
              <Button onClick={() => createModal.openModal()} className="bg-gradient-primary hover:shadow-hover transition-smooth">
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            )}
          </div>
        }
        className="mb-6"
      />

      {/* Advanced Filters Panel (hidden by default) */}
      {showAdvancedFilters && (
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <Select value={searchAndFilter.filters.project || 'all'} onValueChange={(v) => searchAndFilter.setCustomFilter('project', v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select value={searchAndFilter.filters.status || 'all'} onValueChange={(v) => searchAndFilter.setCustomFilter('status', v)}>
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

              <div>
                <label className="block text-sm font-medium mb-1">From</label>
                <Input type="date" className="h-10" value={searchAndFilter.filters.dateFrom || ''} onChange={(e) => searchAndFilter.setCustomFilter('dateFrom', e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <Input type="date" className="h-10" value={searchAndFilter.filters.dateTo || ''} onChange={(e) => searchAndFilter.setCustomFilter('dateTo', e.target.value)} />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="h-10" variant="outline" onClick={() => { searchAndFilter.resetSearch(); setShowAdvancedFilters(false); }}>Clear</Button>
              <Button className="h-10" onClick={() => setShowAdvancedFilters(false)}>Apply</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
        <span>Showing {searchAndFilter.paginatedData.length > 0 ? ((searchAndFilter.currentPage - 1) * 10) + 1 : 0}-{Math.min((searchAndFilter.currentPage) * 10, searchAndFilter.totalItems)} of {searchAndFilter.totalItems} activities</span>
      </div>

      <Card className="shadow-soft border-accent/20">
        <CardHeader>
          <CardTitle>Activities List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              {/* Mobile: cards view */}
              <div className="grid gap-4 md:hidden">
                {sortedData.map((activity: any) => {
                  const status = activity.status ?? 'planned';
                  const statusClass =
                    status === 'completed'
                      ? 'bg-green-600 text-white'
                      : status === 'active'
                      ? 'bg-blue-600 text-white'
                      : status === 'cancelled'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-800';

                  return (
                    <Card key={activity.id}>
                      <CardHeader className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm font-semibold">{activity.title}</CardTitle>
                          <div className="text-xs text-muted-foreground">{formatDate(activity.date)} • {activity.project?.name || 'No project'}</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Badge className={`px-2 py-0.5 rounded-full text-xs ${statusClass}`}>{status === 'completed' ? 'Completada' : status === 'active' ? 'En curso' : status === 'cancelled' ? 'Cancelada' : 'Planificada'}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {(isCoordinator(user?.role) || isProjectManager(user?.role)) && (
                                <DropdownMenuItem onClick={() => handleEdit(activity)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem onClick={() => navigate(`/hours?activityId=${activity.id}`)}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Logs
                              </DropdownMenuItem>

                              {isVolunteer(user?.role) && (
                                <DropdownMenuItem onClick={() => handleOpenAddHours(activity)}>
                                  <Clock className="mr-2 h-4 w-4" />
                                  Add Hours
                                </DropdownMenuItem>
                              )}

                              {(isCoordinator(user?.role) || isProjectManager(user?.role)) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleDelete(activity)}>
                                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                    <span className="text-destructive">Delete</span>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Total: <span className="font-medium">{activity.completed_hours || activity.completedHours || 0}h</span></div>
                          {isVolunteer(user?.role) && (<div className="text-sm">My: <span className="font-medium">{getMyHours(activity, user?.id)}h</span></div>)}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Desktop / tablet: table view */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                <TableRow>
                  {/* Title - Siempre visible */}
                  <TableHead className="cursor-pointer hover:bg-accent/50" onClick={() => {
                    if (sortColumn === 'title') {
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortColumn('title');
                      setSortDirection('asc');
                    }
                  }}>
                    Title {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>

                  {/* Date - Siempre visible */}
                  <TableHead className="cursor-pointer hover:bg-accent/50" onClick={() => {
                    if (sortColumn === 'date') {
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortColumn('date');
                      setSortDirection('asc');
                    }
                  }}>
                    Date {sortColumn === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>

                  {/* Created By - Solo COORDINATOR y PROJECT_MANAGER */}
                  {(isCoordinator(user?.role) || isProjectManager(user?.role)) && (
                    <TableHead className="cursor-pointer hover:bg-accent/50" onClick={() => {
                      if (sortColumn === 'createdBy') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortColumn('createdBy');
                        setSortDirection('asc');
                      }
                    }}>
                      Created By {sortColumn === 'createdBy' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                  )}

                  {/* Project - Siempre visible */}
                  <TableHead className="cursor-pointer hover:bg-accent/50" onClick={() => {
                    if (sortColumn === 'project') {
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortColumn('project');
                      setSortDirection('asc');
                    }
                  }}>
                    Project {sortColumn === 'project' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>

                  {/* Total Hours - Siempre visible */}
                  <TableHead className="cursor-pointer hover:bg-accent/50" onClick={() => {
                    if (sortColumn === 'hours') {
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortColumn('hours');
                      setSortDirection('asc');
                    }
                  }}>
                    Total Hours {sortColumn === 'hours' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>

                  {/* My Hours - Solo VOLUNTEER */}
                  {isVolunteer(user?.role) && (
                    <TableHead className="cursor-pointer hover:bg-accent/50">
                      My Hours
                    </TableHead>
                  )}

                  {/* Status - Siempre visible */}
                  <TableHead className="cursor-pointer hover:bg-accent/50" onClick={() => {
                    if (sortColumn === 'status') {
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortColumn('status');
                      setSortDirection('asc');
                    }
                  }}>
                    Status {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>

                  {/* Actions */}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
                  <TableBody>
                {sortedData.map((activity: any) => {
                    const status = activity.status ?? 'planned';
                    const statusClass =
                      status === 'completed'
                        ? 'bg-green-600 text-white'
                        : status === 'active'
                        ? 'bg-blue-600 text-white'
                        : status === 'cancelled'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-800';

                    return (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <div className="font-semibold">{activity.title}</div>
                        </TableCell>
                        <TableCell className="w-32">
                          <span className="text-sm text-muted-foreground">{formatDate(activity.date)}</span>
                        </TableCell>

                        {/* Created By - Solo COORDINATOR y PROJECT_MANAGER */}
                        {(isCoordinator(user?.role) || isProjectManager(user?.role)) && (
                          <TableCell>
                            <span className="text-sm">{activity.created_by?.name || activity.createdBy?.name || 'N/A'}</span>
                          </TableCell>
                        )}

                        <TableCell>
                          <span className="text-sm">{activity.project?.name || 'No project'}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{activity.completed_hours || activity.completedHours || 0}h</Badge>
                        </TableCell>

                        {/* My Hours - Solo VOLUNTEER */}
                        {isVolunteer(user?.role) && (
                          <TableCell className="text-center">
                            <Badge variant="secondary">{getMyHours(activity, user?.id)}h</Badge>
                          </TableCell>
                        )}

                        <TableCell>
                          <Badge className={`mx-auto px-2 py-0.5 rounded-full text-xs ${statusClass}`}>
                            {status === 'completed' ? 'Completada' : status === 'active' ? 'En curso' : status === 'cancelled' ? 'Cancelada' : 'Planificada'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {(isCoordinator(user?.role) || isProjectManager(user?.role)) && (
                                  <DropdownMenuItem onClick={() => handleEdit(activity)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuItem onClick={() => navigate(`/hours?activityId=${activity.id}`)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Logs
                                </DropdownMenuItem>

                                {isVolunteer(user?.role) && (
                                  <DropdownMenuItem onClick={() => handleOpenAddHours(activity)}>
                                    <Clock className="mr-2 h-4 w-4" />
                                    Add Hours
                                  </DropdownMenuItem>
                                )}

                                {(isCoordinator(user?.role) || isProjectManager(user?.role)) && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleDelete(activity)}>
                                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                      <span className="text-destructive">Delete</span>
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
                </Table>
              </div>
            </>
              )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {searchAndFilter.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (searchAndFilter.currentPage > 1) searchAndFilter.setCurrentPage(searchAndFilter.currentPage - 1);
                  }}
                  className={searchAndFilter.currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: searchAndFilter.totalPages }, (_, i) => i + 1).map((page) => {
                const shouldShow = 
                  page === 1 || 
                  page === searchAndFilter.totalPages || 
                  (page >= searchAndFilter.currentPage - 1 && page <= searchAndFilter.currentPage + 1);
                
                if (!shouldShow) return null;
                
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        searchAndFilter.setCurrentPage(page);
                      }}
                      isActive={page === searchAndFilter.currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (searchAndFilter.currentPage < searchAndFilter.totalPages) searchAndFilter.setCurrentPage(searchAndFilter.currentPage + 1);
                  }}
                  className={searchAndFilter.currentPage === searchAndFilter.totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <FormModal
        isOpen={createModal.isOpen}
        onClose={() => {
          createModal.closeModal();
          handleModalClose();
        }}
        onSubmit={handleCreate}
        title="Create New Activity"
        submitText="Create Activity"
        isLoading={isCreating}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Activity Name *</Label>
            <Input id="name" ref={createNameRef} value={form.formData.name} onChange={(e) => form.updateField('name', e.target.value)} placeholder="Enter activity name" />
            {form.errors.name && <p className="text-sm text-destructive mt-1">{form.errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={form.formData.description} onChange={(e) => form.updateField('description', e.target.value)} placeholder="Enter activity description (optional)" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={form.formData.date || ''} onChange={(e) => form.updateField('date', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select id="status" className="mt-1 block w-full rounded-md border px-2 py-1 bg-white text-gray-900 dark:bg-slate-800 dark:text-gray-100" value={form.formData.status || 'planned'} onChange={(e) => form.updateField('status', e.target.value as any)}>
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="project">Project</Label>
              <div className="flex flex-col">
                <input list="projects-list" id="project" className="mt-1 block w-full rounded-md border px-2 py-1 bg-white text-gray-900 dark:bg-slate-800 dark:text-gray-100" value={projectsMap.get(form.formData.projectId || '') ?? ''} onChange={(e) => {
                  const name = e.target.value;
                  const found = projects.find((p: any) => p.name === name);
                  form.updateField('projectId', found ? found.id : '');
                }} placeholder="Type to search projects" />
                <datalist id="projects-list">{projects.map((p: any) => <option key={p.id} value={p.name} />)}</datalist>
              </div>
            </div>
          </div>
        </div>
      </FormModal>

      <FormModal
        isOpen={editModal.isOpen}
        onClose={() => {
          editModal.closeModal();
          handleModalClose();
        }}
        onSubmit={handleUpdate}
        title="Edit Activity"
        submitText="Update Activity"
        isLoading={isUpdating}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Activity Name *</Label>
            <Input id="edit-name" ref={editNameRef} value={form.formData.name} onChange={(e) => form.updateField('name', e.target.value)} placeholder="Enter activity name" />
            {form.errors.name && <p className="text-sm text-destructive mt-1">{form.errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea id="edit-description" value={form.formData.description} onChange={(e) => form.updateField('description', e.target.value)} placeholder="Enter activity description (optional)" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-date">Date</Label>
              <Input id="edit-date" type="date" value={form.formData.date || ''} onChange={(e) => form.updateField('date', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <select id="edit-status" className="mt-1 block w-full rounded-md border px-2 py-1 bg-white text-gray-900 dark:bg-slate-800 dark:text-gray-100" value={form.formData.status || 'planned'} onChange={(e) => form.updateField('status', e.target.value as any)}>
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="edit-project">Project</Label>
              <div className="flex flex-col">
                <input list="projects-list" id="edit-project" className="mt-1 block w-full rounded-md border px-2 py-1 bg-white text-gray-900 dark:bg-slate-800 dark:text-gray-100" value={projectsMap.get(form.formData.projectId || '') ?? ''} onChange={(e) => {
                  const name = e.target.value;
                  const found = projects.find((p: any) => p.name === name);
                  form.updateField('projectId', found ? found.id : '');
                }} placeholder="Type to search projects" />
                <datalist id="projects-list">{projects.map((p: any) => <option key={p.id} value={p.name} />)}</datalist>
              </div>
            </div>
          </div>
        </div>
      </FormModal>

      <FormModal
        onSubmit={() => {
          showVolunteersModal.closeModal();
          handleModalClose();
        }}
        isOpen={showVolunteersModal.isOpen}
        onClose={() => {
          showVolunteersModal.closeModal();
          handleModalClose();
        }}
        title={`VOLUNTEERS FOR ${showVolunteersModal.data?.title}`}
        submitText="Close"
      >
        <div className="space-y-4">
          <div className="my-6 max-w-md">
            <div className="max-h-60 overflow-y-auto">
              {showVolunteersModal.data?.volunteers.map((volunteer: any) => (
                <div key={volunteer.id} className="py-1 grid grid-cols-2 px-2 border-b last:border-0 hover:bg-accent/10">
                  <span className="text-sm text-muted-foreground">{volunteer.name}</span>
                  <Badge variant="default" className="justify-self-end cursor-pointer"><span className="text-xs text-white font-bold">{volunteer.email}</span></Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.hideDialog}
        onConfirm={confirmDialog.handleConfirm}
        isLoading={confirmDialog.isConfirming}
        title={confirmDialog.data?.title || ''}
        description={confirmDialog.data?.description || ''}
        confirmText={confirmDialog.data?.confirmText}
        cancelText={confirmDialog.data?.cancelText}
        variant={confirmDialog.data?.variant}
      />

      {/* Add Hours modal for volunteers */}
      <FormModal
        isOpen={logHoursModal.isOpen}
        onClose={() => {
          logHoursModal.closeModal();
          handleModalClose();
        }}
        onSubmit={handleSubmitHours}
        title={`Add Hours - ${logHoursModal.data?.title || ''}`}
        submitText="Log Hours"
        isLoading={isLoggingHours}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="hours-date">Date</Label>
            <Input id="hours-date" type="date" value={hoursForm.formData.date || ''} onChange={(e) => hoursForm.updateField('date', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="hours">Hours *</Label>
            <Input id="hours" value={hoursForm.formData.hours || ''} onChange={(e) => hoursForm.updateField('hours', e.target.value)} />
            {hoursForm.errors.hours && <p className="text-sm text-destructive mt-1">{hoursForm.errors.hours}</p>}
          </div>
          <div>
            <Label htmlFor="hours-desc">Description *</Label>
            <Textarea id="hours-desc" value={hoursForm.formData.description || ''} onChange={(e) => hoursForm.updateField('description', e.target.value)} rows={3} />
            {hoursForm.errors.description && <p className="text-sm text-destructive mt-1">{hoursForm.errors.description}</p>}
          </div>
        </div>
      </FormModal>

      {skillsModalOpen && <ManageSkillsModal open={skillsModalOpen} onOpenChange={setSkillsModalOpen} />}
    </PageLayout>
  );
}
