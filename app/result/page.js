"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ResultCard from "../../components/ResultCard";

function ResultPageContent() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("id");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResult() {
      if (!resultId) {
        setError("Missing result id.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/results/${resultId}`);

        if (!response.ok) {
          throw new Error("Could not load result.");
        }

        const data = await response.json();
        setResult(data);
      } catch (loadError) {
        setError(loadError.message || "Could not load result.");
      } finally {
        setLoading(false);
      }
    }

    void loadResult();
  }, [resultId]);

  if (loading) {
    return (
      <main className="shell shell--narrow">
        <div className="panel statusCard">
          <p className="eyebrowLabel">Calculating verdict</p>
          <h1 className="panelTitle">The recruiter is drafting the email.</h1>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="shell shell--narrow">
        <div className="panel statusCard">
          <p className="eyebrowLabel">Result unavailable</p>
          <h1 className="panelTitle">The verdict got lost in transit.</h1>
          <p className="mutedText">{error || "Result not found."}</p>
          <div className="actionRow">
            <Link className="primaryButton" href="/">
              Play again
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="shell shell--narrow">
      <section className="resultIntro">
        <div>
          <p className="eyebrowLabel">Interview complete</p>
          <h1 className="panelTitle">Your recruiter had thoughts.</h1>
        </div>
      </section>

      <ResultCard
        name={result.player_name}
        job_role={result.job_role}
        score={result.score}
        verdict={result.verdict}
        roast={result.roast}
      />

      <div className="actionRow">
        <Link className="primaryButton" href="/">
          Play Again
        </Link>
        <Link className="secondaryButton" href="/leaderboard">
          View Leaderboard
        </Link>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="shell shell--narrow">
          <div className="panel statusCard">
            <p className="eyebrowLabel">Calculating verdict</p>
            <h1 className="panelTitle">The recruiter is drafting the email.</h1>
          </div>
        </main>
      }
    >
      <ResultPageContent />
    </Suspense>
  );
}
