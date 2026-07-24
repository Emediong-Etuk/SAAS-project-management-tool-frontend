"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProject } from "@/lib/api";
import { stringify } from "querystring";

export default function ProjectPage() {
  const params = useParams<{ tenantId: string; projectId: string }>();
  const tenantId = params.tenantId;
  const projectId = params.projectId;
  const router = useRouter();
  const [project, setProject] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      status: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantId) {
      return;
    }

    if (!projectId) return;

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

  console.log(project);

  const updateProject = () => {
    router.push(`/${tenantId}/projects/${projectId}/updateProject`);
  };

  const deleteProject = () => {
    router.push(`/${tenantId}/projects/${projectId}/deleteProject`);
  };

  const assignRole = () => {
    router.push(`/${tenantId}/projects/${projectId}/assignRoles`);
  };

  const createMeeting = () => {
    router.push(`/${tenantId}/projects/${projectId}/createMeeting`);
  };

  const joinMeeting = () => {
    router.push(`/${tenantId}/projects/${projectId}/createAttendee`);
  };

  const updateStatus = () => {
    router.push(`/${tenantId}/projects/${projectId}/updateProjectStatus`);
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
          <button onClick={updateStatus}>Update Status</button>
          <button onClick={deleteProject}>Delete Project</button>
          <button onClick={assignRole}>Assign Role</button>
          <button onClick={createMeeting}>Create Meeting</button>
          <button onClick={joinMeeting}>Join Meeting</button>
        </div>
      )}
    </div>
  );
}
