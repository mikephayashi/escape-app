"use client";

import NextButton from "../components/NextButton";
import SceneLoader from "../components/SceneLoader";
import UserAvatar from "../components/UserAvatar";

// All images used in this scene for preloading
const SCENE_IMAGES = [
  "/assets/scenes/nooks-cranny/Exterior.png",
];

export default function NooksCrannyPage() {
  return (
    <SceneLoader images={SCENE_IMAGES}>
    <main
      className="screen-container relative bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/scenes/nooks-cranny/Exterior.png')" }}
    >
      <UserAvatar />
      <NextButton href="/nooks-cranny-inside" isVisible={true} />
    </main>
    </SceneLoader>
  );
}
