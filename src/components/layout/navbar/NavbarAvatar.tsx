import { useCallback, useEffect, useRef, useState } from "react";

import CircularProgress from "./CircularProgress";

interface NavbarAvatarProps {
  src: string;
  alt: string;
  ringClassName?: string;
  /** True while the egg is showing, which parks the hold until it is closed. */
  isRevealed?: boolean;
  /** Called once the ring has filled. */
  onReveal?: () => void;
}

const DELAY_MS = 1000;
const ANIMATION_DURATION_MS = 6000;

const NavbarAvatar = ({
  src,
  alt,
  ringClassName = "border-white",
  isRevealed = false,
  onReveal,
}: NavbarAvatarProps) => {
  const [progress, setProgress] = useState(0);

  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);
  // The avatar sits inside the brand link. Finishing the hold on a touch screen
  // would otherwise fire the link's synthesized click and navigate home behind
  // the modal, so the next click after the egg fires is swallowed.
  const swallowNextClickRef = useRef(false);

  const resetState = useCallback(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    setProgress(0);
  }, []);

  const startProgress = useCallback(() => {
    if (isRevealed || delayTimerRef.current || frameRef.current) return;

    delayTimerRef.current = setTimeout(() => {
      delayTimerRef.current = null;
      const startTime = Date.now();

      const tick = () => {
        const elapsed = Date.now() - startTime;
        const next = Math.min((elapsed / ANIMATION_DURATION_MS) * 100, 100);
        setProgress(next);

        if (next >= 100) {
          frameRef.current = null;
          swallowNextClickRef.current = true;
          setProgress(0);
          onReveal?.();
          return;
        }

        frameRef.current = requestAnimationFrame(tick);
      };

      frameRef.current = requestAnimationFrame(tick);
    }, DELAY_MS);
  }, [isRevealed, onReveal]);

  const stopProgress = useCallback(() => {
    if (!isRevealed) {
      resetState();
    }
  }, [resetState, isRevealed]);

  const handleClickCapture = useCallback((event: React.MouseEvent) => {
    if (!swallowNextClickRef.current) return;
    swallowNextClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  useEffect(
    () => () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  return (
    <div
      className="relative mr-2 flex h-9 w-9 shrink-0 touch-none select-none items-center justify-center sm:mr-2.5 sm:h-10 sm:w-10"
      onMouseEnter={startProgress}
      onMouseLeave={stopProgress}
      onTouchStart={startProgress}
      onTouchEnd={stopProgress}
      onTouchCancel={stopProgress}
      onClickCapture={handleClickCapture}
      // Stops the long press raising the platform context menu on touch.
      onContextMenu={(event) => event.preventDefault()}
    >
      <img
        width={36}
        height={36}
        src={src}
        className={`h-8 w-8 rounded-full border-2 p-0.5 shadow-md sm:h-9 sm:w-9 ${ringClassName}`}
        alt={alt}
      />
      {progress > 0 && <CircularProgress progress={progress} size={40} strokeWidth={3} />}
    </div>
  );
};

export default NavbarAvatar;
