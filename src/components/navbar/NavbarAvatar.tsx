"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import CircularProgress from "./CircularProgress";
import WelcomeModal from "./WelcomeModal";

interface NavbarAvatarProps {
  src: string;
  alt: string;
}

const NavbarAvatar = ({ src, alt }: NavbarAvatarProps) => {
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const DELAY_MS = 1000;
  const ANIMATION_DURATION_MS = 6000;
  const UPDATE_INTERVAL_MS = 50;

  const resetState = useCallback(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(0);
  }, []);

  const startProgress = useCallback(() => {
    if (showModal) return;

    delayTimerRef.current = setTimeout(() => {
      const startTime = Date.now();

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / ANIMATION_DURATION_MS) * 100, 100);

        setProgress(newProgress);

        if (newProgress >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setShowModal(true);
        }
      }, UPDATE_INTERVAL_MS);
    }, DELAY_MS);
  }, [showModal]);

  const stopProgress = useCallback(() => {
    if (!showModal) {
      resetState();
    }
  }, [resetState, showModal]);

  // Mouse events (desktop)
  const handleMouseEnter = useCallback(() => startProgress(), [startProgress]);
  const handleMouseLeave = useCallback(() => stopProgress(), [stopProgress]);

  // Touch events (mobile - long press)
  const handleTouchStart = useCallback(() => startProgress(), [startProgress]);
  const handleTouchEnd = useCallback(() => stopProgress(), [stopProgress]);

  // Prevent context menu on long press (mobile)
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    resetState();
  }, [resetState]);

  useEffect(() => {
    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      <div
        className="relative mr-3 w-[48px] h-[48px] flex items-center justify-center select-none touch-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onContextMenu={handleContextMenu}
      >
        <Image
          width={40}
          height={40}
          src={src}
          className="rounded-full shadow-md border-2 border-white p-0.5"
          alt={alt}
        />
        {progress > 0 && <CircularProgress progress={progress} size={48} strokeWidth={3} />}
      </div>

      {showModal && <WelcomeModal onClose={handleCloseModal} />}
    </>
  );
};

export default NavbarAvatar;
