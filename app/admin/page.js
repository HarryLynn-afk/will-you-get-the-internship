import { redirect } from "next/navigation";
import AdminPageClient from "../../components/AdminPageClient";
import { requireAdminPage } from "../../utils/auth";
import { countAdminUsers } from "../../utils/repository";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const adminCount = await countAdminUsers();

  if (adminCount === 0) {
    redirect("/setup/admin");
  }

  await requireAdminPage("/admin");
  return <AdminPageClient />;
}
