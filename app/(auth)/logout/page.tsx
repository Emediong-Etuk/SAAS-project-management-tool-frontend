"use client";

import { clearSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";
import { useEffect } from "react";

export async function handleLogout() {
  await logout();
  document.cookie = "token=;path=/; max-age=0;";
  clearSession();
}

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    handleLogout();
    router.push("/login");
  }, []);
}
