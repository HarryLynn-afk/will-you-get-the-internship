"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const baseNavItems = [
  { href: "/", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
];

function isActive(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar({ session, hasAdmin }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.push("/");
      router.refresh();
      setLoggingOut(false);
    }
  }

  const navItems = session?.role === "admin"
    ? [...baseNavItems, { href: "/admin", label: "Admin" }]
    : baseNavItems;

  return (
    <header className="topbar">
      <div className="topbarInner">
        <Link className="navBrand" href="/">
          Will You Get the Internship?
        </Link>
        <div className="navActions">
          <nav className="navLinks" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className={`navLink ${isActive(pathname, item.href) ? "isActive" : ""}`}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {session?.role === "admin" ? (
            <button
              className="navButton"
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : hasAdmin ? (
            <Link
              className={`navButton ${isActive(pathname, "/login") ? "isActive" : ""}`}
              href="/login"
            >
              Admin Login
            </Link>
          ) : (
            <Link
              className={`navButton ${isActive(pathname, "/setup/admin") ? "isActive" : ""}`}
              href="/setup/admin"
            >
              Setup Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
