"use client";

import { ReactNode } from "react";

interface SceneContainerProps {
  children: ReactNode;
}

export default function SceneContainer({
  children,
}: SceneContainerProps) {
  return (
    <main
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {children}
    </main>
  );
}