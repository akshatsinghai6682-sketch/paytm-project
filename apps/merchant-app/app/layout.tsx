import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "../provider";

export const metadata: Metadata = {
  title: "PayTM Merchant Portal",
  description: "Merchant Dashboard & Payment Gateway",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <Providers>
        <body className="antialiased">{children}</body>
      </Providers>
    </html>
  );
}
