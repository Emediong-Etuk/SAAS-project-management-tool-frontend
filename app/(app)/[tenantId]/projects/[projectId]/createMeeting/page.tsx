"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createMeeting } from "@/lib/api";

export default function CreateMeetingPage() {
  const params = useParams<{ tenantId?: string; projectId?: string }>();
  const router = useRouter();

  const tenantId = params?.tenantId;
  const projectId = params?.projectId;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateMeeting = async () => {
    if (!tenantId || !projectId) {
      setError("Missing tenant or project information.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await createMeeting(tenantId, projectId);
      const meetingId =
        response?.data?.meeting?.id ??
        response?.data?.meeting_id ??
        response?.data?.id;

      if (!meetingId) {
        throw new Error("Meeting ID was not returned by the server.");
      }

      setMessage("Meeting created successfully.");
      router.push(
        `/${tenantId}/projects/${projectId}/getMeeting?meeting_id=${encodeURIComponent(meetingId)}`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create meeting.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Create Meeting</h1>

        <button
          onClick={handleCreateMeeting}
          disabled={loading || !tenantId || !projectId}
          className="mt-6 rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Create Meeting"}
        </button>

        {message ? (
          <p className="mt-4 text-sm text-green-600">{message}</p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </main>
  );
}
