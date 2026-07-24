"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { createAttendee } from "@/lib/api";

export default function CreateAttendeePage() {
  const params = useParams<{ tenantId?: string; projectId?: string }>();

  const tenantId = params?.tenantId;
  const projectId = params?.projectId;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateAttendee = async () => {
    if (!tenantId || !projectId) {
      setError("Missing tenant or project information.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await createAttendee(tenantId, projectId);
      setMessage("Attendee joined successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create attendee.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Join Meeting</h1>

        <button
          onClick={handleCreateAttendee}
          disabled={loading || !tenantId || !projectId}
          className="mt-6 rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
        >
          {loading ? "Joining..." : "Join Meeting"}
        </button>

        {message ? (
          <p className="mt-4 text-sm text-green-600">{message}</p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </main>
  );
}
