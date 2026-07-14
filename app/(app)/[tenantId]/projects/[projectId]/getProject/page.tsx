"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProject } from "@/lib/api";
import { getSession, type Session } from "@/lib/auth";

export default function ProjectPage() {
  const router = useRouter();
  const [project, setProject] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      status: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //   const router = useRouter();
  const [session] = useState<Session>(() => {
    try {
      return getSession();
    } catch {
      return null;
    }
  });

  const tenantId = session?.tenantId;
  const projectId = session?.projectId;

  useEffect(() => {
    if (!tenantId || !projectId) {
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      setError(null);

      try {
        const projectData = await getProject(tenantId, projectId);
        setProject([projectData.data.project]);
        console.log("Project data:", projectData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [tenantId, projectId]);

  const updateProject = () => {
    router.push(`/${tenantId}/projects/${projectId}/updateProject`);
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && project.length > 0 && (
        <div>
          <h1>Name:{project[0].name}</h1>
          <p>Description:{project[0].description}</p>
          <p>Status:{project[0].status}</p>
          <button onClick={updateProject}>Update Project</button>
        </div>
      )}
    </div>
  );
}
