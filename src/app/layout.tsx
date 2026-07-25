import type { Metadata, Viewport } from "next";
import { SceneProvider } from "../context/SceneContext";

export const metadata: Metadata = {
  title: "Aima's Birthday",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SceneProvider>
          {children}
        </SceneProvider>
      </body>
    </html>
  );
}