"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Photo {
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  userName: string | null;
  userAvatar: string | null;
}

interface PhotoGalleryProps {
  onClose: () => void;
}

export default function PhotoGallery({ onClose }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const res = await fetch("/api/images/list?folder=user-photos");
      const data = await res.json();
      if (data.images) {
        // Sort by most recent first
        const sorted = data.images.sort(
          (a: Photo, b: Photo) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
        setPhotos(sorted);
      }
    } catch (error) {
      console.error("Failed to load photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4 max-h-[85vh] w-full max-w-lg animate-[scaleIn_0.2s_ease-out] overflow-hidden rounded-2xl bg-amber-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-amber-200 bg-amber-100 px-4 py-3">
          <h2 className="text-xl font-bold text-amber-900">📸 Photo Gallery</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-amber-900 transition-transform hover:scale-110"
          >
            ✕
          </button>
        </div>

        {/* Photo Grid */}
        <div className="overflow-y-auto p-4" style={{ maxHeight: "calc(85vh - 60px)" }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-amber-600">Loading photos...</div>
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-6xl">📷</div>
              <p className="text-amber-700">No photos yet!</p>
              <p className="mt-1 text-sm text-amber-500">
                Be the first to upload a photo
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.url}
                  className="group cursor-pointer overflow-hidden rounded-xl bg-amber-100 shadow-md transition-transform hover:scale-105"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={photo.url}
                      alt={photo.userName ? `Photo by ${photo.userName}` : "User photo"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 200px"
                    />
                  </div>
                  {/* User info and time below the image */}
                  <div className="flex items-center gap-2 bg-amber-200/80 px-2 py-1.5">
                    {photo.userAvatar && (
                      <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full border border-amber-400">
                        <Image
                          src={photo.userAvatar}
                          alt={photo.userName || "User"}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      {photo.userName && (
                        <p className="truncate text-xs font-semibold text-amber-900">
                          {photo.userName}
                        </p>
                      )}
                      <p className="text-[10px] text-amber-700">
                        {formatTime(photo.uploadedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Refresh button */}
        <div className="border-t border-amber-200 bg-amber-100 p-3">
          <button
            onClick={loadPhotos}
            className="w-full rounded-lg bg-amber-400 py-2 font-bold text-amber-900 transition-colors hover:bg-amber-300"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Full-size photo view */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -right-2 -top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-lg"
            >
              ✕
            </button>
            <Image
              src={selectedPhoto.url}
              alt={selectedPhoto.userName ? `Photo by ${selectedPhoto.userName}` : "Full size photo"}
              width={800}
              height={800}
              className="max-h-[75vh] w-auto rounded-t-lg object-contain"
            />
            {/* User info bar below the image */}
            <div className="flex items-center gap-3 rounded-b-lg bg-amber-50 px-4 py-3">
              {selectedPhoto.userAvatar && (
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-amber-400">
                  <Image
                    src={selectedPhoto.userAvatar}
                    alt={selectedPhoto.userName || "User"}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {selectedPhoto.userName && (
                  <p className="text-base font-bold text-amber-900">
                    {selectedPhoto.userName}
                  </p>
                )}
                <p className="text-sm text-amber-700">
                  {formatTime(selectedPhoto.uploadedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
