"use client";

import { useState } from "react";
import { useScene } from "@/context/SceneContext";
import SceneContainer from "./SceneContainer";

import IntroGate from "./IntroGate";
import Scene1 from "./Scene1/Scene1";
import BirthdayRoomScene from "./Scene2/BirthdayRoomScene";
import Scene3 from "./Scene3/Scene3";
import Scene4 from "./Scene4";
import Scene5 from "./Scene5/Scene5";
import Scene6 from "./Scene6/Scene6";

export default function SceneManager() {
  const { currentScene, changeScene } = useScene();
  const [hasEntered, setHasEntered] = useState(false);

  if (!hasEntered) {
    return (
      <SceneContainer>
        <IntroGate onEnter={() => setHasEntered(true)} />
      </SceneContainer>
    );
  }

  return (
    <SceneContainer>
      {currentScene === 1 && <Scene1 />}
      {currentScene === 2 && (
        <BirthdayRoomScene
          isActive={currentScene === 2}
          onComplete={() => changeScene(3)}
        />
      )}
      {currentScene === 3 && (
        <Scene3
          isActive={currentScene === 3}
          onComplete={() => changeScene(4)}
        />
      )}
      {currentScene === 4 && (
        <Scene4
          isActive={currentScene === 4}
          onComplete={() => changeScene(5)}
        />
      )}
      {currentScene === 5 && (
        <Scene5
          isActive={currentScene === 5}
          onComplete={() => changeScene(6)}
        />
      )}
      {currentScene === 6 && (
        <Scene6
          isActive={currentScene === 6}
          onComplete={() => changeScene(1)}
        />
      )}
    </SceneContainer>
  );
}