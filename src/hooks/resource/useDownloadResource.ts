import { useMutation, useQueryClient } from '@tanstack/react-query';
import { downloadDocument } from '@/services/resourceService'; // tu service ya hecho
import { useToast } from '@/components/ui/use-toast'; // ajusta la ruta
import { Resource } from '@/types/resource';

export default function useDownloadResource() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resource: Resource) => downloadDocument(resource.id), 
    onMutate: (resource) => {
      toast({
        title: 'Download Started',
        description: `Downloading "${resource.filename}"...`,
      });
    },
    onSuccess: (_, resource) => {
      toast({
        title: 'Download Complete',
        description: `"${resource.filename}" downloaded successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: (_, resource) => {
      toast({
        title: 'Download Failed',
        description: `Could not download "${resource.filename}".`,
        variant: 'destructive',
      });
    },
  });
}