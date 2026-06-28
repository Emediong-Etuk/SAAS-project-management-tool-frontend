import { uploadCompanyLogo } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadCompanyLogo({
  onUploadSuccess,
}: {
  onUploadSuccess: (url: string) => void;
}) {
  const router = useRouter();
  const [image, setImage] = useState<File | null>();
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = getSession();
    const tenant_id = session?.tenantId;

    if (!tenant_id || !image) return;

    const formdata = new FormData();
    formdata.append("logo", image);

    try {
      const response = await uploadCompanyLogo(tenant_id, formdata);
      onUploadSuccess(response.data.tenant.company_logo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={!image}>
        Upload
      </button>
    </form>
  );
}
