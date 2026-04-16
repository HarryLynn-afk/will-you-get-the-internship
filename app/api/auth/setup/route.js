import { NextResponse } from "next/server";
import { applySessionCookie } from "../../../../utils/auth";
import { hashPassword } from "../../../../utils/password";
import {
  countAdminUsers,
  createUser,
  getUserByEmail,
} from "../../../../utils/repository";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters long." },
      { status: 400 },
    );
  }

  const adminCount = await countAdminUsers();

  if (adminCount > 0) {
    return NextResponse.json(
      { error: "An admin account already exists." },
      { status: 409 },
    );
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return NextResponse.json(
      { error: "That email is already in use." },
      { status: 409 },
    );
  }

  const user = await createUser({
    email,
    password_hash: hashPassword(password),
    role: "admin",
  });

  const response = NextResponse.json({
    ok: true,
    redirectTo: "/admin",
  });

  applySessionCookie(response, {
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return response;
}
