"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BillyDialog from "../components/BillyDialog";

export default function HousePage() {
  const router = useRouter();
  const [backgroundImage, setBackgroundImage] =
    useState("/assets/scenes/house/House.png");
  const [isBillyVisible, setIsBillyVisible] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [isPromptComplete, setIsPromptComplete] = useState(false);
  const [stage, setStage] = useState<"house" | "houseOpen">("house");

  useEffect(() => {
    setIsPromptComplete(false);
  }, [dialogText]);

  useEffect(() => {
    if (stage !== "house") {
      return;
    }

    setIsBillyVisible(true);
    setDialogText("Explore the house");
  }, [stage]);

  const handleScreenTap = () => {
    if (stage === "houseOpen") {
      router.push("/living-room");
      return;
    }

    if (!isPromptComplete) {
      return;
    }

    setStage("houseOpen");
    setIsBillyVisible(false);
    setDialogText("");
    setBackgroundImage("/assets/scenes/house/House%20Open.png");
  };

  return (
    <main
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      onPointerDown={handleScreenTap}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4 pt-16">
        <BillyDialog
          text={dialogText}
          characterImageVisible={isBillyVisible}
          className="mt-6 max-w-sm"
          onComplete={() => setIsPromptComplete(true)}
        />
      </div>
    </main>
  );
}

