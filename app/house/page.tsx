"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BillyDialog from "../components/BillyDialog";

export default function HousePage() {
  const router = useRouter();
  const [backgroundImage, setBackgroundImage] =
    useState("/assets/scenes/house/House.png");
  // Wait for user interaction before starting typewriter to enable audio
  const [isReady, setIsReady] = useState(false);
  const [isBillyVisible, setIsBillyVisible] = useState(true);
  const [dialogText, setDialogText] = useState("Tap to continue");
  const [useTypewriter, setUseTypewriter] = useState(false);
  const [stage, setStage] = useState<"house" | "houseOpen">("house");

  const handleScreenTap = () => {
    // Handle initial tap to start the typewriter dialog with audio
    if (!isReady && stage === "house") {
      setIsReady(true);
      setDialogText("Explore the house");
      setUseTypewriter(true);
      return;
    }

    if (stage === "houseOpen") {
      router.push("/living-room");
      return;
    }

    setStage("houseOpen");
    setIsBillyVisible(false);
    setDialogText("");
    setBackgroundImage("/assets/scenes/house/House%20Open.png");
  };

  return (
    <main
      className="screen-container bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      onPointerDown={handleScreenTap}
    >
      <div className="mx-auto flex h-full w-full max-w-md flex-col items-center overflow-y-auto px-4 pt-16">
        <BillyDialog
          text={dialogText}
          characterImageVisible={isBillyVisible}
          useTypewriter={useTypewriter}
          className="mt-6 max-w-sm"
        />
      </div>
    </main>
  );
}
