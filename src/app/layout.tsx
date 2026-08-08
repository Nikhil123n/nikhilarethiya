import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  Bangers,
  Comic_Neue,
  Inter,
  Kalam,
  Patrick_Hand,
  Patrick_Hand_SC,
  Permanent_Marker,
  Reenie_Beanie,
  Space_Grotesk,
} from "next/font/google";
import { siteConfig } from "@/data";
import "lenis/dist/lenis.css";
import "./globals.css";

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kalam",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-patrick-hand",
  display: "swap",
});

const patrickHandSc = Patrick_Hand_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-patrick-hand-sc",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-permanent-marker",
  display: "swap",
});

const bangers = Bangers({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bangers",
  display: "swap",
});

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-comic-neue",
  display: "swap",
});

const reenieBeanie = Reenie_Beanie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-reenie-beanie",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fontVariables = [
  kalam.variable,
  patrickHand.variable,
  patrickHandSc.variable,
  permanentMarker.variable,
  bangers.variable,
  comicNeue.variable,
  reenieBeanie.variable,
  spaceGrotesk.variable,
  inter.variable,
].join(" ");

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FCF6EF",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-JG1Z97Y7FE" />
    </html>
  );
}
