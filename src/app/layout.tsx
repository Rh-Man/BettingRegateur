import type { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = {
  title: "Monitrix — Régulation des Paris Sportifs",
  description: "Plateforme de régulation et supervision des opérateurs de paris sportifs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
