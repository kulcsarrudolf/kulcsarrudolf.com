/**
 * One sprig from the invitation, twice: hanging into the top-left corner and
 * rising out of the bottom-right one. Wide screens only, since on a narrower
 * screen it would crowd the text. It sits behind the content and ignores the
 * pointer.
 *
 * The drawing's stem is at its bottom left, so the top copy is flipped
 * upside down and the bottom copy left to right.
 */
const SPRIG = "/images/wedding/sprig.webp";

const WeddingFlowers = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block"
  >
    <img
      src={SPRIG}
      alt=""
      className="absolute -left-12 -top-12 w-64 -scale-y-100 2xl:w-80 select-none"
    />
    <img
      src={SPRIG}
      alt=""
      className="absolute -bottom-12 -right-12 w-64 -scale-x-100 2xl:w-80 select-none"
    />
  </div>
);

export default WeddingFlowers;
