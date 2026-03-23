import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { WindowManagerProvider } from "src/context/WindowManagerContext";

const uiFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-ui",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
    <html lang="es">
      <body className={`${uiFont.variable} ${monoFont.variable} overflow-hidden antialiased`}>
        <WindowManagerProvider>
          {children}
        </WindowManagerProvider>

      </body>
    </html>
  );
}
