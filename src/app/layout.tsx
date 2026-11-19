import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { WindowManagerProvider } from "src/context/WindowManagerContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Joseph Anderson Cose Rojas - Portfolio",
  description: "Portfolio de Joseph Anderson Cose Rojas, Desarrollador Full Stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
      <body className="overflow-hidden antialiased">
        <WindowManagerProvider>
          {children}
        </WindowManagerProvider>
      </body>
    </html>
  );
}
