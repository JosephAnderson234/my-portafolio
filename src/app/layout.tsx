import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joseph Cosa - Portfolio",
  description: "Portfolio of Joseph Cosa, a web developer and designer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
