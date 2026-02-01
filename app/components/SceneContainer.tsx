"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";

type SceneContainerProps = {
  /** Background image source path */
  backgroundSrc: string;
  /** Background image alt text */
  backgroundAlt?: string;
  /** 
   * Aspect ratio of the background image (width / height)
   * Common values: 
   * - 2/3 (1024x1536) for most scenes
   * - 704/1472 for living room
   * If not provided, defaults to 2/3
   */
  aspectRatio?: number;
  /** Children will be positioned relative to the background image */
  children?: React.ReactNode;
  /** Additional className for the scene container */
  className?: string;
};

/**
 * A responsive container that maintains proper positioning of items
 * relative to a background image across all screen sizes.
 * 
 * Uses JavaScript to calculate exact dimensions, ensuring positioned
 * children align correctly with the background on all devices.
 */
export default function SceneContainer({
  backgroundSrc,
  backgroundAlt = "Scene background",
  aspectRatio = 2 / 3, // Most common: 1024x1536
  children,
  className = "",
}: SceneContainerProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const calculateDimensions = useCallback(() => {
    if (!outerRef.current) return;

    const containerWidth = outerRef.current.clientWidth;
    const containerHeight = outerRef.current.clientHeight;

    // Calculate the max size that fits within the container while maintaining aspect ratio
    // aspectRatio = width / height, so height = width / aspectRatio
    
    // Try fitting by width first
    let width = containerWidth;
    let height = width / aspectRatio;

    // If height exceeds container, fit by height instead
    if (height > containerHeight) {
      height = containerHeight;
      width = height * aspectRatio;
    }

    setDimensions({ width, height });
  }, [aspectRatio]);

  useEffect(() => {
    calculateDimensions();

    // Recalculate on resize
    const handleResize = () => {
      calculateDimensions();
    };

    window.addEventListener("resize", handleResize);
    // Also listen for orientation change on mobile
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [calculateDimensions]);

  return (
    <div 
      ref={outerRef}
      className={`scene-outer ${className}`}
    >
      {dimensions && (
        <div 
          className="scene-inner"
          style={{ 
            width: dimensions.width, 
            height: dimensions.height,
          }}
        >
          {/* Background image - fills container exactly */}
          <Image
            src={backgroundSrc}
            alt={backgroundAlt}
            fill
            priority
            className="object-fill"
            sizes="100vw"
          />
          {/* Positioned items overlay */}
          <div className="absolute inset-0 z-0">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
