"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function verdictClass(verdict) {
  return `verdict-${String(verdict || "").toLowerCase()}`;
}

export default function LeaderboardDetailPageClient({ resultId, isAdmin }) {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResult() {
      try {
        const response = await fetch(`/api/results/${resultId}`);

        if (!response.ok) {
          throw new Error("Could not load result detail.");
        }

        const data = await response.json();
        setResult(data);
      } catch (loadError) {
        setError(loadError.message || "Could not load result detail.");
      } finally {
        setLoading(false);
      }
    }

    void loadResult();
  }, [resultId]);

  async function handleDelete() {
    if (!window.confirm("Delete this result from the leaderboard?")) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(`/api/results/${resultId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not delete the result.");
      }

      router.push("/leaderboard");
      router.refresh();
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete the result.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="shell shell--narrow">
        <div className="panel statusCard">
          <h1 className="panelTitle">Loading result detail...</h1>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="shell shell--narrow">
        <div className="panel statusCard">
          <h1 className="panelTitle">Result unavailable</h1>
          <p className="mutedText">{error || "Result not found."}</p>
          <div className="actionRow">
            <Link className="primaryButton" href="/leaderboard">
              Back to leaderboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="shell shell--narrow">
      <Link className="tertiaryLink" href="/leaderboard">
        Back to leaderboard
      </Link>

      <article className="panel detailCard">
        <div className="detailHeader">
          <div>
            <p className="eyebrowLabel">Leaderboard detail</p>
            <h1 className="panelTitle">{result.player_name}</h1>
            <p className="mutedText">{result.job_role}</p>
          </div>
          <span className={`verdictBadge ${verdictClass(result.verdict)}`}>
            {result.verdict}
          </span>
        </div>

        <div className="detailGrid">
          <div className="detailMetric">
            <span>Score</span>
            <strong>{result.score} / 5</strong>
          </div>
          <div className="detailMetric">
            <span>Date</span>
            <strong>{new Date(result.created_at).toLocaleString()}</strong>
          </div>
        </div>

        <div className="roastBlock">
          <p className="eyebrowLabel">Recruiter note</p>
          <p className="resultRoast">{result.roast}</p>
        </div>

        <div className="actionRow">
          <Link className="secondaryButton" href="/">
            Play Again
          </Link>
          {isAdmin ? (
            <button
              className="dangerButton"
              type="button"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Result"}
            </button>
          ) : null}
        </div>
      </article>
    </main>
  );
}
