import { deleteTenant } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { useState } from "react";

export default function DeleteTenant() {
  const [message, setMessage] = useState("");
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
      const request = await deleteTenant(tenantId);
      setMessage(request.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "");
    } finally {
      setLoading(false);
    }

  };

  return(
    
  )
}
