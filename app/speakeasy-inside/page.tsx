"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BillyDialog from "../components/BillyDialog";
import DialogBox from "../components/DialogBox";
import PositionedItem from "../components/PositionedItem";
import NextButton from "../components/NextButton";
import SceneLoader from "../components/SceneLoader";

// All images used in this scene for preloading
const SCENE_IMAGES = [
  "/assets/scenes/speakeasy/Speakeasy%20Empty.png",
  "/assets/scenes/speakeasy/Light.png",
  "/assets/scenes/speakeasy/Chair.png",
  "/assets/scenes/speakeasy/Beer.png",
  "/assets/scenes/speakeasy/Napkin.png",
  "/assets/scenes/speakeasy/Empty%20Beer.png",
  "/assets/scenes/speakeasy/Sticky.png",
  "/assets/shared/characters/Billy.svg",
];

function SpeakeasyInsideContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wordyResult = searchParams.get("wordy"); // "won" | "lost" | null

  const [dialog, setDialog] = useState({
    text: "",
    isVisible: false,
    showBilly: false,
    showBackground: true,
    useTypewriter: false,
    speaker: "Billy",
    key: "intro",
  });
  const [zoomedItem, setZoomedItem] = useState<{
    src: string;
    alt: string;
    aspectRatio: string;
  } | null>(null);
  const [showBrewsterChoice, setShowBrewsterChoice] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [wordyHandled, setWordyHandled] = useState(false);
  // Lager drinking flow: "lager-dialog" → "lager-full" → "lager-pouring" → "lager-empty" → "brewster-final"
  const [lagerStep, setLagerStep] = useState<"lager-dialog" | "lager-full" | "lager-pouring" | "lager-empty" | "brewster-final" | null>(null);
  // Tilt detection states
  const [tiltAngle, setTiltAngle] = useState(0);
  const [hasTiltSupport, setHasTiltSupport] = useState<boolean | null>(null);
  const [tiltPermissionRequested, setTiltPermissionRequested] = useState(false);
  // Smoothing ref for tilt
  const smoothedTiltRef = useRef(0);

  const showDialogFn = ({
    key,
    text,
    showBilly = true,
    showBackground = true,
    useTypewriter = true,
    speaker = "Billy",
  }: {
    key: string;
    text: string;
    showBilly?: boolean;
    showBackground?: boolean;
    useTypewriter?: boolean;
    speaker?: string;
  }) =>
    setDialog((current) =>
      current.isVisible && current.key === key
        ? { ...current, isVisible: false }
        : {
            text,
            isVisible: true,
            showBilly,
            showBackground,
            useTypewriter,
            speaker,
            key,
          },
    );

  // Trigger when pour is complete (tilted enough)
  const triggerPourComplete = useCallback(() => {
    if (lagerStep !== "lager-pouring") return;
    
    // Update zoomed item to empty beer and move to next step
    setZoomedItem({
      src: "/assets/scenes/speakeasy/Empty%20Beer.png",
      alt: "Empty Lager",
      aspectRatio: "1024 / 1536",
    });
    setLagerStep("lager-empty");
  }, [lagerStep]);

  // Handle wordy result or show intro dialog
  useEffect(() => {
    if (wordyResult && !wordyHandled) {
      // Returning from wordy game - show Brewster's response
      const message =
        wordyResult === "won"
          ? "Oh a lager? Here."
          : "Ohh... Please leave. Ask someone else for what you need.";
      
      // If won, show the beer as a zoomed item and start lager flow
      if (wordyResult === "won") {
        setZoomedItem({
          src: "/assets/scenes/speakeasy/Beer.png",
          alt: "Lager",
          aspectRatio: "1024 / 1536",
        });
        setLagerStep("lager-dialog");
      }
      
      setDialog({
        text: message,
        isVisible: true,
        showBilly: false,
        showBackground: true,
        useTypewriter: true,
        speaker: "Brewster",
        key: "wordy-result",
      });
      setWordyHandled(true);
    } else if (!wordyResult) {
      // Normal page load - show Billy's intro
      setDialog({
        text: "Whoa, this place is fancy! I wonder what secrets are hidden here...",
        isVisible: true,
        showBilly: true,
        showBackground: true,
        useTypewriter: true,
        speaker: "Billy",
        key: "intro",
      });
    }
  }, [wordyResult, wordyHandled]);

  // Device orientation tilt detection
  useEffect(() => {
    if (lagerStep !== "lager-pouring") return;

    let receivedValidData = false;
    let fallbackTimeout: NodeJS.Timeout;
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // gamma is the left-to-right tilt in degrees (-90 to 90)
      const gamma = event.gamma;
      
      // Check if we're getting real sensor data (not null/undefined)
      if (gamma !== null && gamma !== undefined) {
        receivedValidData = true;
        setHasTiltSupport(true);
      }
      
      // Calculate effective tilt - we want to detect when phone is tilted forward/sideways
      // like pouring a drink. Use gamma (side tilt) as primary pour indicator
      const rawTilt = Math.abs(gamma ?? 0);
      
      // Smooth the tilt using exponential moving average (lower = smoother, higher = responsive)
      const smoothingFactor = 0.15;
      smoothedTiltRef.current = smoothedTiltRef.current + (rawTilt - smoothedTiltRef.current) * smoothingFactor;
      const smoothedTilt = smoothedTiltRef.current;
      
      setTiltAngle(smoothedTilt);
      
      // Trigger completion when tilted past 45 degrees (opacity reaches 0)
      if (smoothedTilt >= 45) {
        triggerPourComplete();
      }
    };

    // Check if DeviceOrientationEvent is supported
    if (typeof DeviceOrientationEvent !== 'undefined') {
      // iOS 13+ requires permission
      if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
        setHasTiltSupport(true);
      } else {
        // Android, older iOS, and desktop - try to listen
        window.addEventListener('deviceorientation', handleOrientation);
        
        // Fallback: If we don't receive valid sensor data within 1 second, 
        // assume no tilt support (desktop) and show click fallback
        fallbackTimeout = setTimeout(() => {
          if (!receivedValidData) {
            setHasTiltSupport(false);
          }
        }, 1000);
      }
    } else {
      setHasTiltSupport(false);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, [lagerStep, triggerPourComplete]);

  // Request permission for iOS devices
  const requestTiltPermission = async () => {
    setTiltPermissionRequested(true);
    try {
      const DeviceOrientationEventTyped = DeviceOrientationEvent as unknown as { 
        requestPermission?: () => Promise<string> 
      };
      
      if (typeof DeviceOrientationEventTyped.requestPermission === 'function') {
        const permission = await DeviceOrientationEventTyped.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', (event: DeviceOrientationEvent) => {
            const gamma = event.gamma ?? 0;
            const rawTilt = Math.abs(gamma);
            
            // Smooth the tilt using exponential moving average
            const smoothingFactor = 0.15;
            smoothedTiltRef.current = smoothedTiltRef.current + (rawTilt - smoothedTiltRef.current) * smoothingFactor;
            const smoothedTilt = smoothedTiltRef.current;
            
            setTiltAngle(smoothedTilt);
            
            // Trigger completion when tilted past 45 degrees
            if (smoothedTilt >= 45) {
              triggerPourComplete();
            }
          });
        } else {
          setHasTiltSupport(false);
        }
      }
    } catch {
      setHasTiltSupport(false);
    }
  };

  const handleDismissZoom = () => {
    const wasNapkin = zoomedItem?.alt === "Napkin";

    // Handle lager drinking flow
    if (lagerStep === "lager-dialog") {
      // Dismiss dialog, show large beer with tilt instruction
      setDialog((current) => ({ ...current, isVisible: false }));
      setLagerStep("lager-full");
      return;
    }
    
    if (lagerStep === "lager-full") {
      // Move to pouring step - user needs to tilt device
      setLagerStep("lager-pouring");
      return;
    }

    // During pouring, don't allow dismiss - user MUST tilt to pour
    if (lagerStep === "lager-pouring") {
      return;
    }
    
    if (lagerStep === "lager-empty") {
      // Show Brewster's final message
      setDialog({
        text: "You should speak to Isabelle next. Tell her the password and she'll tell you more.",
        isVisible: true,
        showBilly: false,
        showBackground: true,
        useTypewriter: true,
        speaker: "Brewster",
        key: "brewster-final",
      });
      setLagerStep("brewster-final");
      return;
    }
    
    if (lagerStep === "brewster-final") {
      // Done with lager flow, show next button
      setDialog((current) => ({ ...current, isVisible: false }));
      setZoomedItem(null);
      setLagerStep(null);
      setShowNextButton(true);
      return;
    }

    // Normal dismiss logic (not in lager flow)
    setDialog((current) => ({ ...current, isVisible: false }));
    setZoomedItem(null);

    // After dismissing napkin, show Brewster's dialog
    if (wasNapkin) {
      setTimeout(() => {
        setDialog({
          text: "Do you want to play a game?",
          isVisible: true,
          showBilly: false,
          showBackground: true,
          useTypewriter: true,
          speaker: "Brewster",
          key: "brewster-choice",
        });
        setShowBrewsterChoice(true);
      }, 100);
    }
  };

  const handleDialogClick = () => {
    // If this is the wordy result dialog, show next button after dismissing
    if (dialog.key === "wordy-result") {
      setDialog((current) => ({ ...current, isVisible: false }));
      setShowNextButton(true);
    } else if (!showBrewsterChoice) {
      setDialog((current) => ({ ...current, isVisible: false }));
    }
  };

  return (
    <SceneLoader images={SCENE_IMAGES}>
    <main className="screen-container game-wrapper">
      <div
        className="game-container bg-cover bg-center"
        style={{ backgroundImage: `url('/assets/scenes/speakeasy/Speakeasy%20Empty.png')` }}
      >
      {/* Decorative items layer */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <PositionedItem left="25%" top="0%" width="30%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/speakeasy/Light.png"
            alt="Light"
            fill
            sizes="25vw"
            className="object-contain"
            priority
          />
        </PositionedItem>
        <PositionedItem left="35%" top="55%" width="40%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/speakeasy/Chair.png"
            alt="Chair"
            fill
            sizes="30vw"
            className="object-contain"
          />
        </PositionedItem>
        <PositionedItem left="25%" top="37%" width="20%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/speakeasy/Beer.png"
            alt="Beer"
            fill
            sizes="20vw"
            className="object-contain"
          />
        </PositionedItem>
        <PositionedItem left="5%" top="42%" width="20%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/speakeasy/Napkin.png"
            alt="Napkin"
            fill
            sizes="18vw"
            className="object-contain"
          />
        </PositionedItem>
      </div>

      {/* Dismiss overlay when item is zoomed */}
      {zoomedItem ? (
        <div
          className="pointer-events-auto absolute inset-0 z-[15] bg-black/40"
          onClick={() => {
            // Handle iOS permission request for pouring step
            if (lagerStep === "lager-pouring" && !tiltPermissionRequested && 
                typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === 'function') {
              requestTiltPermission();
              return;
            }
            handleDismissZoom();
          }}
        />
      ) : null}

      {/* Zoomed item display */}
      {zoomedItem ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col items-center justify-center">
            {/* Pouring mode - stacked layers with opacity control */}
            {lagerStep === "lager-pouring" ? (
              <div 
                className="relative flex items-center justify-center transition-transform duration-100"
                style={{
                  width: 200,
                  height: 300,
                  transform: `rotate(${Math.min(tiltAngle * 2, 90)}deg)`
                }}
              >
                {/* Bottom layer: Empty beer (15% smaller, shifted right and down) */}
                <div className="absolute inset-0 flex items-center justify-center translate-x-2 translate-y-3">
                  <Image
                    src="/assets/scenes/speakeasy/Empty%20Beer.png"
                    alt="Empty Lager"
                    width={143}
                    height={216}
                    className="object-contain"
                    priority
                  />
                </div>
                {/* Middle layer: Password number (positioned to center in empty glass) */}
                <div className="absolute inset-0 flex items-center justify-center z-10 translate-y-4">
                  <span className="text-4xl font-bold text-[#E3DFD9] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">3451</span>
                </div>
                {/* Top layer: Full beer - opacity decreases as you tilt */}
                <div 
                  className="absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-150"
                  style={{
                    // Opacity goes from 1 to 0 as tiltAngle goes from 0 to 45
                    opacity: Math.max(0, 1 - (tiltAngle / 45))
                  }}
                >
                  <Image
                    src="/assets/scenes/speakeasy/Beer.png"
                    alt="Lager"
                    width={168}
                    height={252}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            ) : (
              /* Normal zoomed item display for other states */
              <div 
                className="relative flex items-center justify-center"
              >
                <Image
                  src={zoomedItem.src}
                  alt={zoomedItem.alt}
                  width={
                    zoomedItem.alt === "Napkin" ? 352 :
                    (lagerStep === "lager-dialog" || lagerStep === "lager-empty" || lagerStep === "lager-full") ? 168 : 176
                  }
                  height={
                    zoomedItem.alt === "Napkin" ? 352 :
                    (lagerStep === "lager-dialog" || lagerStep === "lager-empty" || lagerStep === "lager-full") ? 252 : 176
                  }
                  className={`h-auto w-auto object-contain ${
                    zoomedItem.alt === "Napkin" ? "max-h-[352px] max-w-[352px]" :
                    (lagerStep === "lager-dialog" || lagerStep === "lager-empty" || lagerStep === "lager-full") ? "max-h-[252px] max-w-[168px]" :
                    "max-h-44 max-w-44"
                  }`}
                  priority
                />
                {/* Password on empty beer */}
                {lagerStep === "lager-empty" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#E3DFD9]">3451</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Tilt instruction for pouring step */}
            {lagerStep === "lager-pouring" && (
              <p className="mt-4 text-white text-sm text-center font-medium drop-shadow-lg">
                {hasTiltSupport === true && !tiltPermissionRequested && typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === 'function'
                  ? "Tap to enable tilt"
                  : "Tilt to pour! 🍺"
                }
              </p>
            )}

            {/* Tilt instruction for lager-full step */}
            {lagerStep === "lager-full" && (
              <p className="mt-4 text-white text-sm text-center font-medium drop-shadow-lg animate-pulse">
                Tap to continue...
              </p>
            )}
          </div>
          <DialogBox
            text={dialog.text}
            speaker={dialog.speaker}
            isVisible={dialog.isVisible}
            showBackground={dialog.showBackground}
            useTypewriter={dialog.useTypewriter}
            showOverlay={false}
            className="mt-4 max-w-sm"
          />
        </div>
      ) : null}

      {/* Clickable item overlays - only show when not zoomed and no wordy result */}
      {!zoomedItem && !wordyResult ? (
        <div className="absolute inset-0 z-10">
          <PositionedItem
            as="button"
            type="button"
            aria-label="Light"
            className="pointer-events-auto"
            left="25%"
            top="0%"
            width="30%"
            aspectRatio="1024 / 1536"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/speakeasy/Light.png",
                alt: "Light",
                aspectRatio: "1024 / 1536",
              });
              showDialogFn({
                key: "light",
                text: "A fancy lamp. It gives the place a nice moody atmosphere.",
                showBilly: false,
                showBackground: true,
                useTypewriter: false,
                speaker: "",
              });
            }}
          />
          <PositionedItem
            as="button"
            type="button"
            aria-label="Chair"
            className="pointer-events-auto"
            left="35%"
            top="55%"
            width="40%"
            aspectRatio="1024 / 1536"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/speakeasy/Chair.png",
                alt: "Chair",
                aspectRatio: "1024 / 1536",
              });
              showDialogFn({
                key: "chair",
                text: "A comfy-looking chair. Perfect for sipping drinks and discussing secrets.",
                showBilly: false,
                showBackground: true,
                useTypewriter: false,
                speaker: "",
              });
            }}
          />
          <PositionedItem
            as="button"
            type="button"
            aria-label="Beer"
            className="pointer-events-auto"
            left="25%"
            top="37%"
            width="20%"
            aspectRatio="1024 / 1536"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/speakeasy/Beer.png",
                alt: "Beer",
                aspectRatio: "1024 / 1536",
              });
              showDialogFn({
                key: "beer",
                text: "A Hazy IPA. Tran's favorite. Yum.",
                showBilly: false,
                showBackground: true,
                useTypewriter: false,
                speaker: "",
              });
            }}
          />
          <PositionedItem
            as="button"
            type="button"
            aria-label="Napkin"
            className="pointer-events-auto"
            left="5%"
            top="42%"
            width="20%"
            aspectRatio="1024 / 1536"
            onClick={() => {
              // Show Sticky instead of Napkin when clicked
              setZoomedItem({
                src: "/assets/scenes/speakeasy/Sticky.png",
                alt: "Napkin",
                aspectRatio: "1024 / 1536",
              });
              showDialogFn({
                key: "napkin",
                text: "There's something written on this napkin...",
                showBilly: false,
                showBackground: true,
                useTypewriter: false,
                speaker: "",
              });
            }}
          />
        </div>
      ) : null}

      {/* Billy dialog for intro or Brewster dialog */}
      {!zoomedItem ? (
        <div className="pointer-events-none relative z-20 mx-auto flex h-full w-full max-w-md flex-col items-center overflow-y-auto px-4 pt-16">
          <BillyDialog
            text={dialog.text}
            characterImageVisible={dialog.showBilly && dialog.isVisible}
            isVisible={dialog.isVisible}
            showBackground={dialog.showBackground}
            useTypewriter={dialog.useTypewriter}
            className="mt-6 max-w-sm"
            onDialogClick={handleDialogClick}
            choiceButtons={{
              isVisible: showBrewsterChoice && dialog.isVisible && dialog.key === "brewster-choice",
              primaryLabel: "Play a game",
              secondaryLabel: "Explore more",
              onPrimaryClick: () => {
                router.push("/wordy");
              },
              onSecondaryClick: () => {
                // Dismiss and continue exploring
                setShowBrewsterChoice(false);
                setDialog((current) => ({ ...current, isVisible: false }));
              },
            }}
          />
        </div>
      ) : null}

      {/* Next Button - shown after wordy result dialog is dismissed */}
      <NextButton href="/office" isVisible={showNextButton} />

      </div>
    </main>
    </SceneLoader>
  );
}

export default function SpeakeasyInsidePage() {
  return (
    <Suspense fallback={null}>
      <SpeakeasyInsideContent />
    </Suspense>
  );
}
