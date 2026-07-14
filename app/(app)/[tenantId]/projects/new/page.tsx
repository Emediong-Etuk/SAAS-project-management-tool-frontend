"use client";

import { createProject } from "@/lib/api";
import { getSession, saveSession, type Session } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SessionState =
  | { status: "loading" }
  | { status: "ready"; session: Session }
  | { status: "unauthenticated" };

export default function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [sessionState, setSessionState] = useState<SessionState>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let session: Session | null = null;
      try {
        session = getSession();
      } catch {
        session = null;
      }

      if (!cancelled) {
        setSessionState(
          session
            ? { status: "ready", session }
            : { status: "unauthenticated" },
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (sessionState.status === "loading") {
    return <p>Loading…</p>;
  }

  if (sessionState.status === "unauthenticated") {
    return <p>You must be logged in to create a project.</p>;
  }

  if (!sessionState.session) {
    return null;
  }

  const tenantId = sessionState.session.tenantId;

  if (!tenantId) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (!sessionState.session) {
      return null;
    }

    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await createProject(tenantId, {
        name,
        description,
        deadline,
      });
      const projectId = response.data.project.id;
      router.push(`/${tenantId}/projects/getProjects`);
      saveSession(
        sessionState.session.token || "",
        tenantId,
        projectId,
        sessionState.session.user || {},
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="deadline">Deadline:</label>
        <input
          type="date"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Project"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
