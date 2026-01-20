"use client";

import NextButton from "../components/NextButton";

export default function GulliverPage() {
  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/scenes/gulliver/Gulliver.png')" }}
    >
      <NextButton href="/ending" />
    </main>
  );
}

