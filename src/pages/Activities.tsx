import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { PageLayout } from "@/components/common/PageLayout";
import { StatsGrid } from "@/components/common/StatsGrid";
import { SearchFilterBar } from "@/components/common/SearchFilterBar";
import { FormModal } from "@/components/common/FormModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useActivitiesPage } from "@/hooks/pages/useActivitiesPage";

export default function Activities() {
  const {
    // Data
    isLoading,
    stats,
    
    // Search and filter
    searchAndFilter,
    
    // Modals
    createModal,
    editModal,
    confirmDialog,
    
    // Form
    form,
    
    // Actions
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleModalClose,
    
    // Loading states
    isCreating,
    isUpdating
  } = useActivitiesPage();

  return (
    <PageLayout 
      title="Activities Management" 
      description="Manage volunteer activities and tasks"
    >
      {/* Stats */}
      <StatsGrid stats={stats} columns={3} className="mb-6" />

      {/* Search and Filter */}
      <SearchFilterBar
        searchTerm={searchAndFilter.searchTerm}
        onSearchChange={searchAndFilter.setSearchTerm}
        searchPlaceholder="Search activities..."
        actions={
          <Button 
            onClick={() => createModal.openModal()}
            className="shadow-soft"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        }
        className="mb-6"
      />

      {/* Activities Table */}
      <Card className="shadow-soft border-accent/20">
        <CardHeader>
          <CardTitle>Activities List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : searchAndFilter.filteredData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchAndFilter.searchTerm ? "No activities found matching your search." : "No activities available."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchAndFilter.filteredData.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.title}</TableCell>
                    <TableCell>
                      {activity.description ? (
                        <span className="text-sm text-muted-foreground">
                          {activity.description.length > 50 
                            ? `${activity.description.substring(0, 50)}...` 
                            : activity.description
                          }
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No description</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(activity)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(activity)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Activity Modal */}
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
            <Input
              id="name"
              value={form.formData.name}
              onChange={(e) => form.updateField('name', e.target.value)}
              placeholder="Enter activity name"
            />
            {form.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.formData.description}
              onChange={(e) => form.updateField('description', e.target.value)}
              placeholder="Enter activity description (optional)"
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      {/* Edit Activity Modal */}
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
            <Input
              id="edit-name"
              value={form.formData.name}
              onChange={(e) => form.updateField('name', e.target.value)}
              placeholder="Enter activity name"
            />
            {form.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={form.formData.description}
              onChange={(e) => form.updateField('description', e.target.value)}
              placeholder="Enter activity description (optional)"
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.hideDialog}
        onConfirm={confirmDialog.handleConfirm}
        isLoading={confirmDialog.isConfirming}
        title={confirmDialog.data?.title || ""}
        description={confirmDialog.data?.description || ""}
        confirmText={confirmDialog.data?.confirmText}
        cancelText={confirmDialog.data?.cancelText}
        variant={confirmDialog.data?.variant}
      />
    </PageLayout>
  );
}