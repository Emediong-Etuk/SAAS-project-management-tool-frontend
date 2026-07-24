"use client";

import { updateProject } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function UpdateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const router = useRouter();
  const params = useParams<{ tenantId: string; projectId: string }>();

  const tenantId = params.tenantId;
  const projectId = params.projectId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await updateProject(tenantId, projectId, {
        name,
        description,
        status,
      });
      console.log(response);
      router.push(`/${tenantId}/projects/${projectId}/getProject`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="status">Status</label>
        <input
          id="status"
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      <button type="submit">Update</button>
    </form>
  );
}
