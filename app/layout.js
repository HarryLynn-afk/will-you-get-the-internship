import "./globals.css";

export const metadata = {
  title: "Will You Get the Internship?",
  description: "A fun tech interview quiz app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
