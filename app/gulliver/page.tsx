"use client";

import { useState, useEffect } from "react";
import DialogBox from "../components/DialogBox";
import NextButton from "../components/NextButton";

type DialogStage = "waiting" | "guh" | "mike-scold" | "help-request" | "done";

export default function GulliverPage() {
  const [stage, setStage] = useState<DialogStage>("waiting");

  // Wait 1 second then show first dialog
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage("guh");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleHelpGulliver = () => {
    setStage("help-request");
  };

  const handleLetHimDie = () => {
    setStage("mike-scold");
  };

  const handleMikeDismiss = () => {
    setStage("help-request");
  };

  const handleHelpRequestDismiss = () => {
    setStage("done");
  };

  const getSpeaker = () => {
    if (stage === "mike-scold") return "Mike";
    return "Gulliver";
  };

  const getDialogText = () => {
    switch (stage) {
      case "guh":
        return "Guh...";
      case "mike-scold":
        return "You scoundrel. Go help Gulliver";
      case "help-request":
        return "Help . . . I need food from Tom Nook's Cranny. Maybe you can get something from him";
      default:
        return "";
    }
  };

  const isDialogVisible = stage !== "waiting" && stage !== "done";
  const showChoiceButtons = stage === "guh";
  const showNextButton = stage === "done";

  return (
    <main
      className="screen-container relative bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/scenes/gulliver/Gulliver.png')" }}
    >
      <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-end overflow-y-auto px-4 pb-8">
        <DialogBox
          text={getDialogText()}
          speaker={getSpeaker()}
          isVisible={isDialogVisible}
          useTypewriter={true}
          showOverlay={isDialogVisible}
          className="max-w-sm"
          onDialogClick={
            stage === "mike-scold"
              ? handleMikeDismiss
              : stage === "help-request"
                ? handleHelpRequestDismiss
                : undefined
          }
          choiceButtons={{
            isVisible: showChoiceButtons,
            primaryLabel: "Help Gulliver",
            secondaryLabel: "Let him die",
            onPrimaryClick: handleHelpGulliver,
            onSecondaryClick: handleLetHimDie,
          }}
        />
      </div>
      <NextButton href="/nooks-cranny" isVisible={showNextButton} />
    </main>
  );
}
