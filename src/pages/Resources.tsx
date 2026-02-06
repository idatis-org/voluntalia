import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, FileText, Download, Eye, Video, BookOpen, File, Plus, MoreHorizontal, ExternalLink, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import UploadResourceModal from "@/components/modals/UploadResourceModal";
import { useToast } from "@/hooks/use-toast";
import { useResourceCategory } from "@/hooks/resource/category/useResourceCategory";
import { useResourceType } from "@/hooks/resource/resource-type/userResourceType";
import { useResource } from "@/hooks/resource/useResource";
import { Resource } from "@/types/resource";
import useDownloadResource from "@/hooks/resource/useDownloadResource";
import { useDeleteResource } from "@/hooks/resource/useDeleteResource";
import { useAuth } from "@/contexts/AuthContext";
import { useConfirmDialog } from "@/hooks/common/useConfirmDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

const Resources = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const { data: categories = [] } = useResourceCategory();
  const { data: types = [] } = useResourceType();
  const { data: resources = [] } = useResource();
  const { mutate: download, isPending } = useDownloadResource();
  const confirmDialog = useConfirmDialog();
  const deleteResource = useDeleteResource();
  const { user } = useAuth();

  const counts = resources.reduce<Record<string, number>>((acc, r) => {
    if (r.resource_type_id) {
      acc[r.resource_type_id] = (acc[r.resource_type_id] || 0) + 1;
    }
    return acc;
  }, {});

  const formatFileSize = (bytes: number | string | undefined) => {
    if (!bytes) return 'N/A';
    const numBytes = typeof bytes === 'string' ? parseInt(bytes) : bytes;
    if (isNaN(numBytes)) return bytes;
    if (numBytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(numBytes) / Math.log(k));
    return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePreviewResource = (resource: Resource) => {
    if (!resource.storage_path) return;

    const cleaned = resource.storage_path
      .replace(/\\/g, '/')
      .replace(/^https?:\/+/, '')
      .replace(/^\/+/, '');

    const absoluteUrl = `http://${cleaned}`;

    window.open(absoluteUrl, '_blank');
  };

  const handleUploadResource = (_newResource: any) => {
    // Resources are handled by the useResource hook and the modal's internal logic
    setUploadModalOpen(false);
  };

  const handleDeleteResource = async (resource: Resource) => {
    confirmDialog.showDialog({
      title: 'Delete Resource',
      description: `Are you sure you want to delete "${resource.filename}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'destructive',
      onConfirm: async () => {
        if (resource.user_id !== user?.id) {
          toast({
            title: "Unauthorized",
            description: "You do not have permission to delete this resource.",
            variant: "destructive"
          });
          return;
        }
        try {
          await deleteResource.mutateAsync(resource.id);
          toast({
            title: "Resource Deleted",
            description: "Resource has been removed."
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete resource. Please try again.",
            variant: "destructive"
          });
        }
      },
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'document': return FileText;
      case 'video': return Video;
      case 'course': return BookOpen;
      case 'template': return File;
      default: return FileText;
    }
  };

  const getCategoryColor = (id: string | undefined) => {
    if (!id) return 'bg-gray-100 text-gray-800';
    const categoryName = categories.find(c => c.id === id)?.name.toLowerCase();
    switch (categoryName) {
      case 'education': return 'bg-blue-100 text-blue-800';
      case 'health': return 'bg-green-100 text-green-800';
      case 'legal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const parseTags = (t: string | null): string[] => {
      try {
        return t ? JSON.parse(t).map((s: string) => s.toLowerCase()) : [];
      } catch {
        return [];
      }
    };

    const matchesSearch = resource.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parseTags(resource.tags).some(tag => tag.includes(searchTerm.toLowerCase()));

    const matchesFilter = filterBy === "all" || resource.category_id === filterBy;

    return matchesSearch && matchesFilter;
  });

  const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Resources</h1>
          <p className="text-muted-foreground mt-2">Access training materials, tools, and important documents</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">{resources.length}</p>
                  <p className="text-sm text-muted-foreground">Total Resources</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Download className="h-8 w-8 text-soft-green" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">{totalDownloads}</p>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-warm-accent" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">{resources.filter(r => r.type === 'course').length}</p>
                  <p className="text-sm text-muted-foreground">Training Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Video className="h-8 w-8 text-destructive" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">{resources.filter(r => r.type === 'video').length}</p>
                  <p className="text-sm text-muted-foreground">Video Resources</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name.charAt(0).toUpperCase() + c.name.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => setUploadModalOpen(true)}
                className="bg-gradient-primary hover:shadow-hover transition-smooth"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Resource
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resources Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({filteredResources.length})</TabsTrigger>
            {types.map((t) => (
              <TabsTrigger key={t.id} value={t.name}>
                {t.name.charAt(0).toUpperCase() + t.name.slice(1).toLowerCase()} ({counts[t.id] || 0})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredResources.map((resource) => {
                const IconComponent = getTypeIcon(resource.type || 'document');
                return (
                  <Card key={resource.id} className="shadow-card hover:shadow-hover transition-smooth">
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-gradient-soft rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle className="text-lg">{resource.filename}</CardTitle>
                            <Badge variant="outline" className={getCategoryColor(resource.category_id)}>
                              {categories.find(c => c.id === resource.category_id)?.name || 'General'}
                            </Badge>
                          </div>
                          <CardDescription className="mb-3">{resource.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Format: {resource.format}</span>
                          <span>Size: {formatFileSize(resource.size)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Downloads: {resource.downloads}</span>
                          <span>Added: {new Date(resource.created_at).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {(() => {
                            try {
                              return (JSON.parse(resource.tags || '[]') as string[]).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ));
                            } catch {
                              return null;
                            }
                          })()}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1"
                            onClick={() => handlePreviewResource(resource)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => download(resource)}
                            disabled={isPending}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {isPending ? 'Downloading...' : 'Download'}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="px-2">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Share Link
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteResource(resource)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {types.map((type) => (
            <TabsContent key={type.id} value={type.name}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredResources.filter(r => r.resource_type_id === type.id).map((resource) => {
                  const IconComponent = getTypeIcon(resource.type || 'document');
                  return (
                    <Card key={resource.id} className="shadow-card hover:shadow-hover transition-smooth">
                      <CardHeader>
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-gradient-soft rounded-lg">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-lg">{resource.filename}</CardTitle>
                              <Badge variant="outline" className={getCategoryColor(resource.category_id)}>
                                {categories.find(c => c.id === resource.category_id)?.name || 'General'}
                              </Badge>
                            </div>
                            <CardDescription className="mb-3">{resource.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Format: {resource.format}</span>
                            <span>Size: {formatFileSize(resource.size)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Downloads: {resource.downloads}</span>
                            <span>Added: {new Date(resource.created_at).toLocaleDateString('es-ES')}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1"
                              onClick={() => handlePreviewResource(resource)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => download(resource)}
                              disabled={isPending}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {isPending ? 'Downloading...' : 'Download'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <UploadResourceModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUpload={handleUploadResource}
        categories={categories}
        types={types}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.hideDialog}
        onConfirm={confirmDialog.handleConfirm}
        isLoading={confirmDialog.isConfirming}
        title={confirmDialog.data?.title ?? ''}
        description={confirmDialog.data?.description ?? ''}
        confirmText={confirmDialog.data?.confirmText}
        cancelText={confirmDialog.data?.cancelText}
        variant={confirmDialog.data?.variant}
      />
    </div>
  );
};

export default Resources;