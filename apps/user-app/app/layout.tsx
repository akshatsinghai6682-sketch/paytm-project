import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "../provider";
import { AppbarClient } from "../components/AppbarClient";

export const metadata: Metadata = {
  title: "PayTM Wallet",
  description: "Secure, real-time digital wallet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <Providers>
        <body className="antialiased">
          <div className="min-w-screen min-h-screen bg-[#f5f9fc]">
            <AppbarClient />
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}
