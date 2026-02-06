import type { Metadata } from "next";
import "./globals.css";
import { WindowManagerProvider } from "src/context/WindowManagerContext";

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
      <body className="bg-black text-white overflow-hidden">
        <WindowManagerProvider>
          {children}
        </WindowManagerProvider>

      </body>
    </html>
  );
}
