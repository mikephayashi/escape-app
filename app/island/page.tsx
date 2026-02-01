"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BillyDialog from "../components/BillyDialog";
import DialogBox from "../components/DialogBox";
import NextButton from "../components/NextButton";

// Map names to user images
const userImageMap: Record<string, string> = {
  alex: "/assets/shared/users/Alex.png",
  anastasia: "/assets/shared/users/Anastasia.png",
  brian: "/assets/shared/users/Brian.png",
  carina: "/assets/shared/users/Carina.png",
  garrett: "/assets/shared/users/Garrett.png",
  goodman: "/assets/shared/users/Goodman.png",
};

// Map names to gender
const boyNames = ["alex", "brian", "garrett", "goodman"];
const girlNames = ["carina", "anastasia"];

function getUserImage(name: string): string | null {
  const lowerName = name.toLowerCase().trim();
  return userImageMap[lowerName] || null;
}

function getGenderFromName(name: string): "boy" | "girl" | null {
  const lowerName = name.toLowerCase().trim();
  if (boyNames.includes(lowerName)) return "boy";
  if (girlNames.includes(lowerName)) return "girl";
  return null;
}

export default function IslandPage() {
  const router = useRouter();
  // Wait for user interaction before starting typewriter to enable audio
  const [isReady, setIsReady] = useState(false);
  const [useTypewriter, setUseTypewriter] = useState(false);
  const [isNameInputVisible, setIsNameInputVisible] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"boy" | "girl" | null>(null);
  const [stage, setStage] = useState<"intro" | "greeting" | "showPlayer" | "wakeup" | "trichael" | "choices">("intro");
  const [dialogText, setDialogText] = useState("Tap to continue");
  const [backgroundImage] = useState(
    "/assets/shared/backgrounds/island-background.png",
  );
  const [isBillyVisible] = useState(true);

  const handleScreenTap = () => {
    // Handle initial tap to start the typewriter dialog with audio
    if (!isReady && stage === "intro") {
      setIsReady(true);
      setDialogText("Welcome to Maui, Hawaii . . . What is your name?");
      setUseTypewriter(true);
      return;
    }

    if (stage === "wakeup") {
      setStage("trichael");
      setDialogText("Oh no! You landed on the wrong island. You have to get to Maui, so you can make it to Trichael's wedding.");
      return;
    }

    if (stage === "trichael") {
      setStage("choices");
      setDialogText("Where do you want to go?");
      return;
    }

    if (stage !== "intro") {
      return;
    }

    if (!isNameInputVisible) {
      setIsNameInputVisible(true);
      return;
    }
  };

  const submitName = () => {
    if (!name.trim()) {
      return;
    }

    // Check if name is on the guest list
    const userImage = getUserImage(name);
    if (!userImage) {
      setDialogText("You're not invited to the wedding! Let me check the list again. What's your legal first name?");
      setName("");
      return;
    }

    setIsNameInputVisible(false);
    setDialogText(`Hi ${name.trim()}!`);
    setStage("greeting");
  };

  const handleConfirmIdentity = () => {
    const detectedGender = getGenderFromName(name);
    if (detectedGender) {
      setGender(detectedGender);
    }
    setStage("showPlayer");
  };

  const handleNotMe = () => {
    setName("");
    setDialogText("Welcome to Maui, Hawaii . . . What is your name?");
    setIsNameInputVisible(true);
    setStage("intro");
  };

  const handlePlayerNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setDialogText("WAKE UP! We have to figure out where we are.");
    setStage("wakeup");
  };

  const handleNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    submitName();
  };

  const handleStayHereClick = () => {
    setDialogText('Loooool. Too bad. Choose "House."');
  };

  const handleHouseClick = () => {
    router.push("/house");
  };

  return (
    <main
      className="screen-container bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      onPointerDown={handleScreenTap}
    >
      <div className="mx-auto flex h-full w-full max-w-md flex-col items-center overflow-y-auto px-4 pt-16">
        {stage === "greeting" && getUserImage(name) ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center bg-black/60" style={{ paddingTop: "2vh" }}>
              <div className="flex flex-col items-center gap-3">
                <div className="overflow-hidden rounded-3xl border-4 border-amber-400 shadow-2xl">
                  <Image
                    src={getUserImage(name)!}
                    alt={`${name}'s photo`}
                    width={280}
                    height={280}
                    className="h-auto w-64 object-cover"
                    priority
                  />
                </div>
                <div 
                  className="rounded-2xl bg-amber-50 px-8 py-3 text-center shadow-lg"
                  style={{ fontFamily: "FinkHeavy, sans-serif" }}
                >
                  <p className="text-2xl text-amber-900">Hi {name.trim()}!</p>
                  <p className="mt-1 text-base text-amber-700">Not you? Change name.</p>
                </div>
                <div className="mt-2 flex gap-4">
                  <button
                    onClick={handleNotMe}
                    className="rounded-full bg-red-500 px-6 py-3 text-lg text-white shadow-lg transition-all hover:scale-105 hover:bg-red-400 active:scale-95"
                    style={{ fontFamily: "FinkHeavy, sans-serif" }}
                  >
                    Not me
                  </button>
                  <button
                    onClick={handleConfirmIdentity}
                    className="rounded-full bg-green-600 px-6 py-3 text-lg text-white shadow-lg transition-all hover:scale-105 hover:bg-green-500 active:scale-95"
                    style={{ fontFamily: "FinkHeavy, sans-serif" }}
                  >
                    It&apos;s me!
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : stage === "greeting" ? (
          <BillyDialog
            text={dialogText}
            characterImageVisible={isBillyVisible}
            useTypewriter={useTypewriter}
            className="mt-6 max-w-sm"
            onDialogClick={handleScreenTap}
          />
        ) : stage === "showPlayer" && gender ? (
          <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: "15vh" }}>
            <Image
              src={`/assets/shared/characters/${gender}.png`}
              alt={gender === "boy" ? "Boy character" : "Girl character"}
              width={220}
              height={220}
              className="h-auto w-44 object-contain"
              style={{ transform: "scaleX(-1)" }}
              priority
            />
          </div>
        ) : stage === "trichael" ? (
          <DialogBox
            text={dialogText}
            speaker="Trichael"
            useTypewriter={useTypewriter}
            className="mt-6 max-w-sm"
            onDialogClick={handleScreenTap}
            characterImage={{
              src: "/assets/shared/characters/Trichael.png",
              alt: "Trichael",
              width: 220,
              height: 220,
              className: "h-auto w-44 object-contain",
              isVisible: true,
              priority: true,
            }}
          />
        ) : (
          <BillyDialog
            text={dialogText}
            characterImageVisible={isBillyVisible}
            useTypewriter={useTypewriter}
            className="mt-6 max-w-sm"
            onDialogClick={handleScreenTap}
            choiceButtons={{
              isVisible: stage === "choices",
              primaryLabel: "House.",
              secondaryLabel: "Stay here.",
              onPrimaryClick: handleHouseClick,
              onSecondaryClick: handleStayHereClick,
            }}
            inputBox={{
              isVisible: isNameInputVisible,
              value: name,
              onChange: setName,
              onSubmit: submitName,
              placeholder: "Input name here...",
              label: "Name",
            }}
          />
        )}
      </div>
      <NextButton
        onClick={handleNextClick}
        isVisible={isNameInputVisible && stage === "intro"}
      />
      <NextButton
        onClick={handlePlayerNextClick}
        isVisible={stage === "showPlayer"}
      />
    </main>
  );
}
