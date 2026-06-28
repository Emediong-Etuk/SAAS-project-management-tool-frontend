import type { User } from "@/types";

export type VerifyEmailResponse = {
  data: {
    token: string;
    tenantId: string;
    user: object;
  };
};

export type LoginResponse = {
  data: {
    token: string;
    tenantId: string;
    user: object;
  };
};

export type PasswordTokenResponse = {
  message: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export type CreateTenantResponse = {
  status: string;
  message: string;
  data: {
    tenant: {
      id: string;
      name: string;
      plan: string;
      created_at: string;
      update_at: string;
    };
  };
};

export type GetDashboardResponse = {
  data: {
    no_of_projects: number;
    no_of_project_members: number | null;
    project_completion_rate: number | null;
    project_progress: number | null;
    project_status: string | null;
    no_of_tasks: number;
    no_of_completed_tasks: number;
    no_of_pending_tasks: number;
    tenant: {
      name: string;
      company_logo: string | null;
    };
    currentSubscriptionPlan: string;
    tenantUsers: Array<string>;
  };
};

export type DeleteTenantResponse = {
  status: string;
  message: string;
};

export type SendInvitationResponse = {
  message: string;
};

export type RemoveMemberResponse = {
  message: string;
};
