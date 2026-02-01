"use client";

import Image from "next/image";
import React from "react";

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
 * The background image always displays fully (no cropping), and 
 * positioned children (using PositionedItem) will align correctly
 * with the background regardless of device dimensions.
 */
export default function SceneContainer({
  backgroundSrc,
  backgroundAlt = "Scene background",
  aspectRatio = 2 / 3, // Most common: 1024x1536
  children,
  className = "",
}: SceneContainerProps) {
  return (
    <div className={`scene-outer ${className}`}>
      <div 
        className="scene-inner"
        style={{ aspectRatio: aspectRatio }}
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
    </div>
  );
}
