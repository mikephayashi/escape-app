import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Escape App",
  description: "An escape room adventure game",
  openGraph: {
    title: "Trichael's Joint Wedding Bday Extravaganza",
    description: "An escape room adventure game",
    images: [
      {
        url: "/assets/shared/characters/trichael-wedding.png",
        width: 1200,
        height: 630,
        alt: "Trichael's Joint Wedding Bday Extravaganza",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trichael's Joint Wedding Bday Extravaganza",
    description: "An escape room adventure game",
    images: ["/assets/shared/characters/trichael-wedding.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// All background images used across pages - preloaded to prevent flash on navigation
const PRELOAD_BACKGROUNDS = [
  "/assets/shared/backgrounds/island-background.png",
  "/assets/scenes/house/House.png",
  "/assets/scenes/house/House%20Open.png",
  "/assets/scenes/living-room/Living%20Room%20Empty.png",
  "/assets/scenes/museum/museum-outside.png",
  "/assets/scenes/museum/museum-entrance.png",
  "/assets/scenes/museum/Museum%20Empty.png",
  "/assets/scenes/speakeasy/speakeasy-entrance.png",
  "/assets/scenes/speakeasy/Speakeasy%20Empty.png",
  "/assets/scenes/speakeasy/Wood.png",
  "/assets/scenes/office/Office%20empty.png",
  "/assets/scenes/gulliver/Gulliver.png",
  "/assets/scenes/Ending/Lobby.png",
  "/assets/scenes/Ending/Plane.png",
  "/assets/scenes/Ending/Grass.png",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload all background images to prevent flash on page navigation */}
        {PRELOAD_BACKGROUNDS.map((src) => (
          <link
            key={src}
            rel="preload"
            as="image"
            href={src}
          />
        ))}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
