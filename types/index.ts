export interface User{
    id: string;
    name: string;
    email: string;
    tenantId: string|null;
    role:"tenant_admin" | "project_manager" | "member";
    subscription_plan: "free" | "pro";
    occupation: string|null;
    skills: string|null;
    profile_picture: string | null;
    cover_picture: string | null;
    projects_worked_on: string | null;
    linkedin_profile: string | null;
    expiry_date: string | null;
}

export interface Tenant{
    id: string;
    name: string;
    plan: "free" | "pro";
    created_at: string;
}

export interface Project{
    id: string;
    name: string;
    description: string;
    status: "pending" | "in_progress" | "completed";
    deadline: string | null;
    created_at: string;
}

export interface Task{
    id: string;
    name:string;
    description: string;
    deadline: string | null;
    complete: 0|1;
    created_at:string;
    updated_at:string;
}

export interface DashboardStats{
    no_of_projects:number;
    no_of_project_members:number;
    project_completion_rate:number;
    project_progress:number;
    no_of_tasks:number;
    no_of_completed_tasks:number;
}

export interface ApiResponse<T>{
    status:"success" | "error";
    message:"string";
    data: T;
}