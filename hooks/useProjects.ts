import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject, deleteProject } from "@/lib/api";

export function useProjects(tenantId: string) {
  return useQuery({
    queryKey: ["projects", tenantId],
    queryFn: () => getProjects(tenantId),
    enabled: !!tenantId,
  });
}

export function useCreateProject(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof createProject>[1]) =>
      createProject(tenantId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["projects", tenantId] }),
  });
}

export function useDeleteProject(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(tenantId, projectId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["projects", tenantId] }),
  });
}
