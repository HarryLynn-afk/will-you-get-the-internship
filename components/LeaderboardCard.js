function verdictClass(verdict) {
  return `verdict-${String(verdict || "").toLowerCase()}`;
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
      <div className="leaderboardRank">{rank}</div>
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
