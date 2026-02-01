"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BillyDialog from "../components/BillyDialog";
import DialogBox from "../components/DialogBox";
import NextButton from "../components/NextButton";

export default function IslandPage() {
  const router = useRouter();
  const [isNameInputVisible, setIsNameInputVisible] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"boy" | "girl" | null>(null);
  const [stage, setStage] = useState<"intro" | "gender" | "showPlayer" | "wakeup" | "trichael" | "choices">("intro");
  const [dialogText, setDialogText] = useState(
    "Welcome to Maui, Hawaii . . . What is your name?",
  );
  const [backgroundImage] = useState(
    "/assets/shared/backgrounds/island-background.png",
  );
  const [isBillyVisible] = useState(true);

  const handleScreenTap = () => {
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

    setIsNameInputVisible(false);
    setDialogText("Are you a boy or girl?");
    setStage("gender");
  };

  const handleGenderSelect = (selectedGender: "boy" | "girl") => {
    setGender(selectedGender);
    setStage("showPlayer");
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
        {stage === "showPlayer" && gender ? (
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
            className="mt-6 max-w-sm"
            onDialogClick={handleScreenTap}
            choiceButtons={
              stage === "gender"
                ? {
                    isVisible: true,
                    primaryLabel: "Boy",
                    secondaryLabel: "Girl",
                    onPrimaryClick: () => handleGenderSelect("boy"),
                    onSecondaryClick: () => handleGenderSelect("girl"),
                  }
                : {
                    isVisible: stage === "choices",
                    primaryLabel: "House.",
                    secondaryLabel: "Stay here.",
                    onPrimaryClick: handleHouseClick,
                    onSecondaryClick: handleStayHereClick,
                  }
            }
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
