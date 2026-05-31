import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Painter Pitching Agent",
  description: "A local pitching tracker for bullpen sessions.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Painter Pitching Agent",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#0f3d2e",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
