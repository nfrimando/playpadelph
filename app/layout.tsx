import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Play Padel · Rankings & Calendar",
  description:
    "Official player rankings and tournament calendar for Play Padel Philippines — the home of competitive padel in the Philippines.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body className="font-body bg-oat text-ink min-h-screen">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
