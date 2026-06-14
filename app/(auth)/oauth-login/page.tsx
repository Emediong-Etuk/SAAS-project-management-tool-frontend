"use client";

import { GITHUB_REDIRECT_URL } from "@/lib/api";
import { GOOGLE_REDIRECT_URL } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginViaGitHub() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      window.location.href = GITHUB_REDIRECT_URL;
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "couldn't signin with github",
      );
    }
  };

  return (
    <button onClick={handleLogin}>
      Login via GitHub {error && <p style={{ color: "red" }}>{error}</p>}
    </button>
  );
}

export function LoginViaGoogle() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      window.location.href = GOOGLE_REDIRECT_URL;
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "couldn't signin with github",
      );
    }
  };

  return (
    <button onClick={handleLogin}>
      Login via Google {error && <p style={{ color: "red" }}>{error}</p>}
    </button>
  );
}
