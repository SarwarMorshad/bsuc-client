import type { Metadata } from "next";
import { Fraunces, Inter, Tiro_Bangla } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const tiroBangla = Tiro_Bangla({
  weight: "400",
  subsets: ["bengali", "latin"],
  variable: "--font-tiro-bangla",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={siteConfig.defaultLocale}
      className={`${inter.variable} ${fraunces.variable} ${tiroBangla.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
