"use client";

import NextButton from "../components/NextButton";

export default function NooksCrannyPage() {
  return (
    <main
      className="screen-container relative bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/scenes/nooks-cranny/Exterior.png')" }}
    >
      <NextButton href="/nooks-cranny-inside" isVisible={true} />
    </main>
  );
}
