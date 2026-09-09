import type { ReactNode } from "react";

interface FocusCardProps {
  image: string;
  title: string;
  children: ReactNode;
}

/** One illustrated card on the Currently Focused On rail. */
const FocusCard = ({ image, title, children }: FocusCardProps) => (
  <div
    className="flex snap-start flex-col gap-2.5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
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
    <h3 className="text-base font-semibold text-brand">{title}</h3>
    <p
      className="text-sm leading-relaxed text-gray-700 sm:text-[13.5px]"
      style={{ textWrap: "pretty" }}
    >
      {children}
    </p>
  </div>
);

export default FocusCard;
