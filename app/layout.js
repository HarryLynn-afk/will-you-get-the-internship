import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Will You Get the Internship?",
  description: "A chaotic tech interview quiz with AI verdicts and a public leaderboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="siteGlow" />
        <div className="siteShell">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
