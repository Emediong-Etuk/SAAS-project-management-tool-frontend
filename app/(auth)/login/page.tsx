"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LoginViaGitHub } from "../oauth-login/page";
import { LoginViaGoogle } from "../oauth-login/page";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login({ email, password });
      saveSession(
        response.data.token,
        response.data.tenantId,
        response.data.user,
      );
      document.cookie = `token=${response.data.token}; path=/; max-age=86400;`;
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <br />
      </form>
      <LoginViaGitHub />
      <LoginViaGoogle />
    </div>
  );
}
