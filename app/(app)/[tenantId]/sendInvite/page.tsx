"use client";

import { sendInvite } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { useState } from "react";

export default function SendInvite() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = getSession();
    const tenantId = session.tenantId;

    if (!tenantId) {
      return;
    }
    try {
      setLoading(true);
      const request = await sendInvite(tenantId, email);
      setMessage(request.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="">Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <button type="submit">Send Invite</button>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
    </form>
  );
}
