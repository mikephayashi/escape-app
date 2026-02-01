"use client";

import NextButton from "../components/NextButton";
import UserAvatar from "../components/UserAvatar";

export default function NooksCrannyPage() {
  return (
    <main
      className="screen-container relative bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/scenes/nooks-cranny/Exterior.png')" }}
    >
      <UserAvatar />
      <NextButton href="/nooks-cranny-inside" isVisible={true} />
    </main>
  );
}
