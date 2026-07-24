"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getMeeting } from "@/lib/api";
import GetAttendeePage from "../getAttendee/page";

export default function GetMeetingPage() {
  const params = useParams<{ tenantId?: string; projectId?: string }>();
  const searchParams = useSearchParams();

  const tenantId = params?.tenantId;
  const projectId = params?.projectId;
  const meetingId = searchParams.get("meeting_id");

  const [meeting, setMeeting] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMeeting = async () => {
      if (!tenantId || !projectId || !meetingId) {
        setError("Missing tenant, project, or meeting information.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getMeeting(tenantId, projectId, meetingId);
        const payload = response?.data?.meeting ?? response?.data;

        if (!payload) {
          throw new Error("Meeting not found.");
        }

        setMeeting(payload as Record<string, unknown>);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load meeting.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadMeeting();
  }, [tenantId, projectId, meetingId]);

  if (loading) {
    return <div>Loading meeting...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!meeting) {
    return <div>No meeting found.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          Meeting Details
        </h1>
        <div className="mt-4 space-y-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Meeting ID:</span>{" "}
            {String(meeting.id ?? meetingId ?? "-")}
          </p>
          <p>
            <span className="font-semibold">Tenant ID:</span>{" "}
            {String(tenantId ?? "-")}
          </p>
          <p>
            <span className="font-semibold">Project ID:</span>{" "}
            {String(projectId ?? "-")}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {String(meeting.status ?? "-")}
          </p>
          <p>
            <span className="font-semibold">Created At:</span>{" "}
            {String(meeting.created_at ?? "-")}
          </p>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <GetAttendeePage
            tenantId={tenantId}
            projectId={projectId}
            meetingId={meetingId}
          />
        </div>
      </div>
    </main>
  );
}
