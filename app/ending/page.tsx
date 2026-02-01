"use client";

import { useState } from "react";
import Image from "next/image";
import DialogBox from "../components/DialogBox";

type Stage =
  | "gulliver-ticket-dialog"
  | "gulliver-ticket-show"
  | "gulliver-invitation-dialog"
  | "gulliver-invitation-show"
  | "orville"
  | "plane"
  | "trichael";

export default function EndingPage() {
  const [stage, setStage] = useState<Stage>("gulliver-ticket-dialog");

  const getBackgroundImage = () => {
    switch (stage) {
      case "gulliver-ticket-dialog":
      case "gulliver-ticket-show":
      case "gulliver-invitation-dialog":
      case "gulliver-invitation-show":
        return "/assets/shared/backgrounds/island-background.png";
      case "orville":
        return "/assets/scenes/Ending/Lobby.png";
      case "plane":
        return "/assets/scenes/Ending/Plane.png";
      case "trichael":
        return "/assets/scenes/Ending/Grass.png";
    }
  };

  const getDialogText = () => {
    switch (stage) {
      case "gulliver-ticket-dialog":
        return "Here's something that I found on the island . . . Maybe you can use it.";
      case "gulliver-invitation-dialog":
        return "Oh.. and take this too.";
      case "orville":
        return "Hi! A one-way ticket to Maui? We're all ready to board.";
      case "trichael":
        return "You made it just in time for our wedding! Thanks for coming.";
      default:
        return "";
    }
  };

  const getSpeaker = () => {
    switch (stage) {
      case "gulliver-ticket-dialog":
      case "gulliver-invitation-dialog":
        return "Gulliver";
      case "orville":
        return "Orville";
      case "trichael":
        return "Trichael";
      default:
        return "";
    }
  };

  const handleDialogDismiss = () => {
    switch (stage) {
      case "gulliver-ticket-dialog":
        setStage("gulliver-ticket-show");
        break;
      case "gulliver-ticket-show":
        setStage("gulliver-invitation-dialog");
        break;
      case "gulliver-invitation-dialog":
        setStage("gulliver-invitation-show");
        break;
      case "gulliver-invitation-show":
        setStage("orville");
        break;
      case "orville":
        setStage("plane");
        break;
      case "plane":
        setStage("trichael");
        break;
      case "trichael":
        // Final stage - could navigate somewhere or just stay
        break;
    }
  };

  const showItemImage = stage === "gulliver-ticket-show" || stage === "gulliver-invitation-show";
  const showDialog = stage === "gulliver-ticket-dialog" || stage === "gulliver-invitation-dialog" || stage === "orville" || stage === "trichael";

  const getItemImage = () => {
    if (stage === "gulliver-ticket-show") {
      return "/assets/scenes/Ending/Ticket.png";
    }
    if (stage === "gulliver-invitation-show") {
      return "/assets/scenes/Ending/Invitation.png";
    }
    return "";
  };

  return (
    <main
      className="screen-container relative bg-cover bg-center"
      style={{ backgroundImage: `url('${getBackgroundImage()}')` }}
      onClick={stage === "plane" ? handleDialogDismiss : undefined}
    >
      <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center overflow-y-auto px-4">
        {showItemImage && (
          <div
            className="fixed inset-0 z-20 flex cursor-pointer items-center justify-center bg-black/60"
            onClick={handleDialogDismiss}
          >
            <div className="relative">
              <Image
                src={getItemImage()}
                alt={stage === "gulliver-ticket-show" ? "Airplane Ticket" : "Invitation"}
                width={350}
                height={350}
                className="h-auto max-h-[70vh] w-auto max-w-[90vw] object-contain drop-shadow-2xl"
                priority
              />
              <p className="mt-4 text-center text-lg font-semibold text-white drop-shadow-lg">
                Tap to continue
              </p>
            </div>
          </div>
        )}

        {showDialog && (
          <DialogBox
            text={getDialogText()}
            speaker={getSpeaker()}
            className="mt-6 max-w-sm"
            onDialogClick={handleDialogDismiss}
            characterImage={
              stage === "trichael"
                ? {
                    src: "/assets/shared/characters/Trichael.png",
                    alt: "Trichael",
                    width: 220,
                    height: 220,
                    className: "h-auto w-44 object-contain",
                    isVisible: true,
                    priority: true,
                  }
                : undefined
            }
          />
        )}

        {stage === "plane" && (
          <div className="fixed inset-0 z-10 flex cursor-pointer items-center justify-center">
            <p className="text-2xl font-semibold text-white drop-shadow-lg animate-pulse">
              Tap to continue...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
