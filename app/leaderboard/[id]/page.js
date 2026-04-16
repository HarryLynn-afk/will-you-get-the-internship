import LeaderboardDetailPageClient from "../../../components/LeaderboardDetailPageClient";
import { getCurrentSession } from "../../../utils/auth";

export const dynamic = "force-dynamic";

export default async function LeaderboardDetailPage({ params }) {
  const routeParams = await params;
  const session = await getCurrentSession();

  return (
    <LeaderboardDetailPageClient
      isAdmin={session?.role === "admin"}
      resultId={routeParams.id}
    />
  );
}
