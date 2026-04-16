function verdictClass(verdict) {
  return `verdict-${String(verdict || "").toLowerCase()}`;
}

function rankClass(rank) {
  if (rank === 1) return "leaderboardRank leaderboardRank--gold";
  if (rank === 2) return "leaderboardRank leaderboardRank--silver";
  if (rank === 3) return "leaderboardRank leaderboardRank--bronze";
  return "leaderboardRank";
}

export default function LeaderboardCard({
  rank,
  entryId,
  name,
  job_role,
  score,
  verdict,
}) {
  return (
    <article className="leaderboardCard">
      <div className={rankClass(rank)}>{rank}</div>
      <div className="leaderboardBody">
        <div className="leaderboardNameRow">
          <h3>{name}</h3>
          <span className="leaderboardEntryTag">#{entryId}</span>
        </div>
        <p>{job_role}</p>
      </div>
      <div className="leaderboardMeta">
        <span className="leaderboardScore">{score} / 5</span>
        <span className={`verdictBadge small ${verdictClass(verdict)}`}>{verdict}</span>
      </div>
    </article>
  );
}
