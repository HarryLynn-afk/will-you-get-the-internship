import { redirect } from "next/navigation";
import SetupAdminForm from "../../../components/SetupAdminForm";
import { getCurrentSession } from "../../../utils/auth";
import { countAdminUsers } from "../../../utils/repository";

export const dynamic = "force-dynamic";

export default async function SetupAdminPage() {
  const session = await getCurrentSession();
  const adminCount = await countAdminUsers();

  if (adminCount > 0) {
    if (session?.role === "admin") {
      redirect("/admin");
    }

    redirect("/login");
  }

  return (
    <main className="shell shell--narrow">
      <section className="authShell">
        <SetupAdminForm />
      </section>
    </main>
  );
}
