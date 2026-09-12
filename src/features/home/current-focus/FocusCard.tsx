import type { ReactNode } from "react";

interface FocusCardProps {
  image: string;
  title: string;
  children: ReactNode;
}

/** One illustrated card on the Currently Focused On rail. */
const FocusCard = ({ image, title, children }: FocusCardProps) => (
  <div
    className="flex snap-start flex-col gap-2.5 rounded-lg border border-gray-200 bg-white p-4 shadow-xs transition-shadow hover:shadow-md dark:border-line-dark dark:bg-card-dark"
    // The cards share the row when all of them fit and hold 220px once they
    // don't, which is what turns the rail into a scroller.
    style={{ flex: "1 0 220px" }}
  >
    <img
      src={image}
      alt=""
      width={96}
      height={96}
      className="mx-auto"
      style={{ width: 96, height: 96, objectFit: "contain" }}
    />
    <h3 className="text-base font-semibold text-brand dark:text-brand-on-dark">{title}</h3>
    <p
      className="text-sm leading-relaxed text-gray-700 sm:text-[13.5px] dark:text-gray-300"
      style={{ textWrap: "pretty" }}
    >
      {children}
    </p>
  </div>
);

export default FocusCard;
