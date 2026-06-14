"use client";

import { getTenantDashboard } from "@/lib/api";
import type { GetDashboardResponse } from "@/lib/dto";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<
    GetDashboardResponse["data"] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTenantDashboard()
      .then((response) => setDashboard(response.data))
      .catch((err) => setError(err?.message ?? "Failed to get dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!dashboard) return <p>No dashboard data available.</p>;

  return (
    <div>
      <h1>{dashboard.tenant.name}</h1>
      <p>Subscription: {dashboard.currentSubscriptionPlan}</p>
      <p>Total projects: {dashboard.no_of_projects}</p>
      <p>Project members: {dashboard.no_of_project_members ?? "N/A"}</p>
      <p>Project status: {dashboard.project_status ?? "Unknown"}</p>
      <p>Project progress: {dashboard.project_progress ?? 0}%</p>
      <p>Completion rate: {dashboard.project_completion_rate ?? 0}%</p>
      <p>Total tasks: {dashboard.no_of_tasks}</p>
      <p>Completed tasks: {dashboard.no_of_completed_tasks}</p>
      <p>Pending tasks: {dashboard.no_of_pending_tasks}</p>
      {dashboard.tenant.company_logo ? (
        <Image
          src={dashboard.tenant.company_logo}
          alt={`${dashboard.tenant.name} logo`}
          width={120}
        />
      ) : null}
    </div>
  );
}
