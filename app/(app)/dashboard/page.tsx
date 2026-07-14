"use client";

import { getTenantDashboard } from "@/lib/api";
import type { GetDashboardResponse } from "@/lib/dto";
import type { User } from "@/types";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSession, type Session } from "@/lib/auth";
import { deleteTenant } from "@/lib/api";
import { removeMember } from "@/lib/api";
import UploadCompanyLogo from "../[tenantId]/upload-logo/page";

export default function Dashboard() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<
    GetDashboardResponse["data"] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [session] = useState<Session>(() => {
    try {
      return getSession();
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!session?.token) {
      router.push("/login");
      return;
    }

    if (!session.tenantId) {
      router.push("/create-tenant");
      return;
    }

    getTenantDashboard()
      .then((response) => setDashboard(response.data))
      .catch((err) => setError(err?.message ?? "Failed to get dashboard"))
      .finally(() => setLoading(false));
  }, [router, session]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!dashboard) return <p>No dashboard data available.</p>;

  const handleLogoUpdate = (newLogoUrl: string) => {
    setDashboard((prev) =>
      prev
        ? {
            ...prev,
            tenant: { ...prev.tenant, company_logo: newLogoUrl },
          }
        : prev,
    );
    // console.log("Updated logo URL:", newLogoUrl);
  };

  console.log("logo url in database:", dashboard.tenant.company_logo);

  const updateTenant = () => {
    const tenantId = session?.tenantId;
    if (!tenantId) return;
    return router.push(`/${tenantId}/update-tenant`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) {
      return;
    }

    try {
      const tenantId = session?.tenantId;
      if (!tenantId) {
        return;
      }
      await deleteTenant(tenantId);
      router.push("/create-tenant");
    } catch (error) {
      setError(error instanceof Error ? error.message : "");
      alert(`Could not delete tenant, ${{ error }}`);
    }
  };

  const sendInvite = () => {
    const tenantId = session?.tenantId;
    if (!tenantId) return;
    router.push(`/${tenantId}/sendInvite`);
  };

  function RemoveMember(name: string) {
    const session = getSession();
    if (!session) {
      return;
    }
    const tenantId = session.tenantId;

    if (!tenantId) {
      return;
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        const response = await removeMember(tenantId, name);
        alert(response.message);
      } catch (error) {
        alert(error instanceof Error ? error.message : "");
      }
    };

    return <button onClick={handleSubmit}>Remove member</button>;
  }

  const getProjects = async () => {
    router.push(`/${session?.tenantId}/projects/getProjects`);
  };

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
          height={120}
          loading="eager"
          unoptimized
        />
      ) : null}

      {dashboard.tenantUsers.map((user) => (
        <div key={user}>
          {user} {RemoveMember(user)}
        </div>
      ))}
      <button onClick={updateTenant}>Update</button>
      <p onClick={handleDelete}>Delete</p>
      <button onClick={sendInvite}>Invite member</button>
      <UploadCompanyLogo onUploadSuccess={handleLogoUpdate} />
      <button onClick={getProjects}>View Projects</button>
    </div>
  );
}
