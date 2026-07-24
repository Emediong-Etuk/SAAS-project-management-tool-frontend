"use client";

import { useEffect, useState } from "react";
import { getListAttendees } from "@/lib/api";

type GetAttendeePageProps = {
  tenantId?: string;
  projectId?: string;
  meetingId?: string | null;
};

export default function GetAttendeePage({
  tenantId,
  projectId,
  meetingId,
}: GetAttendeePageProps) {
  const [attendees, setAttendees] = useState<Array<Record<string, unknown>>>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAttendees = async () => {
      if (!tenantId || !projectId) {
        setError("Missing tenant or project information.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getListAttendees(
          tenantId,
          projectId,
          meetingId ?? undefined,
        );

        const data = (response as { data?: unknown }).data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as { attendees?: unknown[] })?.attendees)
            ? (data as { attendees: unknown[] }).attendees
            : Array.isArray((response as { attendees?: unknown[] }).attendees)
              ? (response as { attendees: unknown[] }).attendees
              : [];

        setAttendees(list as Array<Record<string, unknown>>);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load attendees.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAttendees();
  }, [tenantId, projectId, meetingId]);

  if (loading) {
    return (
      <div className="mt-4 text-sm text-gray-600">Loading attendees...</div>
    );
  }

  if (error) {
    return <div className="mt-4 text-sm text-red-600">Error: {error}</div>;
  }

  return (
    <section className="mt-4">
      <h2 className="text-lg font-semibold text-gray-900">Attendees</h2>

      {attendees.length === 0 ? (
        <p className="mt-2 text-sm text-gray-600">No attendees found.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {attendees.map((attendee, index) => {
            const attendeeId = String(
              attendee.id ?? attendee.meeting_id ?? attendee.user_id ?? index,
            );
            const attendeeName = String(
              attendee.name ??
                attendee.username ??
                attendee.email ??
                attendee.user?.name ??
                attendee.user?.email ??
                "Unknown attendee",
            );

            return (
              <li
                key={attendeeId}
                className="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                {attendeeName}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
