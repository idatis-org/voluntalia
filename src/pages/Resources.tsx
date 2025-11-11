import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, FileText, Download, ExternalLink, BookOpen, Video, File, Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import UploadResourceModal from "@/components/modals/UploadResourceModal";
import { useToast } from "@/hooks/use-toast";
import { useResourceCategory } from "@/hooks/resource/category/useResourceCategory";
import { useResourceType } from "@/hooks/resource/resource-type/userResourceType";
import { useResource } from "@/hooks/resource/useResource";
import { Resource } from "@/types/resource";

const Resources = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { data: categories = [] } = useResourceCategory();
  const { data: types = [] } = useResourceType();
  const { data: resources = [] } = useResource();
  const [_, setResources] = useState<Resource[]>(resources);
  // const [resources, setResources] = useState([
  //   {
  //     id: 1,
  //     title: "Volunteer Handbook 2024",
  //     description: "Complete guide for new volunteers including policies, procedures, and best practices",
  //     type: "document",
  //     category: "training",
  //     format: "PDF",
  //     size: "2.3 MB",
  //     downloads: 1247,
  //     uploadDate: "2024-01-15",
  //     tags: ["handbook", "training", "policies"]
  //   },
  //   {
  //     id: 2,
  //     title: "Community Outreach Training Video",
  //     description: "Learn effective community engagement techniques and communication strategies",
  //     type: "video",
  //     category: "training",
  //     format: "MP4",
  //     size: "45.7 MB",
  //     downloads: 892,
  //     uploadDate: "2024-03-10",
  //     tags: ["video", "outreach", "communication"]
  //   },
  //   {
  //     id: 3,
  //     title: "Event Planning Checklist",
  //     description: "Step-by-step checklist for organizing successful volunteer events",
  //     type: "document",
  //     category: "tools",
  //     format: "DOC",
  //     size: "156 KB",
  //     downloads: 654,
  //     uploadDate: "2024-02-20",
  //     tags: ["checklist", "events", "planning"]
  //   },
  //   {
  //     id: 4,
  //     title: "Safety Guidelines",
  //     description: "Important safety protocols and emergency procedures for all volunteers",
  //     type: "document",
  //     category: "safety",
  //     format: "PDF",
  //     size: "1.1 MB",
  //     downloads: 1156,
  //     uploadDate: "2024-01-08",
  //     tags: ["safety", "emergency", "protocols"]
  //   },
  //   {
  //     id: 5,
  //     title: "First Aid Certification Course",
  //     description: "Online first aid training course with certification upon completion",
  //     type: "course",
  //     category: "training",
  //     format: "Online",
  //     size: "N/A",
  //     downloads: 423,
  //     uploadDate: "2024-04-01",
  //     tags: ["first aid", "certification", "course"]
  //   },
  //   {
  //     id: 6,
  //     title: "Volunteer Time Tracking Template",
  //     description: "Excel template for tracking volunteer hours and activities",
  //     type: "template",
  //     category: "tools",
  //     format: "XLSX",
  //     size: "89 KB",
  //     downloads: 789,
  //     uploadDate: "2024-03-15",
  //     tags: ["template", "tracking", "hours"]
  //   }
  // ]);

  const handleUploadResource = (newResource: Resource) => {
    setResources(prev => [...prev, newResource]);
  };

  const handleDeleteResource = (resourceId: string) => {
    setResources(prev => prev.filter(r => r.id !== resourceId));
    toast({
      title: "Resource Deleted",
      description: "The resource has been successfully removed.",
    });
  };

  const handleDownloadResource = (resource: Resource) => {
    // In real implementation, this would trigger actual download
    setResources(prev => prev.map(r => 
      r.id === resource.id 
        ? { ...r, downloads: r.downloads + 1 }
        : r
    ));
    toast({
      title: "Download Started",
      description: `Downloading "${resource.filename}"...`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'video': return Video;
      case 'course': return BookOpen;
      case 'template': return File;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'tools': return 'bg-green-100 text-green-800';
      case 'safety': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()); //|| resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterBy === "all" || resource.category === filterBy;
    
    return matchesSearch && matchesFilter;
  });

  const documents = filteredResources.filter(r => r.type === 'document');
  const videos = filteredResources.filter(r => r.type === 'video');
  const courses = filteredResources.filter(r => r.type === 'course');
  const templates = filteredResources.filter(r => r.type === 'template');

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
                  <p className="text-2xl font-bold text-foreground">5,161</p>
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
                  <p className="text-2xl font-bold text-foreground">{courses.length}</p>
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
                  <p className="text-2xl font-bold text-foreground">{videos.length}</p>
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
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
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
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
            <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
            <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
            <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredResources.map((resource) => {
                const IconComponent = getTypeIcon(resource.type);
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
                            <Badge variant="outline" className={getCategoryColor(resource.category)}>
                              {resource.category}
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
                          <span>Size: {resource.size}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Downloads: {resource.downloads}</span>
                          <span>Added: {resource.uploadDate}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {/* {resource.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))} */}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDownloadResource(resource)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Share Link
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteResource(resource.id)}
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

          <TabsContent value="documents">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {documents.map((resource) => (
                <Card key={resource.id} className="shadow-card hover:shadow-hover transition-smooth">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gradient-soft rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">{resource.filename}</CardTitle>
                          <Badge variant="outline" className={getCategoryColor(resource.category)}>
                            {resource.category}
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
                        <span>Size: {resource.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Downloads: {resource.downloads}</span>
                        <span>Added: {resource.uploadDate}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {videos.map((resource) => (
                <Card key={resource.id} className="shadow-card hover:shadow-hover transition-smooth">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gradient-soft rounded-lg">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">{resource.filename}</CardTitle>
                          <Badge variant="outline" className={getCategoryColor(resource.category)}>
                            {resource.category}
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
                        <span>Size: {resource.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Views: {resource.downloads}</span>
                        <span>Added: {resource.uploadDate}</span>
                      </div>
                      <Button size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((resource) => (
                <Card key={resource.id} className="shadow-card hover:shadow-hover transition-smooth">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gradient-soft rounded-lg">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">{resource.filename}</CardTitle>
                          <Badge variant="outline" className={getCategoryColor(resource.category)}>
                            {resource.category}
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
                        <span>Enrolled: {resource.downloads}</span>
                      </div>
                      <Button size="sm" className="w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Start Course
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {templates.map((resource) => (
                <Card key={resource.id} className="shadow-card hover:shadow-hover transition-smooth">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gradient-soft rounded-lg">
                        <File className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">{resource.filename}</CardTitle>
                          <Badge variant="outline" className={getCategoryColor(resource.category)}>
                            {resource.category}
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
                        <span>Size: {resource.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Downloads: {resource.downloads}</span>
                        <span>Added: {resource.uploadDate}</span>
                      </div>
                      <Button size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <UploadResourceModal 
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUpload={handleUploadResource}
      />
    </div>
  );
};

export default Resources;