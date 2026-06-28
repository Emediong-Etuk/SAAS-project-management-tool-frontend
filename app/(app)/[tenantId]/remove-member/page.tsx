import { removeMember } from "@/lib/api";
import { getSession } from "@/lib/auth";

export default function RemoveMember(name: string) {
  const session = getSession();
  if (!session) {
    return;
  }
  const tenantId = session.tenantId;

  if (!tenantId) {
    return;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await removeMember(tenantId, name);
      alert(response.message);
    } catch (error) {
      alert(error instanceof Error ? error.message : "");
    }
  };

  return <button onClick={handleSubmit}>Remove member</button>;
}
