import {
  PasswordTokenResponse,
  ResetPasswordResponse,
  VerifyEmailResponse,
} from "./dto";
import { LoginResponse } from "./dto";

const BASE = process.env.NEXT_PUBLIC_API_URL;

// Token helpers

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const getCookie = (name: string) =>
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop();
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-type": "application/json",
      "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

// Authentication

export const signup = (body: {
  name: string;
  email: string;
  password: string;
}) => request("/auth/signup", { method: "POST", body: JSON.stringify(body) });

export const verifyEmail = (body: {
  name: string;
  email: string;
  password: string;
  token: string | number;
}) =>
  request<VerifyEmailResponse>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const resendOtp = (email: string) =>
  request("/auth/signup/resend-token", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const login = (body: { email: string; password: string }) =>
  request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const logout = () => request("/auth/logout", { method: "POST" });

export const getResetPasswordToken = (email: string) =>
  request<PasswordTokenResponse>("/auth/password/reset/get-token", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const forgotPassword = (email: string) =>
  request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPassword = (body: {
  email: string;
  password: string;
  token: string | number;
}) =>
  request<ResetPasswordResponse>("/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const GOOGLE_REDIRECT_URL = `${BASE}/auth/oauth/google/redirect`;

export const GOOGLE_CALLBACK_URL = `${BASE}/auth/oauth/google/callback`;

export const GITHUB_REDIRECT_URL = `${BASE}/auth/oauth/github/redirect`;

export const GITHUB_CALLBACK_URL = `${BASE}/auth/oauth/github/callback`;

// Fetch CSRF cookie for Laravel Sanctum
export const getCsrf = () =>
  fetch(`${BASE}/sanctum/csrf-cookie`, { credentials: "include" }).then((r) => {
    if (!r.ok) throw new Error("Failed to get CSRF cookie");
    return r;
  });

//Tenancy

export const getTenantDashboard = () => request("/tenants/dashboard");

export const createTenant = (body: { name: string; plan: "free" | "pro" }) =>
  request("/tenants/create", { method: "POST", body: JSON.stringify(body) });

export const updateTenant = (
  body: Partial<{ name: string; tenantId: string }>,
) => request("/tenants/update", { method: "POST", body: JSON.stringify(body) });

export const deleteTenant = (tenantId: string) =>
  request(`/tenants/${tenantId}/delete`, { method: "DELETE" });

export const sendInvite = (tenantId: string, email: string) =>
  request(`/${tenantId}/team/members/invite`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const removeMember = (tenantId: string, userId: string) =>
  request(`/${tenantId}/team/members/${userId}/remove`, { method: "POST" });

export const uploadCompanyLogo = (tenantId: string, formData: FormData) => {
  const token = getToken();
  return fetch(`${BASE}/${tenantId}/upload-logo`, {
    method: "POST",
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  }).then((r) => r.json());
};

//Projects

export const getProjects = (tenantId: string) =>
  request(`/${tenantId}/projects`);

export const createProject = (
  tenantId: string,
  body: {
    name: string;
    description: string;
    status: string;
    deadline?: string;
  },
) =>
  request(`/${tenantId}/projects/`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getProject = (tenantId: string, projectId: string) =>
  request(`/${tenantId}/projects/${projectId}`);

export const updateProject = (
  tenantId: string,
  projectId: string,
  body: Partial<{
    name: string;
    description: string;
    status: string;
    deadline: string;
  }>,
) =>
  request(`/${tenantId}/projects/${projectId}`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const deleteProject = (tenantId: string, projectId: string) =>
  request(`/${tenantId}/projects/${projectId}`, { method: "DELETE" });

export const inviteMember = (tenantId: string, projectId: string) =>
  request(`/${tenantId}/projects/${projectId}/add`, { method: "POST" });

export const assignRole = (
  tenantId: string,
  projectId: string,
  memberId: string,
  role: string,
) =>
  request(`/${tenantId}/projects/${projectId}/${memberId}/assign-role`, {
    method: "POST",
    body: JSON.stringify({ role }),
  });

export const createMeeting = (tenantId: string, projectId: string) =>
  request(`/${tenantId}/projects/${projectId}/create-meeting`, {
    method: "POST",
  });

export const createAttendee = (tenantId: string, projectId: string) =>
  request(`/${tenantId}/projects/${projectId}/join-meeting`, {
    method: "POST",
  });

export const getMeeting = (tenantId: string, projectId: string) =>
  request(`/${tenantId}/projects/${projectId}/get-meeting`);

export const getAttendee = (tenantId: string, projectId: string) =>
  request(`/${tenantId}/projects/${projectId}/get-attendee`);

export const deleteAttendee = (tenantId: string, projectId: string) =>
  request(`/${tenantId}/projects/${projectId}/delete-attendee`, {
    method: "DELETE",
  });

export const deleteMeeting = (
  tenantId: string,
  projectId: string,
  meetingId: string,
) =>
  request(`/${tenantId}/projects/${projectId}/meetings/${meetingId}/delete`, {
    method: "DELETE",
  });

export const getListAttendees = (tenantId: string, projectId: string) =>
  request(`/${tenantId}/projects/${projectId}/list-attendee`);

export const updateProjectStatus = (
  tenantId: string,
  projectId: string,
  status: string,
) =>
  request(`/${tenantId}/projects/${projectId}/update-status`, {
    method: "POST",
    body: JSON.stringify({ status }),
  });

export const getProjectStatusList = (tenantId: string, projectId: string) =>
  request(`/${tenantId}/projects/${projectId}/status-list`);

export const searchInProject = (
  tenantId: string,
  projectId: string,
  search: string,
) =>
  request(`/${tenantId}/projects/${projectId}/search`, {
    method: "POST",
    body: JSON.stringify({ search }),
  });

// Tasks

export const getTasks = (tenantId: string, projectId: string) =>
  request(`/${tenantId}/projects/${projectId}/tasks`);

export const getSpecificTasks = (
  tenantId: string,
  projectId: string,
  taskId: string,
) => request(`/${tenantId}/projects/${projectId}/tasks/${taskId}`);

export const createTask = (
  tenantId: string,
  projectId: string,
  body: { name: string; description: string; deadline?: string },
) =>
  request(`/${tenantId}/projects/${projectId}/tasks/create`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateTask = (
  tenantId: string,
  projectId: string,
  taskId: string,
  body: Partial<{
    name: string;
    description: string;
    deadline: string;
    complete: boolean;
  }>,
) =>
  request(`/${tenantId}/projects/${projectId}/tasks/${taskId}/update`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const markComplete = (
  tenantId: string,
  projectId: string,
  taskId: string,
) =>
  request(`/${tenantId}/projects/${projectId}/tasks/${taskId}/update`, {
    method: "POST",
  });

export const submitTask = (
  tenantId: string,
  projectId: string,
  taskId: string,
) => {
  const token = getToken();
  return fetch(
    `${BASE}/${tenantId}/projects/${projectId}/tasks/${taskId}/submit`,
    {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  ).then((r) => r.json());
};

export const viewSubmissions = (
  tenantId: string,
  projectId: string,
  taskId: string,
) =>
  request(
    `/${tenantId}/projects/${projectId}/tasks/${taskId}/view-submissions`,
  );

export const viewUserSubmissions = (
  tenantId: string,
  projectId: string,
  taskId: string,
) =>
  request(
    `/${tenantId}/projects/${projectId}/tasks/${taskId}/view-user-submissions`,
  );

export const downloadFiles = (
  tenantId: string,
  projectId: string,
  taskId: string,
) =>
  request(`/${tenantId}/projects/${projectId}/tasks/${taskId}/download-files`, {
    method: "POST",
  });

export const deleteTask = (
  tenantId: string,
  projectId: string,
  taskId: string,
) =>
  request(`/${tenantId}/projects/${projectId}/tasks/${taskId}/delete`, {
    method: "DELETE",
  });

export const assignTask = (
  tenantId: string,
  projectId: string,
  taskId: string,
  userId: string,
) =>
  request(
    `/${tenantId}/projects/${projectId}/tasks/${taskId}/${userId}/assign`,
    { method: "POST" },
  );

export const searchTasks = (
  tenantId: string,
  projectId: string,
  search: string,
) =>
  request(`/${tenantId}/projects/${projectId}/tasks/search`, {
    method: "POST",
    body: JSON.stringify({ search }),
  });

export const getUsers = (
  tenantId: string,
  projectId: string,
  taskId: string,
  name: string,
) =>
  request(`/${tenantId}/projects/${projectId}/tasks/${taskId}/search-user`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const removeUserFromTask = (
  tenantId: string,
  projectId: string,
  taskId: string,
  userId: string,
) =>
  request(
    `/${tenantId}/projects/${projectId}/tasks/${taskId}/${userId}/remove-from-task`,
    { method: "POST" },
  );

export const getUsersAssignedToTask = (
  tenantId: string,
  projectId: string,
  taskId: string,
) =>
  request(
    `/${tenantId}/projects/${projectId}/tasks/${taskId}/get-users-for-task`,
  );

// Comments

export const getAllComments = (
  tenantId: string,
  projectId: string,
  taskId: string,
) => request(`/${tenantId}/projects/${projectId}/tasks/${taskId}/comments/all`);

export const getSpecificComment = (
  tenantId: string,
  projectId: string,
  taskId: string,
  commentId: string,
) =>
  request(
    `/${tenantId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
  );

export const createComment = (
  tenantId: string,
  projectId: string,
  taskId: string,
  comment: string,
) =>
  request(
    `/${tenantId}/projects/${projectId}/tasks/${taskId}/comments/create`,
    { method: "POST", body: JSON.stringify({ comment }) },
  );

export const updateComment = (
  tenantId: string,
  projectId: string,
  taskId: string,
  commentId: string,
  comment: string,
) =>
  request(
    `/${tenantId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    { method: "POST", body: JSON.stringify({ comment }) },
  );

export const deleteComment = (
  tenantId: string,
  projectId: string,
  taskId: string,
  commentId: string,
) =>
  request(
    `/${tenantId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}/delete`,
    { method: "DELETE" },
  );

export const getTeamMembers = (tenantId: string) =>
  request(`/${tenantId}/team}/members/all`);

export const acceptInvite = (inviteToken: string) =>
  request(`/accept-invitation?token=${encodeURIComponent(inviteToken)}`, {
    method: "POST",
  });

// Subscription

export const displayPlans = () => request("/subscriptions/plans");

export const createPaymentPlan = (tenantId: string) =>
  request(`/${tenantId}/subscription/payment-plan/create`, { method: "POST" });

export const getAuthModel = (
  subscriptionPlan: string,
  body: {
    full_name: string;
    email: string;
    phone_number: string;
    card_number: string;
    expiry_month: string;
    expiry_year: string;
    cvv: string;
    pin: string;
  },
) =>
  request(`/subscriptions/card/payment?subscription_plan=${subscriptionPlan}`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const cardPayment = (
  subscriptionPlan: string,
  body: {
    full_name: string;
    email: string;
    phone_number: string;
    card_number: string;
    expiry_month: string;
    expiry_year: string;
    cvv: string;
    pin: string;
  },
) =>
  request(`/subscriptions/card/payment?subscription_plan=${subscriptionPlan}`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const validateCardPayment = (otp: string, flwRef: string) =>
  request(`/subscription/card/payment/validate?flw_ref=${flwRef}`, {
    method: "POST",
    body: JSON.stringify({ otp }),
  });

export const cancelSubscription = (tenantId: string, subscriptionId: string) =>
  request(`/${tenantId}/subscription/${subscriptionId}/cancel`, {
    method: "POST",
  });

export const subscriptionStatus = (tenantId: string) =>
  request(`/${tenantId}/subscription/status`);

export const validateSubscription = () =>
  request("/flutterwave-webhook", { method: "POST" });

// Account Profile

export const viewAccount = (tenantId: string) =>
  request(`/${tenantId}/account`, { headers: { "verif-hash": "2004" } });

export const updateAccount = (tenantId: string, formData: FormData) => {
  const token = getToken();

  return fetch(`${BASE}/${tenantId}/account/update`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  }).then((r) => r.json());
};

export const deleteAccount = (tenantId: string) =>
  request(`/${tenantId}/account/update`, { method: "DELETE" });

export const verifyAccountEmail = (
  tenantId: string,
  body: { email: string; token: string | number },
) =>
  request(`/${tenantId}/account/Emediong/verify-email`, {
    method: "POST",
    body: JSON.stringify(body),
  });

// Notifications

export const viewNotifications = (tenantId: string) =>
  request(`/${tenantId}/notifications/view`);

export const unreadNotifications = (tenantId: string) =>
  request(`/${tenantId}/notifications/unread`);

export const getSpecificNoitification = (
  tenantId: string,
  notificationId: string,
) => request(`/${tenantId}/notifications/${notificationId}/get`);

export const markAsRead = (tenantId: string) =>
  request(`/${tenantId}/notifications/mark-as-read`, { method: "POST" });

export const deleteNotification = (tenantId: string, notificationId: string) =>
  request(`/${tenantId}/notifications//delete/${notificationId}`, {
    method: "DELETE",
  });

export const deleteSelectedNotifications = (tenantId: string) =>
  request(`/${tenantId}/notifications/delete-selected`, { method: "POST" });

export const deleteAllNotifications = (tenantId: string) =>
  request(`/${tenantId}/notifications/delete-all`, { method: "POST" });

// Admin

export const adminLogin = () => request("/admin/login", { method: "POST" });

export const viewAdmin = () => request("/admin/view");

export const deleteAdmin = () => request("/admin/delete", { method: "DELETE" });

export const adminDeleteUser = (name: string) => request(`/admin/user`);
