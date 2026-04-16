import { NextResponse } from "next/server";
import {
  deleteQuestion,
  getQuestionById,
  updateQuestion,
} from "../../../../utils/repository";

export const dynamic = "force-dynamic";

function validateQuestionPayload(body) {
  const payload = {
    question: String(body.question || "").trim(),
    option_a: String(body.option_a || "").trim(),
    option_b: String(body.option_b || "").trim(),
    option_c: String(body.option_c || "").trim(),
    option_d: String(body.option_d || "").trim(),
    correct_answer: String(body.correct_answer || "")
      .trim()
      .toUpperCase(),
  };

  const isValid =
    payload.question &&
    payload.option_a &&
    payload.option_b &&
    payload.option_c &&
    payload.option_d &&
    ["A", "B", "C", "D"].includes(payload.correct_answer);

  return isValid ? payload : null;
}

export async function PUT(request, { params }) {
  const routeParams = await params;
  const body = await request.json();
  const payload = validateQuestionPayload(body);

  if (!payload) {
    return NextResponse.json(
      { error: "Please provide a full question and a valid correct answer." },
      { status: 400 },
    );
  }

  const question = await updateQuestion(routeParams.id, payload);

  if (!question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  return NextResponse.json(question);
}

export async function DELETE(_request, { params }) {
  const routeParams = await params;
  const question = await getQuestionById(routeParams.id);

  if (!question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  await deleteQuestion(routeParams.id);
  return NextResponse.json({ ok: true });
}
