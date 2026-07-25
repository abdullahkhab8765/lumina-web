"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface SceneContextType {
  currentScene: number;
  changeScene: (scene: number) => void;
}

const SceneContext = createContext<SceneContextType | null>(null);

export function SceneProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentScene, setCurrentScene] = useState(1);

  const changeScene = (scene: number) => {
    setCurrentScene(scene);
  };

  return (
    <SceneContext.Provider
      value={{
        currentScene,
        changeScene,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const context = useContext(SceneContext);

  if (!context) {
    throw new Error(
      "useScene must be used inside SceneProvider"
    );
  }

  return context;
}