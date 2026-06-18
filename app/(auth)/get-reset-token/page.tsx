"use client";
import { getResetPasswordToken } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GetPasswordResetToken() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await getResetPasswordToken(email);
      setResponse(response.message);
      router.push("/reset-password");
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form action="" onSubmit={handleSubmit}>
      <label htmlFor="">Email</label>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Get Reset Token</button>

      {loading && <p>Loading...</p>}
      {response && <p>{response}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
