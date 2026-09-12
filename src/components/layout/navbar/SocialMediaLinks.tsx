import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { SocialMediaLink } from "./types";

import { SOCIAL_MEDIA } from "./navbar-links";

interface SocialMediaLinksProps {
  /** `sm` sits behind the divider in the bar; `md` is the menu sheet. */
  size?: "sm" | "md";
  tone?: "onBrand" | "onSurface";
  /** Give each icon a 44px target. Used wherever the icons are tapped. */
  padded?: boolean;
  className?: string;
}

const SocialMediaLinks = ({
  size = "sm",
  tone = "onBrand",
  padded = false,
  className = "",
}: SocialMediaLinksProps) => (
  <div className={`flex items-center ${size === "sm" ? "gap-3.5" : "gap-5"} ${className}`}>
    {SOCIAL_MEDIA.map((socialMedia: SocialMediaLink) => (
      <a
        key={socialMedia.title}
        href={socialMedia.href}
        target="_blank"
        rel="noopener noreferrer"
        // Icon-only links have no text, so without this they announce as
        // four empty links.
        aria-label={socialMedia.title}
        title={socialMedia.title}
        className={`flex items-center justify-center rounded transition-opacity hover:opacity-75 ${
          padded ? "h-11 w-11" : ""
        } ${tone === "onBrand" ? "text-white" : "text-brand dark:text-brand-dark-accent"}`}
      >
        <FontAwesomeIcon
          icon={socialMedia.icon}
          className={size === "sm" ? "text-lg" : "text-2xl"}
        />
      </a>
    ))}
  </div>
);

export default SocialMediaLinks;
