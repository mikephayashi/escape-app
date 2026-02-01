"use client";

import { useMemo } from "react";
import { useImagePreloader } from "../hooks/useImagePreloader";

interface SceneLoaderProps {
  images: string[];
  children: React.ReactNode;
  /** Optional: show a simple loading indicator while images load */
  showLoader?: boolean;
}

/**
 * Wraps a scene and preloads all images before showing content
 * Can optionally show a loading screen while images are loading
 */
export default function SceneLoader({
  images,
  children,
  showLoader = true,
}: SceneLoaderProps) {
  // Memoize the images array to prevent re-renders
  const stableImages = useMemo(() => images, [images.join(",")]);
  const { isLoading, progress } = useImagePreloader(stableImages);

  if (isLoading && showLoader) {
    return (
      <main className="screen-container game-wrapper">
        <div className="game-container flex items-center justify-center bg-[#1a1a1a]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-2 w-48 overflow-hidden rounded-full bg-[#333]">
              <div
                className="h-full bg-[#68c3a3] transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="font-fink text-lg text-[#68c3a3]">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
