import { NextResponse } from "next/server";
import {
  applySessionCookie,
  normalizeNextPath,
} from "../../../../utils/auth";
import { verifyPassword } from "../../../../utils/password";
import { getUserByEmail } from "../../../../utils/repository";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const nextPath = normalizeNextPath(body.nextPath || "/admin");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await getUserByEmail(email);

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { error: "This login is reserved for admins." },
      { status: 403 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    redirectTo: nextPath,
  });

  applySessionCookie(response, {
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return response;
}
