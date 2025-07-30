import type { Metadata } from "next";
import { Outfit, Handlee } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const handlee = Handlee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-handlee",
});

export const metadata: Metadata = {
  title: "Evalico",
  description: "Calculate the efficiency of anything you wish for.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${handlee.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
