"use client";

import { useState } from "react";
import Image from "next/image";
import DialogBox from "../components/DialogBox";
import NextButton from "../components/NextButton";
import SceneLoader from "../components/SceneLoader";
import UserAvatar from "../components/UserAvatar";

// All images used in this scene for preloading
const SCENE_IMAGES = [
  "/assets/shared/backgrounds/island-background.png",
  "/assets/scenes/Ending/Dock.png",
  "/assets/scenes/Ending/Lobby.png",
  "/assets/scenes/Ending/Plane.png",
  "/assets/scenes/Ending/Grass.png",
  "/assets/scenes/Ending/Ticket.png",
  "/assets/scenes/Ending/Invitation.png",
  "/assets/scenes/nooks-cranny/Apple.png",
];

type Stage =
  | "apple-eat"
  | "gulliver-ticket-dialog"
  | "gulliver-ticket-show"
  | "gulliver-invitation-dialog"
  | "gulliver-invitation-show"
  | "dock"
  | "orville"
  | "plane"
  | "trichael";

export default function EndingPage() {
  const [stage, setStage] = useState<Stage>("apple-eat");

  const getBackgroundImage = () => {
    switch (stage) {
      case "apple-eat":
      case "gulliver-ticket-dialog":
      case "gulliver-ticket-show":
      case "gulliver-invitation-dialog":
      case "gulliver-invitation-show":
        return "/assets/shared/backgrounds/island-background.png";
      case "dock":
        return "/assets/scenes/Ending/Dock.png";
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
      case "apple-eat":
        setStage("gulliver-ticket-dialog");
        break;
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
        setStage("dock");
        break;
      case "dock":
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
    <SceneLoader images={SCENE_IMAGES}>
    <main
      className="screen-container relative bg-cover bg-center"
      style={{ backgroundImage: `url('${getBackgroundImage()}')` }}
    >
      <UserAvatar />
      <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center overflow-y-auto px-4">
        {showItemImage && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60">
            <div className="relative">
              <Image
                src={getItemImage()}
                alt={stage === "gulliver-ticket-show" ? "Airplane Ticket" : "Invitation"}
                width={350}
                height={350}
                className="h-auto max-h-[70vh] w-auto max-w-[90vw] object-contain drop-shadow-2xl"
                priority
              />
            </div>
            <NextButton onClick={handleDialogDismiss} isVisible={true} />
          </div>
        )}

        {stage === "apple-eat" && (
          <div className="flex flex-col items-center">
            <Image
              src="/assets/scenes/nooks-cranny/Apple.png"
              alt="Apple"
              width={176}
              height={176}
              className="h-auto max-h-44 w-auto max-w-44 object-contain"
              priority
            />
            <DialogBox
              text="Hooray! An apple. Munch. Munch. Munch. Gulp. Ahhhhhh. Much BETTER!!!!!!"
              speaker="Gulliver"
              useTypewriter={true}
              showBackground={true}
              showOverlay={false}
              className="mt-4 max-w-sm"
              onDialogClick={handleDialogDismiss}
            />
          </div>
        )}

        {showDialog && stage !== "trichael" && (
          <DialogBox
            text={getDialogText()}
            speaker={getSpeaker()}
            useTypewriter={true}
            className="mt-6 max-w-sm"
            onDialogClick={handleDialogDismiss}
          />
        )}

        {stage === "trichael" && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black">
            <video
              src="/assets/videos/Wedding_ending.mp4"
              autoPlay
              controls
              className="h-full w-full object-contain"
            />
          </div>
        )}

        {stage === "plane" && (
          <NextButton onClick={handleDialogDismiss} isVisible={true} />
        )}

        {stage === "dock" && (
          <NextButton onClick={handleDialogDismiss} isVisible={true} />
        )}
      </div>
    </main>
    </SceneLoader>
  );
}
