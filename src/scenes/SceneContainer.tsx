"use client";

import { ReactNode } from "react";
import styles from "./SceneContainer.module.css";

interface SceneContainerProps {
  children: ReactNode;
}

export default function SceneContainer({
  children,
}: SceneContainerProps) {
  return <main className={styles.container}>{children}</main>;
}