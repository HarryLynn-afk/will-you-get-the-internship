import { NextResponse } from "next/server";
import { createResult, listResults } from "../../../utils/repository";
import { generateVerdictAndRoast } from "../../../utils/verdict";

export const dynamic = "force-dynamic";

export async function GET() {
  const results = await listResults();
  return NextResponse.json(results);
}

export async function POST(request) {
  const body = await request.json();
  const player_name = String(body.player_name || "").trim();
  const job_role = String(body.job_role || "").trim();
  const score = Number(body.score);
  const answers_summary = body.answers_summary || [];

  if (!player_name || !job_role || !Number.isFinite(score)) {
    return NextResponse.json(
      { error: "player_name, job_role, and score are required." },
      { status: 400 },
    );
  }

  const aiResult = await generateVerdictAndRoast({
    playerName: player_name,
    jobRole: job_role,
    score,
    answersSummary: answers_summary,
  });

  const result = await createResult({
    player_name,
    job_role,
    score,
    verdict: aiResult.verdict,
    roast: aiResult.roast,
  });

  return NextResponse.json(result, { status: 201 });
}
