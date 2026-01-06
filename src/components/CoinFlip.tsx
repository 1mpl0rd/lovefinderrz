// src/components/CoinFlip.tsx
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@1mpl0rd/react-ui-components";

// Interfaces für Props
interface CoinFlipProps {
  imageSrc: string;
  onFlipEnd?: (result: "HEADS" | "TAILS") => void;
  width?: number;
  height?: number;
  disabled?: boolean;
}

const TOTAL_FRAMES = 18;
// Laut Beschreibung: Bild 1 (Index 0) ist Heads
const HEADS_FRAME_INDEX = 0;
// Laut Beschreibung: Bild 10 (Index 9) ist Tails
const TAILS_FRAME_INDEX = 9;

export const CoinFlip: React.FC<CoinFlipProps> = ({
  imageSrc,
  onFlipEnd,
  width = 150,
  height = 150,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(HEADS_FRAME_INDEX);
  // const [result, setResult] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const animState = useRef({
    startTime: 0,
    duration: 2500,
    startFrame: 0,
    targetFrame: 0,
    totalFramesToPlay: 0,
    reqId: 0,
  });

  // 1. Bild laden
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      drawFrame(HEADS_FRAME_INDEX); // Startposition zeichnen
    };
  }, [imageSrc]);

  // Helper: Einen spezifischen Frame zeichnen
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imageRef.current;

    if (!canvas || !ctx || !img) return;

    // Canvas leeren
    ctx.clearRect(0, 0, width, height);

    // Berechnung der Dimensionen
    // Da das Sprite vertical ist:
    const frameHeight = img.height / TOTAL_FRAMES;
    const sourceY = frameIndex * frameHeight;

    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    ctx.drawImage(
      img,
      0, // sx (X Start im Source Bild)
      sourceY, // sy (Y Start im Source Bild -> das wandert nach unten)
      img.width, // sWidth (Breite eines Frames)
      frameHeight, // sHeight (Höhe eines Frames)
      0, // dx (Canvas X)
      0, // dy (Canvas Y)
      width, // dWidth
      height // dHeight
    );
  };

  const animate = (timestamp: number) => {
    const state = animState.current;

    if (!state.startTime) state.startTime = timestamp;

    const elapsed = timestamp - state.startTime;
    const progress = Math.min(elapsed / state.duration, 1); // linear 0–1

    const currentFrameStep = Math.floor(progress * state.totalFramesToPlay);

    const frameIndexToDraw =
      (state.startFrame + currentFrameStep) % TOTAL_FRAMES;

    drawFrame(frameIndexToDraw);

    if (progress < 1) {
      state.reqId = requestAnimationFrame(animate);
    } else {
      setIsFlipping(false);
      drawFrame(state.targetFrame);
      setCurrentFrame(state.targetFrame);

      /*  const flipResult =
        state.targetFrame === HEADS_FRAME_INDEX ? "HEADS" : "TAILS";
      setResult(flipResult); */

      if (onFlipEnd) {
        onFlipEnd(state.targetFrame === HEADS_FRAME_INDEX ? "HEADS" : "TAILS");
      }
    }
  };

  const flipCoin = () => {
    if (isFlipping || !imageRef.current || disabled) return;
    setIsFlipping(true);

    // Ergebnis bestimmen (50/50)
    const isHeads = Math.random() > 0.5;
    const targetIndex = isHeads ? HEADS_FRAME_INDEX : TAILS_FRAME_INDEX;

    // Wie viele volle Umdrehungen wollen wir? (z.B. 5 bis 8 Umdrehungen für Realismus)
    const minRotations = 5;
    const additionalRotations = Math.floor(Math.random() * 3); // Zufall: 5, 6 oder 7 Umdrehungen
    const fullRotationsFrames =
      (minRotations + additionalRotations) * TOTAL_FRAMES;

    // Distanz zum Ziel-Frame berechnen, basierend auf der aktuellen Position
    let distanceToTarget = targetIndex - currentFrame;
    if (distanceToTarget < 0) {
      distanceToTarget += TOTAL_FRAMES;
    }

    const totalFrames = fullRotationsFrames + distanceToTarget;

    // State setzen und Animation starten
    animState.current = {
      startTime: 0,
      duration: 2000 + Math.random() * 1000, // Zufällige Dauer zwischen 2s und 3s
      startFrame: currentFrame,
      targetFrame: targetIndex,
      totalFramesToPlay: totalFrames,
      reqId: 0,
    };

    animState.current.reqId = requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={disabled ? "" : "cursor-pointer"}
          onClick={flipCoin}
          aria-label={isFlipping ? "Flipping..." : "Flip the coin"}
          role="button"
          tabIndex={0}
        />
      </div>
      <Button onClick={flipCoin} disabled={isFlipping || disabled}>
        {isFlipping ? "Flipping..." : "Flip"}
      </Button>
    </div>
  );
};
