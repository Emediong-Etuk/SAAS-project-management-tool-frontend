"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveSession } from "@/lib/auth";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const tenantId = searchParams.get("tenant_id");
    const user = searchParams.get("user");

    if (!token) {
      router.push("/login");
      return;
    }

    saveSession(token, tenantId ?? "", user ? JSON.parse(user) : {});
    document.cookie = `token=${token}; path=/; max-age=86400;`;
    router.push("/dashboard");
  }, []);

  return <p>Logging you in...</p>;
}
