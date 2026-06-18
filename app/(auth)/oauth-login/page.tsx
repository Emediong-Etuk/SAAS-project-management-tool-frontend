"use client";

import { GITHUB_REDIRECT_URL } from "@/lib/api";
import { GOOGLE_REDIRECT_URL } from "@/lib/api";
import { useState } from "react";

export function LoginViaGitHub() {
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      window.location.href = GITHUB_REDIRECT_URL;
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

  const handleLogin = async () => {
    try {
      window.location.href = GOOGLE_REDIRECT_URL;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "couldn't signin with google",
      );
    }
  };

  return (
    <button onClick={handleLogin}>
      Login via Google {error && <p style={{ color: "red" }}>{error}</p>}
    </button>
  );
}
