"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/admin", label: "Admin" },
];

function isActive(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <div className="topbarInner">
        <Link className="navBrand" href="/">
          Will You Get the Internship?
        </Link>
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
      </div>
    </header>
  );
}
