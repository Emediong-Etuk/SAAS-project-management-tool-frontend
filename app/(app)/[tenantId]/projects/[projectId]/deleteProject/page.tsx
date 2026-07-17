"use client";

import { deleteProject } from "@/lib/api";
import { useEffect, useState } from "react";
import { getSession, type Session } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DeleteProject() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const syncSession = () => {
      setSession(getSession());
    };

    syncSession();
    window.addEventListener("storage", syncSession);

    return () => window.removeEventListener("storage", syncSession);
  }, []);

  const tenantId = session?.tenantId;
  const projectId = session?.projectId;

  if (!tenantId || !projectId) {
    return null;
  }

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
