"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useUser } from "../context/UserContext";
import PhotoGallery from "./PhotoGallery";

interface UserAvatarProps {
  className?: string;
}

export default function UserAvatar({ className = "" }: UserAvatarProps) {
  const { userImage, userName, isConfirmed } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Only show avatar after user confirms their identity on the island page
  if (!userImage || !isConfirmed) return null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "user-photos");
      // Include username in the upload for reference
      if (userName) {
        formData.append("userName", userName);
      }

      const res = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadStatus("✅ Photo uploaded!");
        setTimeout(() => setUploadStatus(""), 2000);
      } else {
        setUploadStatus(`❌ ${data.error}`);
      }
    } catch (error) {
      setUploadStatus("❌ Upload failed");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleViewPhotos = () => {
    setShowModal(false);
    setShowGallery(true);
  };

  return (
    <>
      {/* Hidden file input for camera capture */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

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

      {/* Modal with avatar and action buttons */}
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

            {/* Status message */}
            {uploadStatus && (
              <p className="mt-2 text-center text-sm">{uploadStatus}</p>
            )}

            {/* Action buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="flex-1 rounded-xl bg-green-500 px-4 py-3 font-bold text-white shadow-md transition-all hover:bg-green-400 hover:scale-105 disabled:opacity-50"
              >
                {isUploading ? "📤 Uploading..." : "📷 Upload Image"}
              </button>
              <button
                onClick={handleViewPhotos}
                className="flex-1 rounded-xl bg-blue-500 px-4 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-400 hover:scale-105"
              >
                🖼️ View Images
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Gallery Modal */}
      {showGallery && (
        <PhotoGallery onClose={() => setShowGallery(false)} />
      )}
    </>
  );
}
