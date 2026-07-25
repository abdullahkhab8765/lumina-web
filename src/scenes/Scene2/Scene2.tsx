"use client";

import { useScene } from "@/context/SceneContext";
import BirthdayRoomScene from "./BirthdayRoomScene";

/**
 * Entry point for Scene 2, mirroring the no-prop pattern used by Scene1.
 * Bridges SceneContext to BirthdayRoomScene's isActive/onComplete API:
 * the scene is only active while currentScene === 2, and "Continue"
 * advances the experience to Scene 3.
 */
export default function Scene2() {
  const { currentScene, changeScene } = useScene();

  return (
    <BirthdayRoomScene
      isActive={currentScene === 2}
      onComplete={() => changeScene(3)}
    />
  );
}