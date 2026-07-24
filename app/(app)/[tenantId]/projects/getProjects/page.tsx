"use client";

import { getProjects } from "@/lib/api";
import { getSession, type Session } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nextSession = getSession();
    const frame = window.requestAnimationFrame(() => {
      setSession(nextSession);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!session?.tenantId) {
      const frame = window.requestAnimationFrame(() => {
        setProjects([]);
        setError(null);
        setLoading(false);
      });

      return () => window.cancelAnimationFrame(frame);
    }

    let cancelled = false;

    const frame = window.requestAnimationFrame(() => {
      if (cancelled) return;
      setLoading(true);
      setError(null);
    });

    getProjects(session.tenantId)
      .then((response) => {
        if (!cancelled) {
          setProjects(response.data.projects);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? "Failed to get projects");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [session?.tenantId]);

  if (!session?.tenantId) {
    return null;
  }

  const createProject = () => {
    return router.push(`/${session?.tenantId}/projects/new`);
  };

  const handleProjectClick = (projectid: string) => {
    return router.push(
      `/${session?.tenantId}/projects/${projectid}/getProject`,
    );
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {loading && <p>Loading projects...</p>}
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <strong>{project.name}</strong>: {project.description} (Created at:{" "}
            {project.created_at}){project.status}
            <button
              type="button"
              onClick={() => handleProjectClick(project.id)}
            >
              View Project
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => createProject()}>
        Create Project
      </button>
    </div>
  );
}
