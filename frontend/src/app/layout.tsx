import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMC Connect",
  description: "Plateforme intelligente de matching CMC",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
