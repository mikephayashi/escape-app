"use client";

import { useEffect, useState } from "react";

/**
 * Preloads images and returns loading state
 * @param imageSources Array of image URLs to preload
 * @returns Object with loading state and progress
 */
export function useImagePreloader(imageSources: string[]) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (imageSources.length === 0) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    let loaded = 0;

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (mounted) {
            loaded++;
            setLoadedCount(loaded);
          }
          resolve();
        };
        img.onerror = () => {
          // Still resolve on error to not block other images
          if (mounted) {
            loaded++;
            setLoadedCount(loaded);
          }
          resolve();
        };
        img.src = src;
      });
    };

    Promise.all(imageSources.map(preloadImage)).then(() => {
      if (mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [imageSources]);

  return {
    isLoading,
    loadedCount,
    totalCount: imageSources.length,
    progress: imageSources.length > 0 ? loadedCount / imageSources.length : 1,
  };
}

/**
 * Preloads images without blocking render (fire-and-forget)
 * Use this when you want images cached but don't need to wait
 */
export function preloadImages(imageSources: string[]) {
  imageSources.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}
