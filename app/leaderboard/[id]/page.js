import LeaderboardDetailPageClient from "../../../components/LeaderboardDetailPageClient";

export const dynamic = "force-dynamic";

export default async function LeaderboardDetailPage({ params }) {
  const routeParams = await params;
  return <LeaderboardDetailPageClient resultId={routeParams.id} />;
}
