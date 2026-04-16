import { redirect } from "next/navigation";
import LoginForm from "../../components/LoginForm";
import { getCurrentSession, normalizeNextPath } from "../../utils/auth";
import { countAdminUsers } from "../../utils/repository";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const nextPath = normalizeNextPath(resolvedSearchParams?.next || "/admin");
  const session = await getCurrentSession();
  const adminCount = await countAdminUsers();

  if (session?.role === "admin") {
    redirect(nextPath);
  }

  if (adminCount === 0) {
    redirect("/setup/admin");
  }

  return (
    <main className="shell shell--narrow">
      <section className="authShell">
        <LoginForm nextPath={nextPath} showSetupLink={adminCount === 0} />
      </section>
    </main>
  );
}
