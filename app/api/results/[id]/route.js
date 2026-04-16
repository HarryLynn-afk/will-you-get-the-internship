import { NextResponse } from "next/server";
import { getCurrentSession } from "../../../../utils/auth";
import {
  deleteResult,
  getResultById,
} from "../../../../utils/repository";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const routeParams = await params;
  const result = await getResultById(routeParams.id);

  if (!result) {
    return NextResponse.json({ error: "Result not found." }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function DELETE(_request, { params }) {
  const session = await getCurrentSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const routeParams = await params;
  const result = await getResultById(routeParams.id);

  if (!result) {
    return NextResponse.json({ error: "Result not found." }, { status: 404 });
  }

  await deleteResult(routeParams.id);
  return NextResponse.json({ ok: true });
}
