/**
 * The four hand-drawn sprigs from the wedding invitation, one growing in from
 * each corner of the page. They sit behind the content and ignore the pointer.
 *
 * Each image's stem starts at its bottom edge, so the two top sprigs are
 * mirrored upside down to grow in from above.
 */
const SPRIGS = [
  {
    src: "/images/wedding/sprig-blossom.webp",
    className: "-left-10 -top-8 w-36 -scale-y-100 sm:-left-6 sm:w-72 lg:w-96",
  },
  {
    src: "/images/wedding/sprig-fan.webp",
    className: "-right-12 -top-10 w-36 -scale-y-100 sm:-right-8 sm:w-72 lg:w-96",
  },
  {
    src: "/images/wedding/sprig-rising.webp",
    className: "-bottom-6 -left-12 w-32 sm:-left-8 sm:w-64 lg:w-72",
  },
  {
    src: "/images/wedding/sprig-sweep.webp",
    className: "-bottom-4 -right-10 w-36 sm:-right-6 sm:w-64 lg:w-72",
  },
];

const WeddingFlowers = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    {SPRIGS.map((sprig) => (
      <img
        key={sprig.src}
        src={sprig.src}
        alt=""
        className={`absolute h-auto select-none ${sprig.className}`}
      />
    ))}
  </div>
);

export default WeddingFlowers;
