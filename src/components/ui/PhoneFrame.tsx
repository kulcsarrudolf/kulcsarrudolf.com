import type { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

/*
 * A Samsung Galaxy S26 drawn to scale around a dialog's content, from `md`
 * up; on a real phone the children render as they are and the phone in the
 * hand is the frame. Pair it with a `frameless` Modal.
 *
 * The body is 71.7 x 149.6 mm and the 6.3" 19.5:9 screen is 67.1 x 145.3 mm,
 * so every measurement below is a fraction of the body height,
 * min(52rem, 92dvh):
 * bezels of 2.3 mm at the sides (1.55%) and 2.15 mm top and bottom (1.44%),
 * a 3.3 mm punch hole (2.2%) 3.5 mm from the top edge of the glass (2.3%).
 * Padding is written against the height rather than as a percentage, since
 * a percentage would resolve against the dialog, not the phone. Corners are
 * a 10 mm radius on the body and 8 mm on the screen, as percentages of the
 * box's own width and height so they stay circular.
 */
const BODY =
  "md:relative md:aspect-[717/1496] md:h-[min(52rem,92dvh)] md:rounded-[13.9%/6.7%] md:bg-black md:px-[calc(min(52rem,92dvh)*0.0155)] md:py-[calc(min(52rem,92dvh)*0.0144)] md:shadow-2xl md:ring-2 md:ring-gray-400 dark:md:ring-gray-600";

const SCREEN =
  "flex flex-col md:relative md:h-full md:overflow-y-auto md:rounded-[11.9%/5.5%] md:bg-white md:px-3 md:pt-[calc(min(52rem,92dvh)*0.05)] md:pb-4 hide-scrollbar dark:md:bg-card-dark";

const CAMERA =
  "absolute left-1/2 top-[calc(min(52rem,92dvh)*0.023)] size-[calc(min(52rem,92dvh)*0.022)] -translate-x-1/2 rounded-full bg-black max-md:hidden";

// The volume rocker and the side key, both on the right edge.
const KEY = "absolute -right-1 w-1 rounded-r-sm bg-gray-400 max-md:hidden dark:bg-gray-600";

const PhoneFrame = ({ children }: PhoneFrameProps) => (
  <div className={BODY}>
    <span aria-hidden className={`${KEY} top-[22%] h-[14%]`} />
    <span aria-hidden className={`${KEY} top-[40%] h-[8%]`} />

    <div className={SCREEN}>
      <span aria-hidden className={CAMERA} />
      <div className="md:my-auto">{children}</div>
    </div>
  </div>
);

export default PhoneFrame;
