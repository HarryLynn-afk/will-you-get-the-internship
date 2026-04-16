import "./globals.css";
import Navbar from "../components/Navbar";
import { getCurrentSession } from "../utils/auth";
import { countAdminUsers } from "../utils/repository";

export const metadata = {
  title: "Will You Get the Internship?",
  description: "A chaotic tech interview quiz with AI verdicts and a public leaderboard.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  const [session, adminCount] = await Promise.all([
    getCurrentSession(),
    countAdminUsers(),
  ]);

  return (
    <html lang="en">
      <body>
        <div className="siteGlow" />
        <div className="siteShell">
          <Navbar hasAdmin={adminCount > 0} session={session} />
          {children}
        </div>
      </body>
    </html>
  );
}
