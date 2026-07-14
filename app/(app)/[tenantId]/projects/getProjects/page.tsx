"use client";

import { getProjects } from "@/lib/api";
import { getSession, type Session } from "@/lib/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GetProjects() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      status: string;
      created_at: string;
    }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [session] = useState<Session>(() => {
    try {
      return getSession();
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!session?.tenantId) return;

    getProjects(session?.tenantId)
      .then((response) => setProjects(response.data.projects))
      .catch((err) => setError(err?.message ?? "Failed to get projects"))
      .finally(() => setLoading(false));
  }, [router, session]);

  if (!session?.tenantId) {
    return null;
  }

  if (loading) return <p>Loading...</p>;

  const createProject = () => {
    return router.push(`/${session?.tenantId}/projects/new`);
  };

  const handleProjectClick = () => {
    return router.push(
      `/${session?.tenantId}/projects/${session?.projectId}/getProject`,
    );
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <strong>{project.name}</strong>: {project.description} (Created at:{" "}
            {project.created_at}){project.status}
          </li>
        ))}
        <button type="button" onClick={handleProjectClick}>
          View Project
        </button>
      </ul>
      <button type="button" onClick={createProject}>
        Create Project
      </button>
    </div>
  );
}
