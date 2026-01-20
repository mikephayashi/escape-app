"use client";

import Image from "next/image";

export default function WordyPage() {
  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/scenes/speakeasy/Wood.png')` }}
    >
      {/* Wordy title at the top */}
      <div className="flex justify-center pt-8">
        <Image
          src="/assets/scenes/speakeasy/Wordy.png"
          alt="Wordy"
          width={300}
          height={100}
          className="h-auto w-auto max-w-[80%] object-contain"
          priority
        />
      </div>
    </main>
  );
}

