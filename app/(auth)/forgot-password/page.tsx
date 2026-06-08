"use client";

import { useState } from "react";
import { getResetPasswordToken, resetPassword } from "@/lib/api";
// import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tokenSent, setTokenSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handlegetPasswordToken = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const request = await getResetPasswordToken(email);
      setMessage(request.message);
      setTokenSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send token");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const request = await resetPassword({
        email,
        password: newPassword,
        token,
      });
      setMessage(request.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <fieldset>
      {/* field to get reset token */}
      <fieldset hidden={tokenSent}>
        <form onSubmit={handlegetPasswordToken}>
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
          <button type="submit">
            {loading ? "Sending..." : "Get Reset Token"}
          </button>
          {message && <p hidden={tokenSent}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </fieldset>

      {/* field to reset the password using the token */}

      <fieldset hidden={!tokenSent}>
        <form onSubmit={handleResetPassword}>
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
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="token">Token</label>
            <input
              type="password"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            {loading ? "Sending..." : "Reset Password"}
          </button>
          {message && <p hidden={!tokenSent}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </fieldset>
    </fieldset>
  );
}
