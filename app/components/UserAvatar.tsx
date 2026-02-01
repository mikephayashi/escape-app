"use client";

import Image from "next/image";
import { useUser } from "../context/UserContext";

interface UserAvatarProps {
  className?: string;
}

export default function UserAvatar({ className = "" }: UserAvatarProps) {
  const { userImage, userName } = useUser();

  if (!userImage) return null;

  return (
    <div
      className={`pointer-events-none fixed left-3 top-3 z-50 ${className}`}
    >
      <div className="overflow-hidden rounded-full border-2 border-amber-400 bg-amber-50 shadow-lg">
        <Image
          src={userImage}
          alt={userName ? `${userName}'s avatar` : "Player avatar"}
          width={48}
          height={48}
          className="h-12 w-12 object-cover"
          priority
        />
      </div>
    </div>
  );
}

