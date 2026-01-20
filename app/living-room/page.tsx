"use client";

import Link from "next/link";

export default function LivingRoomPage() {
  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/pages/living-room/Living%20Room.png')" }}
    >
      <Link
        href="/museum"
        className="absolute bottom-6 right-6 bg-transparent px-4 py-2 text-5xl font-semibold text-white"
        style={{
          textShadow:
            "3px 3px 0 #B80B3F, -2px -2px 0 #E80E4F, 2px -2px 0 #E80E4F, -2px 2px 0 #E80E4F, 0 2px 0 #E80E4F, 2px 0 0 #E80E4F, -2px 0 0 #E80E4F, 0 -2px 0 #E80E4F",
        }}
      >
        Next
      </Link>
    </main>
  );
}

