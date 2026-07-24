"use client";

import { assignRole } from "@/lib/api";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function AssignRoles() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState<null | string>(null);
  const params = useParams<{ tenantId: string; projectId: string }>();

  const tenantId = params.tenantId;
  const projectId = params.projectId;

  const handleAssign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await assignRole(tenantId, projectId, username);
      alert(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAssign}>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div>
        <label>user</label>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>
      <button type="submit">Assign Role</button>
    </form>
  );
}
