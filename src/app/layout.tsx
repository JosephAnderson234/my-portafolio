import type { Metadata } from "next";
import "./globals.css";
import { WindowManagerProvider } from "src/context/WindowManagerContext";

export const metadata: Metadata = {
  title: "Joseph Anderson - Portfolio",
  description: "Portfolio of Joseph Anderson, a Full Stack Developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-hidden antialiased">
        <WindowManagerProvider>
          {children}
        </WindowManagerProvider>
      </body>
    </html>
  );
}
