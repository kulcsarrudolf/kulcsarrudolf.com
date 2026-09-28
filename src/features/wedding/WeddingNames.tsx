/**
 * The couple's names as they are lettered on the printed invitation: three
 * pieces cut from it, laid out where they sit on the card. The lettering is
 * the Slight script, which has no free web licence, so the invitation's own
 * ink is used rather than a font that only resembles it.
 *
 * The invitation is Hungarian, so only `és` exists as lettering; the other
 * languages set their word in WindSong, the closest free script, in its place.
 */
import "@fontsource/windsong/400.css";

const HUNGARIAN_AND = "és";

const WeddingNames = ({ names, and }: { names: string; and: string }) => (
  <h1 aria-label={names} className="relative aspect-701/278 w-80 sm:w-md lg:w-lg">
    <img
      src="/images/wedding/name-rudolf.webp"
      alt=""
      className="absolute left-0 top-0 w-[62.77%]"
    />
    {and === HUNGARIAN_AND ? (
      <img
        src="/images/wedding/name-es.webp"
        alt=""
        className="absolute left-[52.64%] top-[51.8%] w-[10.84%]"
      />
    ) : (
      <span
        aria-hidden="true"
        className="absolute left-[52%] top-[44%] font-['WindSong',cursive] text-2xl font-normal leading-none text-[#3c0816] sm:text-3xl"
      >
        {and}
      </span>
    )}
    <img
      src="/images/wedding/name-nora.webp"
      alt=""
      className="absolute left-[58.77%] top-[58.27%] w-[41.23%]"
    />
  </h1>
);

export default WeddingNames;
