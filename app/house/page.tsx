"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BillyDialog from "../components/BillyDialog";
import UserAvatar from "../components/UserAvatar";

export default function HousePage() {
  const router = useRouter();
  const [backgroundImage, setBackgroundImage] =
    useState("/assets/scenes/house/House.png");
  const [isBillyVisible, setIsBillyVisible] = useState(true);
  const [dialogText, setDialogText] = useState("Explore the house");
  const [useTypewriter, setUseTypewriter] = useState(true);
  const [stage, setStage] = useState<"house" | "houseOpen">("house");

  const handleScreenTap = () => {
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
      <UserAvatar />
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
