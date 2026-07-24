"use client";

import { updateProjectStatus } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function UpdateProjectStatusPage() {
  const params = useParams<{ tenantId: string; projectId: string }>();
  const router = useRouter();
  const tenantId = params?.tenantId;
  const projectId = params?.projectId;
  const [status, setStatus] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await updateProjectStatus(tenantId, projectId, status);
      alert("status updated");
      router.push(`/${tenantId}/projects/${projectId}/getProject`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cannot update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading && <p>Loading....</p>}
      {error && <p>{error}</p>}
      <div>
        <label htmlFor="">Update Status</label>
        <select name="" id="">
          <option
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          >
            active
          </option>
          <option
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          >
            completed
          </option>
          <option
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          >
            overdue
          </option>
        </select>
      </div>
      <button type="submit">Update</button>
    </form>
  );
}
