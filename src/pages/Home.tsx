// src/pages/Home.tsx
import { Button, PortalTrigger, Text } from "@1mpl0rd/react-ui-components";
import { useState, useEffect } from "react";
import { CoinFlip } from "../components/CoinFlip";
import RequestModal from "../components/RequestModal";
import coinSheet from "../assets/images/coin_sheet.png";
import Confetti from "react-confetti";
// import { usePortalProvider } from "@1mpl0rd/react-ui-components";

const MAX_ATTEMPTS = 2;
const COOLDOWN_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const WIN_COOLDOWN_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const HomePage = () => {
  // const { closePortalElement } = usePortalProvider();
  const [messageSent, setMessageSent] = useState(false);

  const [attempts, setAttempts] = useState(() => {
    const savedAttempts = localStorage.getItem("flipAttempts");
    return savedAttempts ? parseInt(savedAttempts, 10) : 0;
  });
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(() => {
    const savedCooldown = localStorage.getItem("cooldownEnd");
    return savedCooldown ? parseInt(savedCooldown, 10) : null;
  });
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [winCooldownEnd, setWinCooldownEnd] = useState<number | null>(() => {
    const savedWinCooldown = localStorage.getItem("winCooldownEnd");
    return savedWinCooldown ? parseInt(savedWinCooldown, 10) : null;
  });
  const [winTimeLeft, setWinTimeLeft] = useState(0);
  const [hasWon, setHasWon] = useState(() => {
    const savedWinCooldown = localStorage.getItem("winCooldownEnd");
    if (!savedWinCooldown) return false;
    return parseInt(savedWinCooldown, 10) > Date.now();
  });
  const handleFlipEnd = (winner: "HEADS" | "TAILS") => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    localStorage.setItem("flipAttempts", newAttempts.toString());

    if (newAttempts >= MAX_ATTEMPTS) {
      const now = Date.now();
      const newCooldownEnd = now + COOLDOWN_DURATION;
      setCooldownEnd(newCooldownEnd);
      localStorage.setItem("cooldownEnd", newCooldownEnd.toString());
    }

    if (winner === "HEADS") {
      const now = Date.now();
      const newWinCooldownEnd = now + WIN_COOLDOWN_DURATION;
      setWinCooldownEnd(newWinCooldownEnd);
      localStorage.setItem("winCooldownEnd", newWinCooldownEnd.toString());
      setHasWon(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 7000); // Confetti for 7 seconds
    }
  };

  useEffect(() => {
    if (!cooldownEnd) return;

    const interval = setInterval(() => {
      const remaining = cooldownEnd - Date.now();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setAttempts(0);
        localStorage.removeItem("flipAttempts");
        setCooldownEnd(null);
        localStorage.removeItem("cooldownEnd");
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownEnd]);

  useEffect(() => {
    if (!winCooldownEnd) return;

    const interval = setInterval(() => {
      const remaining = winCooldownEnd - Date.now();
      setWinTimeLeft(remaining);
      if (remaining <= 0) {
        setHasWon(false);
        setWinCooldownEnd(null);
        localStorage.removeItem("winCooldownEnd");
        setWinTimeLeft(0);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [winCooldownEnd]);

  const flipsLeft = MAX_ATTEMPTS - attempts;
  const canFlip = flipsLeft > 0;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {showConfetti && <Confetti recycle={false} />}
      <div className="relative flex flex-col items-center justify-center min-h-screen">
        {messageSent && (
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center whitespace-nowrap gap-2">
            <Text as="p" variant="bodyLg" fontWeight="bold">
              Danke, ich melde mich sofort! :)
            </Text>
          </div>
        )}

        <div className="absolute bottom-4 right-4">
          <PortalTrigger id="main-portal" triggerType="click">
            <Button variant="primary" disabled={!hasWon}>
              Portal öffnen {hasWon && `(${formatTime(winTimeLeft)})`}
            </Button>
          </PortalTrigger>
        </div>
        <div className="absolute top-4 left-4">
          <Text as="span" variant="bodySm">
            {canFlip
              ? `Versuche: ${flipsLeft}`
              : `Nächster Versuch: ${formatTime(timeLeft)}`}
          </Text>
        </div>
        <CoinFlip
          imageSrc={coinSheet}
          onFlipEnd={handleFlipEnd}
          width={150}
          height={150}
          disabled={!canFlip}
        />
        {hasWon && (
          <RequestModal
            timeLeft={winTimeLeft}
            onMessageSent={() => setMessageSent(true)}
          />
        )}
      </div>
    </>
  );
};

export default HomePage;
