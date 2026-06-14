"use client";

import { useState } from "react";
import { createTenant } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateTenantPage() {
  const [name, setName] = useState("");
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await createTenant({ name, plan });
      setSuccess(true);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Tenant</h1>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Plan:</label>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value as "free" | "pro")}
        >
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Tenant"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>Tenant created successfully!</p>
      )}
    </form>
  );
}
