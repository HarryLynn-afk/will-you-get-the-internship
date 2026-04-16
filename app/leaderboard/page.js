"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LeaderboardCard from "../../components/LeaderboardCard";

export default function LeaderboardPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResults() {
      try {
        const response = await fetch("/api/results");

        if (!response.ok) {
          throw new Error("Could not load leaderboard.");
        }

        const data = await response.json();
        setResults(data);
      } catch (loadError) {
        setError(loadError.message || "Could not load leaderboard.");
      } finally {
        setLoading(false);
      }
    }

    void loadResults();
  }, []);

  return (
    <main className="shell">
      <section className="pageHeader leaderboardHeader">
        <div>
          <p className="eyebrowLabel">Hall of fame and shame</p>
          <h1 className="pageTitle">Leaderboard</h1>
          <p className="mutedText">
            See who got hired, who got ghosted, and who should maybe update their
            resume before trying again.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="panel statusCard">
          <h2 className="panelTitle">Loading scores...</h2>
        </div>
      ) : error ? (
        <div className="panel statusCard">
          <h2 className="panelTitle">Leaderboard unavailable</h2>
          <p className="mutedText">{error}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="panel emptyState">
          <h2 className="panelTitle">No results yet</h2>
          <p className="mutedText">
            Take the quiz once and you will become the entire leaderboard.
          </p>
          <Link className="primaryButton" href="/">
            Start the quiz
          </Link>
        </div>
      ) : (
        <div className="leaderboardGrid">
          {results.map((result, index) => (
            <Link
              key={result.id}
              className="leaderboardLink"
              href={`/leaderboard/${result.id}`}
            >
              <LeaderboardCard
                rank={index + 1}
                entryId={result.id}
                name={result.player_name}
                job_role={result.job_role}
                score={result.score}
                verdict={result.verdict}
              />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
