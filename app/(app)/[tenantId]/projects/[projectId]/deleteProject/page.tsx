"use client";

import { deleteProject } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";

export default function DeleteProject() {
  const router = useRouter();
  const params = useParams<{ tenantId: string; projectId: string }>();

  const tenantId = params.tenantId;
  const projectId = params.projectId;

  const handleDelete = async () => {
    try {
      await deleteProject(tenantId, projectId);
      alert("Project deleted successfully.");
      router.push(`/${tenantId}/projects/getProjects`);
    } catch (err) {
      alert(
        `Failed to delete project: ${err instanceof Error ? err.message : ""}`,
      );
    }
  };

  return (
    <div>
      <h1>Delete Project</h1>
      <p>Are you sure you want to delete this project?</p>
      <button onClick={handleDelete}>Yes, delete</button>
      <button onClick={() => router.back()}>Cancel</button>
    </div>
  );
}
