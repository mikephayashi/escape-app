"use client";

import Image from "next/image";
import { useState } from "react";
import { useUser } from "../context/UserContext";

interface UserAvatarProps {
  className?: string;
}

export default function UserAvatar({ className = "" }: UserAvatarProps) {
  const { userImage, userName, isConfirmed } = useUser();
  const [showModal, setShowModal] = useState(false);

  // Only show avatar after user confirms their identity on the island page
  if (!userImage || !isConfirmed) return null;

  return (
    <>
      <div
        className={`fixed left-3 top-3 z-50 cursor-pointer ${className}`}
        onClick={() => setShowModal(true)}
      >
        <div className="overflow-hidden rounded-full border-2 border-amber-400 bg-amber-50 shadow-lg transition-transform hover:scale-110">
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

      {/* Modal to display full image */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative animate-[scaleIn_0.2s_ease-out] rounded-2xl border-4 border-amber-400 bg-amber-50 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-amber-900 shadow-md transition-transform hover:scale-110"
            >
              ✕
            </button>
            <div className="overflow-hidden rounded-xl">
              <Image
                src={userImage}
                alt={userName ? `${userName}'s photo` : "Player photo"}
                width={256}
                height={256}
                className="h-64 w-64 object-cover"
              />
            </div>
            {userName && (
              <p className="mt-3 text-center font-bold text-amber-900">
                {userName}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
