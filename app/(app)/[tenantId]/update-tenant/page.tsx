"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { updateTenant } from "@/lib/api";

export default function UpdateTenant() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const tenantId =
    typeof params?.tenantId === "string" ? params.tenantId : undefined;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!tenantId) {
      setError("Tenant ID is missing or invalid.");
      return;
    }

    try {
      setLoading(true);
      await updateTenant(tenantId, { name });
      setSuccess(true);
      router.push(`/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Update Tenant</h1>
      <div>
        <label htmlFor="tenant-name">Name</label>
        <input
          id="tenant-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Tenant"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>Tenant updated successfully.</p>
      )}
    </form>
  );
}
