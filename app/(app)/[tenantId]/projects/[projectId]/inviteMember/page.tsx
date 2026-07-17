"use client";

import { inviteMember } from "@/lib/api";
import { getSession, type Session } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function InviteMemberPage() {
  const [session, setSession] = useState<Session | null>(() => getSession());
  const [receiverEmail, setReceiverEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const syncSession = () => {
      setSession(getSession());
    };
    syncSession();

    window.addEventListener("storage", syncSession);

    return () => window.removeEventListener("storage", syncSession);
  }, []);

  const tenantId = session?.tenantId;

  if (!tenantId) {
    return <p>Loading session...</p>;
  }

  const handleInviteMember = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setLoading(true);

    try {
      await inviteMember(tenantId, receiverEmail);
      alert("Invitation email sent successfully");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleInviteMember}>
      {loading && <p>Loading...</p>}
      <div>
        <label htmlFor="">Receiver</label>
        <input
          type="text"
          placeholder="email"
          value={receiverEmail}
          onChange={(e) => {
            setReceiverEmail(e.target.value);
          }}
        />
      </div>
      <button type="submit">Send Invite</button>
    </form>
  );
}
