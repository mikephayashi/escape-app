"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BillyDialog from "../components/BillyDialog";
import DialogBox from "../components/DialogBox";
import PositionedItem from "../components/PositionedItem";
import NextButton from "../components/NextButton";
import SceneContainer from "../components/SceneContainer";
import SceneLoader from "../components/SceneLoader";
import UserAvatar from "../components/UserAvatar";

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
  // Lager drinking flow: "lager-dialog" → "lager-pouring" → "lager-empty" → "brewster-final"
  const [lagerStep, setLagerStep] = useState<"lager-dialog" | "lager-pouring" | "lager-empty" | "brewster-final" | null>(null);
  // Tilt detection states
  const [tiltAngle, setTiltAngle] = useState(0); // Actual rotation angle (can be negative or positive)
  const [hasTiltSupport, setHasTiltSupport] = useState<boolean | null>(null);
  const [tiltPermissionRequested, setTiltPermissionRequested] = useState(false);
  // Smoothing refs for tilt (using circular buffer for better averaging)
  const smoothedTiltRef = useRef(0);
  const lastTiltTimeRef = useRef<number>(0);
  const tiltHistoryRef = useRef<number[]>([]);
  // Pour progress: 0-100%, opacity = 1 - (pourProgress/100)
  const [pourProgress, setPourProgress] = useState(0);
  const lastTickRef = useRef<number | null>(null);
  // Pouring sound effect
  const pourAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPouring, setIsPouring] = useState(false);
  // Track when pour is complete (to keep showing empty beer with next button)
  const [pourComplete, setPourComplete] = useState(false);
  // Store final tilt angle when pour completes
  const [finalTiltAngle, setFinalTiltAngle] = useState(0);

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

  // Trigger when pour is complete (held at 70+ degrees for 10 seconds)
  const triggerPourComplete = useCallback(() => {
    if (lagerStep !== "lager-pouring") return;
    
    // Pour complete - keep tilted mug visible at current angle, stop sound, show next button
    setFinalTiltAngle(smoothedTiltRef.current);
    setPourComplete(true);
    setIsPouring(false);
    lastTickRef.current = null;
    setShowNextButton(true);
  }, [lagerStep]);

  // Manage pouring sound effect
  useEffect(() => {
    if (!pourAudioRef.current) {
      pourAudioRef.current = new Audio("/assets/shared/audio/pouring.mp3");
      pourAudioRef.current.loop = true;
      pourAudioRef.current.volume = 0.7;
    }
    
    const audio = pourAudioRef.current;
    
    if (isPouring && lagerStep === "lager-pouring" && !pourComplete) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Autoplay may be blocked, that's okay
      });
    } else {
      audio.pause();
    }
    
    return () => {
      audio.pause();
    };
  }, [isPouring, lagerStep, pourComplete]);

  // Unlock audio on user interaction (needed for mobile)
  useEffect(() => {
    const unlockAudio = () => {
      if (pourAudioRef.current) {
        // Create and play a silent buffer to unlock audio
        pourAudioRef.current.play().then(() => {
          pourAudioRef.current?.pause();
          pourAudioRef.current!.currentTime = 0;
        }).catch(() => {});
      }
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };
    
    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });
    
    return () => {
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };
  }, []);

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
    const HISTORY_SIZE = 8; // Number of samples to average for smoothing
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // beta is the front-to-back tilt in degrees (-180 to 180)
      // beta ~90 = phone held upright normally
      // beta ~180 = phone tilted forward (top away from you, like pouring)
      // beta ~0 = phone tilted backward (top toward you)
      const beta = event.beta;
      
      // Check if we're getting real sensor data (not null/undefined)
      if (beta !== null && beta !== undefined) {
        receivedValidData = true;
        setHasTiltSupport(true);
      }
      
      // Convert beta to pour angle: 0 = upright, positive = tilting forward to pour
      // Normal holding is around beta=90, so subtract 90 to get pour angle
      const rawTilt = (beta ?? 90) - 90;
      const now = performance.now();
      
      // Add to history buffer for moving average smoothing
      tiltHistoryRef.current.push(rawTilt);
      if (tiltHistoryRef.current.length > HISTORY_SIZE) {
        tiltHistoryRef.current.shift();
      }
      
      // Calculate weighted moving average (more recent samples have higher weight)
      let weightedSum = 0;
      let weightTotal = 0;
      tiltHistoryRef.current.forEach((val, idx) => {
        const weight = idx + 1; // Weight increases for newer samples
        weightedSum += val * weight;
        weightTotal += weight;
      });
      const averagedTilt = weightTotal > 0 ? weightedSum / weightTotal : rawTilt;
      
      // Additional exponential smoothing on top of moving average for ultra-smooth motion
      // Use frame-time-independent smoothing
      const deltaTime = lastTiltTimeRef.current > 0 ? (now - lastTiltTimeRef.current) / 1000 : 0.016;
      lastTiltTimeRef.current = now;
      
      // Smoothing factor that's frame-rate independent (higher = more responsive)
      const smoothSpeed = 8; // Adjust this: lower = smoother, higher = more responsive
      const smoothFactor = 1 - Math.exp(-smoothSpeed * deltaTime);
      
      smoothedTiltRef.current = smoothedTiltRef.current + (averagedTilt - smoothedTiltRef.current) * smoothFactor;
      const smoothedTilt = smoothedTiltRef.current;
      
      // Use the actual smoothed value for rotation (can be negative or positive)
      setTiltAngle(smoothedTilt);
      
      // Check if tilted enough in EITHER direction (absolute value >= 70)
      const absTilt = Math.abs(smoothedTilt);
      const nowMs = Date.now();
      
      // Only progress opacity when tilted past 70 degrees in either direction
      if (absTilt >= 70) {
        setIsPouring(true);
        if (lastTickRef.current !== null) {
          const deltaMs = nowMs - lastTickRef.current;
          // 10 seconds = 10000ms to go from 0 to 100%
          const progressIncrement = (deltaMs / 10000) * 100;
          setPourProgress(prev => {
            const newProgress = Math.min(100, prev + progressIncrement);
            if (newProgress >= 100) {
              triggerPourComplete();
            }
            return newProgress;
          });
        }
        lastTickRef.current = nowMs;
      } else {
        // Below 70 degrees - pause the timer and sound
        setIsPouring(false);
        lastTickRef.current = null;
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
      // Reset smoothing state when unmounting
      tiltHistoryRef.current = [];
      lastTiltTimeRef.current = 0;
    };
  }, [lagerStep, triggerPourComplete]);

  // Request permission for iOS devices
  const requestTiltPermission = async () => {
    setTiltPermissionRequested(true);
    const HISTORY_SIZE = 8;
    
    try {
      const DeviceOrientationEventTyped = DeviceOrientationEvent as unknown as { 
        requestPermission?: () => Promise<string> 
      };
      
      if (typeof DeviceOrientationEventTyped.requestPermission === 'function') {
        const permission = await DeviceOrientationEventTyped.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', (event: DeviceOrientationEvent) => {
            // beta is the front-to-back tilt (-180 to 180)
            // Normal holding is ~90, tilting forward to pour increases toward 180
            const beta = event.beta;
            const rawTilt = (beta ?? 90) - 90;
            const now = performance.now();
            
            // Add to history buffer for moving average smoothing
            tiltHistoryRef.current.push(rawTilt);
            if (tiltHistoryRef.current.length > HISTORY_SIZE) {
              tiltHistoryRef.current.shift();
            }
            
            // Calculate weighted moving average
            let weightedSum = 0;
            let weightTotal = 0;
            tiltHistoryRef.current.forEach((val, idx) => {
              const weight = idx + 1;
              weightedSum += val * weight;
              weightTotal += weight;
            });
            const averagedTilt = weightTotal > 0 ? weightedSum / weightTotal : rawTilt;
            
            // Frame-rate-independent exponential smoothing
            const deltaTime = lastTiltTimeRef.current > 0 ? (now - lastTiltTimeRef.current) / 1000 : 0.016;
            lastTiltTimeRef.current = now;
            
            const smoothSpeed = 8;
            const smoothFactor = 1 - Math.exp(-smoothSpeed * deltaTime);
            
            smoothedTiltRef.current = smoothedTiltRef.current + (averagedTilt - smoothedTiltRef.current) * smoothFactor;
            const smoothedTilt = smoothedTiltRef.current;
            
            setTiltAngle(smoothedTilt);
            
            const absTilt = Math.abs(smoothedTilt);
            const nowMs = Date.now();
            
            // Only progress opacity when tilted past 70 degrees in either direction
            if (absTilt >= 70) {
              setIsPouring(true);
              if (lastTickRef.current !== null) {
                const deltaMs = nowMs - lastTickRef.current;
                const progressIncrement = (deltaMs / 10000) * 100;
                setPourProgress(prev => {
                  const newProgress = Math.min(100, prev + progressIncrement);
                  if (newProgress >= 100) {
                    triggerPourComplete();
                  }
                  return newProgress;
                });
              }
              lastTickRef.current = nowMs;
            } else {
              setIsPouring(false);
              lastTickRef.current = null;
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
      // Dismiss dialog, go straight to pouring step
      setDialog((current) => ({ ...current, isVisible: false }));
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

  // Speakeasy background is 1024x1536 pixels = 2:3 aspect ratio
  const SPEAKEASY_ASPECT_RATIO = 2 / 3;

  return (
    <SceneLoader images={SCENE_IMAGES}>
    <main className="screen-container">
      <UserAvatar />
      <SceneContainer
        backgroundSrc="/assets/scenes/speakeasy/Speakeasy%20Empty.png"
        backgroundAlt="Speakeasy interior"
        aspectRatio={SPEAKEASY_ASPECT_RATIO}
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
            {(lagerStep === "lager-pouring" || pourComplete) ? (
              <div 
                className="relative flex items-center justify-center"
                style={{
                  width: 200,
                  height: 300,
                  // Amplify tilt by 2x so 90° phone tilt = 180° visual rotation (fully upside down)
                  // Clamp between -180 and 180 degrees, lock at final angle when complete
                  transform: `rotate(${pourComplete ? Math.max(-180, Math.min(180, finalTiltAngle * 2)) : Math.max(-180, Math.min(180, tiltAngle * 2))}deg)`,
                  // Use will-change for GPU acceleration, no CSS transition (handled by smoothing algorithm)
                  willChange: 'transform'
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
                {/* Top layer: Full beer - opacity decreases based on pour progress (time held at >70 degrees) */}
                <div 
                  className="absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-150"
                  style={{
                    // Opacity matches remaining pour: 80% poured = 20% opacity
                    opacity: Math.max(0, 1 - (pourProgress / 100))
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
                    (lagerStep === "lager-dialog" || lagerStep === "lager-empty") ? 168 : 176
                  }
                  height={
                    zoomedItem.alt === "Napkin" ? 352 :
                    (lagerStep === "lager-dialog" || lagerStep === "lager-empty") ? 252 : 176
                  }
                  className={`h-auto w-auto object-contain ${
                    zoomedItem.alt === "Napkin" ? "max-h-[352px] max-w-[352px]" :
                    (lagerStep === "lager-dialog" || lagerStep === "lager-empty") ? "max-h-[252px] max-w-[168px]" :
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
            
            {/* Tilt instruction for pouring step (hide when complete) */}
            {lagerStep === "lager-pouring" && !pourComplete && (
              <p className="mt-4 text-white text-sm text-center font-medium drop-shadow-lg">
                {hasTiltSupport === true && !tiltPermissionRequested && typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === 'function'
                  ? "Tap to begin"
                  : "Drink up! 🍺"
                }
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
                text: "If you didn't, Tran did.",
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

      </SceneContainer>
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
