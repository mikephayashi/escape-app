 "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BillyDialog from "../components/BillyDialog";
import NextButton from "../components/NextButton";

export default function IslandPage() {
  const router = useRouter();
  const [isPromptComplete, setIsPromptComplete] = useState(false);
  const [isNameInputVisible, setIsNameInputVisible] = useState(false);
  const [name, setName] = useState("");
  const [stage, setStage] = useState<"intro" | "wakeup" | "choices">("intro");
  const [dialogText, setDialogText] = useState(
    "Welcome to Maui, Hawaii . . . What is your name?",
  );
  const [backgroundImage] = useState(
    "/assets/shared/backgrounds/island-background.png",
  );
  const [isBillyVisible] = useState(true);

  useEffect(() => {
    setIsPromptComplete(false);
  }, [dialogText]);

  const handleScreenTap = () => {
    if (!isPromptComplete) {
      return;
    }

    if (stage === "wakeup") {
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
      </div>
      <NextButton
        onClick={handleNextClick}
        isVisible={isNameInputVisible && stage === "intro"}
      />
    </main>
  );
}

