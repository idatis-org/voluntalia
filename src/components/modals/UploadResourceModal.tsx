import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, Upload, File, FileText, Video, BookOpen, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Resource, ResourceCategory, ResourceType } from "@/types/resource";
import { useUploadResource } from "@/hooks/resource/useUploadResource";

interface UploadResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload?: (resource: Resource) => void;
  categories: ResourceCategory[];
  types: ResourceType[];
}

const UploadResourceModal = ({ open, onOpenChange, onUpload, categories, types }: UploadResourceModalProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const uploadResourceMutation = useUploadResource();
  const [newTag, setNewTag] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    visibility: "public",
    permissions: "all"
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const extension = file.name.split('.').pop()?.toLowerCase() || "";
      setSelectedFormat(extension);

      let detectedType = types.find(t => t.name.toLowerCase() === 'document')?.id;
      if (["mp4", "avi", "mov", "wmv"].includes(extension)) {
        detectedType = types.find(t => t.name.toLowerCase() === 'video')?.id;
      } else if (["xlsx", "xls", "docx", "pptx"].includes(extension)) {
        detectedType = types.find(t => t.name.toLowerCase() === 'template')?.id;
      }

      setFormData(prev => ({
        ...prev,
        type: detectedType || prev.type,
        title: prev.title || file.name.split('.')[0]
      }));
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return File;
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (["mp4", "avi", "mov", "wmv"].includes(extension || "")) return Video;
    if (["pdf", "doc", "docx", "txt"].includes(extension || "")) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast({
        title: "File Required",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category || !formData.type) {
      toast({
        title: "Fields Required",
        description: "Please select a category and type.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    uploadResourceMutation.mutate({
      file: selectedFile,
      title: formData.title,
      description: formData.description,
      resource_type_id: formData.type,
      category_id: formData.category,
      format: selectedFormat.toUpperCase(),
      size: String(selectedFile.size),
      type: types.find(t => t.id === formData.type)?.name || "document",
      tags: tags,
      visibility: formData.visibility,
      permissions: formData.permissions
    }, {
      onSuccess: () => {
        toast({
          title: "Resource Uploaded Successfully",
          description: `Resource has been uploaded and is now available.`,
        });
        onOpenChange(false);
        resetForm();
      },
      onError: (err) => {
        console.error('[UploadResourceModal] Error:', err);
        toast({
          title: "Upload Failed",
          description: "Failed to upload resource. Please try again.",
          variant: "destructive",
        });
      },
      onSettled: () => {
        setIsLoading(false);
        setUploadProgress(0);
      }
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      type: "",
      visibility: "public",
      permissions: "all"
    });
    setTags([]);
    setNewTag("");
    setSelectedFile(null);
    setSelectedFormat("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const FileIcon = getFileIcon();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Resource</DialogTitle>
          <DialogDescription>
            Share a document, video, or training material with the volunteer community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>File Upload *</Label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-smooth"
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileIcon className="h-12 w-12 text-primary mx-auto" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-lg font-medium">Click to upload a file</p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, MP4, AVI, MOV
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4,.avi,.mov,.wmv,.txt"
                className="hidden"
              />
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-1">Resource Details</h3>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter resource title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this resource contains..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name.charAt(0).toUpperCase() + c.name.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Resource Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name.charAt(0).toUpperCase() + t.name.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-1">Tags & Permissions</h3>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tags..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={formData.visibility} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
                  <SelectTrigger id="visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="volunteers">Volunteers Only</SelectItem>
                    <SelectItem value="organizers">Organizers Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="permissions">Download Permissions</Label>
                <Select value={formData.permissions} onValueChange={(value) => setFormData({ ...formData, permissions: value })}>
                  <SelectTrigger id="permissions">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="registered">Registered Volunteers</SelectItem>
                    <SelectItem value="approved">Approved Volunteers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedFile} className="bg-gradient-primary">
              {isLoading ? "Uploading..." : "Upload Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadResourceModal;