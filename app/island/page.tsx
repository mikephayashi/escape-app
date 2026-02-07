"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BillyDialog from "../components/BillyDialog";
import DialogBox from "../components/DialogBox";
import NextButton from "../components/NextButton";
import SceneLoader from "../components/SceneLoader";
import UserAvatar from "../components/UserAvatar";
import { useUser } from "../context/UserContext";

// All images used in this scene for preloading
const SCENE_IMAGES = [
  "/assets/shared/backgrounds/island-background.png",
  "/assets/shared/characters/Billy.svg",
  "/assets/shared/characters/Trichael.png",
  "/assets/shared/characters/boy.png",
  "/assets/shared/characters/girl.png",
  "/assets/shared/users/Alex.png",
  "/assets/shared/users/American Derek.png",
  "/assets/shared/users/Anastasia.png",
  "/assets/shared/users/Ariella.png",
  "/assets/shared/users/Brandon.png",
  "/assets/shared/users/Brian.png",
  "/assets/shared/users/Caeden.png",
  "/assets/shared/users/Canadian Derek.png",
  "/assets/shared/users/Carina.png",
  "/assets/shared/users/Charlie.png",
  "/assets/shared/users/Dennis.png",
  "/assets/shared/users/Esha.png",
  "/assets/shared/users/Freda.png",
  "/assets/shared/users/Goodman.png",
  "/assets/shared/users/Grant.png",
  "/assets/shared/users/Israel.png",
  "/assets/shared/users/JJ.png",
  "/assets/shared/users/Jenn.png",
  "/assets/shared/users/Jillian.png",
  "/assets/shared/users/Josh.png",
  "/assets/shared/users/Joy.png",
  "/assets/shared/users/Kana.png",
  "/assets/shared/users/Matt.png",
  "/assets/shared/users/Melayna.png",
  "/assets/shared/users/Newt.png",
  "/assets/shared/users/Rishabh.png",
  "/assets/shared/users/Sandra.png",
  "/assets/shared/users/Sid.png",
  "/assets/shared/users/Steven.png",
  "/assets/shared/users/Suhavi.png",
  "/assets/shared/users/Wayne.png",
];

// Map names to user images
const userImageMap: Record<string, string> = {
  alex: "/assets/shared/users/Alex.png",
  "american derek": "/assets/shared/users/American Derek.png",
  anastasia: "/assets/shared/users/Anastasia.png",
  ariella: "/assets/shared/users/Ariella.png",
  brandon: "/assets/shared/users/Brandon.png",
  brian: "/assets/shared/users/Brian.png",
  caeden: "/assets/shared/users/Caeden.png",
  "canadian derek": "/assets/shared/users/Canadian Derek.png",
  carina: "/assets/shared/users/Carina.png",
  charlie: "/assets/shared/users/Charlie.png",
  dennis: "/assets/shared/users/Dennis.png",
  esha: "/assets/shared/users/Esha.png",
  freda: "/assets/shared/users/Freda.png",
  goodman: "/assets/shared/users/Goodman.png",
  grant: "/assets/shared/users/Grant.png",
  israel: "/assets/shared/users/Israel.png",
  jj: "/assets/shared/users/JJ.png",
  jenn: "/assets/shared/users/Jenn.png",
  jillian: "/assets/shared/users/Jillian.png",
  josh: "/assets/shared/users/Josh.png",
  joy: "/assets/shared/users/Joy.png",
  kana: "/assets/shared/users/Kana.png",
  matt: "/assets/shared/users/Matt.png",
  melayna: "/assets/shared/users/Melayna.png",
  newt: "/assets/shared/users/Newt.png",
  rishabh: "/assets/shared/users/Rishabh.png",
  sandra: "/assets/shared/users/Sandra.png",
  sid: "/assets/shared/users/Sid.png",
  steven: "/assets/shared/users/Steven.png",
  suhavi: "/assets/shared/users/Suhavi.png",
  wayne: "/assets/shared/users/Wayne.png",
};

// Map names to gender
const boyNames = ["alex", "american derek", "brandon", "brian", "caeden", "canadian derek", "charlie", "dennis", "goodman", "grant", "israel", "jj", "josh", "matt", "newt", "rishabh", "sid", "steven", "wayne"];
const girlNames = ["anastasia", "ariella", "carina", "esha", "freda", "jenn", "jillian", "joy", "kana", "melayna", "sandra", "suhavi"];

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
  const { setUser, hasUploadedPhoto, uploadFailed } = useUser();
  // Wait for user interaction before starting typewriter to enable audio
  const [isReady, setIsReady] = useState(false);
  const [useTypewriter, setUseTypewriter] = useState(false);
  const [isNameInputVisible, setIsNameInputVisible] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"boy" | "girl" | null>(null);
  const [stage, setStage] = useState<"intro" | "greeting" | "photoPrompt" | "showPlayer" | "wakeup" | "trichael" | "choices">("intro");
  const [dialogText, setDialogText] = useState("Tap to continue");
  const [backgroundImage] = useState(
    "/assets/shared/backgrounds/island-background.png",
  );
  const [isBillyVisible] = useState(true);

  const handleScreenTap = () => {
    // Handle initial tap to start the typewriter dialog with audio
    if (!isReady && stage === "intro") {
      setIsReady(true);
      setDialogText("Aloha welcome to a remote Hawaiian island . . . What is your name?");
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
    // Save user image to context for display across all pages
    const userImage = getUserImage(name);
    if (userImage) {
      setUser(name.trim(), userImage);
    }
    // Show photo prompt before continuing
    setStage("photoPrompt");
  };

  const handlePhotoPromptContinue = () => {
    setStage("showPlayer");
  };

  const handleNotMe = () => {
    setName("");
    setDialogText("Aloha welcome to a remote Hawaiian island . . . What is your name?");
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
    <SceneLoader images={SCENE_IMAGES}>
    <main
      className="screen-container bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      onPointerDown={handleScreenTap}
    >
      <UserAvatar />
      <div className="mx-auto flex h-full w-full max-w-md flex-col items-center overflow-y-auto px-4 pt-16">
        {stage === "photoPrompt" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            {/* Animated arrow pointing to the actual avatar in top-left */}
            {!hasUploadedPhoto && !uploadFailed && (
              <div className="fixed left-16 top-3 z-[60] animate-pulse">
                <div className="flex items-center">
                  <span className="text-5xl drop-shadow-lg">👆</span>
                  <span 
                    className="ml-1 rounded-lg bg-amber-400 px-3 py-1 text-sm font-bold text-amber-900 shadow-lg"
                    style={{ fontFamily: "FinkHeavy, sans-serif" }}
                  >
                    Click here!
                  </span>
                </div>
              </div>
            )}

            <div className="mx-4 flex flex-col items-center gap-6 rounded-3xl border-4 border-amber-400 bg-amber-50 p-8 shadow-2xl">
              <div className="text-center">
                <h2 
                  className="mb-4 text-2xl text-amber-900"
                  style={{ fontFamily: "FinkHeavy, sans-serif" }}
                >
                  📷 Photo Challenge!
                </h2>
                <p className="mb-4 text-lg text-amber-800">
                  Throughout your adventure, you may need to <strong>take photos</strong> to complete challenges!
                </p>
                <p className="mb-6 text-lg text-amber-800">
                  Tap your <strong>avatar in the top left corner</strong> anytime to upload a photo.
                </p>
                
                {hasUploadedPhoto ? (
                  <div className="mb-4 rounded-xl bg-green-100 p-4 text-green-700 border-2 border-green-400">
                    <p className="text-lg font-bold">✅ Photo uploaded! Great job!</p>
                  </div>
                ) : uploadFailed ? (
                  <div className="mb-4 rounded-xl bg-amber-100 p-4 text-amber-700 border-2 border-amber-400">
                    <p className="text-sm font-semibold">⚠️ Upload had an issue, but you can continue!</p>
                    <p className="text-xs mt-1">You can try uploading again later.</p>
                  </div>
                ) : (
                  <div className="mb-4 rounded-xl bg-red-100 p-4 text-red-700 border-2 border-red-300">
                    <p className="text-sm font-semibold">⚠️ Take a selfie now to continue!</p>
                    <p className="text-xs mt-1">Click your avatar above and upload a photo.</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={handlePhotoPromptContinue}
                disabled={!hasUploadedPhoto && !uploadFailed}
                className={`rounded-full px-8 py-4 text-xl text-white shadow-lg transition-all ${
                  hasUploadedPhoto || uploadFailed
                    ? "bg-green-600 hover:scale-105 hover:bg-green-500 active:scale-95" 
                    : "bg-gray-400 cursor-not-allowed opacity-60"
                }`}
                style={{ fontFamily: "FinkHeavy, sans-serif" }}
              >
                {hasUploadedPhoto ? "Got it! Let's go! →" : uploadFailed ? "Continue anyway →" : "📷 Upload photo to continue"}
              </button>
            </div>
          </div>
        ) : stage === "greeting" && getUserImage(name) ? (
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
    </SceneLoader>
  );
}
