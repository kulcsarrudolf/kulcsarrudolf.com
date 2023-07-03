import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SocialMediaLink from "@/types/social-media-link";
import { SOCIAL_MEDIA } from "./navber-links";
import { useMediaQuery } from "react-responsive";

export const SocialMediaLinks = () => {
  const isMobileView = useMediaQuery({ maxWidth: 450 });

  if (isMobileView) return null;

  return (
    <>
      {SOCIAL_MEDIA.map((socialMedia: SocialMediaLink) => (
        <a key={socialMedia.title} href={socialMedia.href} target="_blank">
          <FontAwesomeIcon
            icon={socialMedia.icon}
            className="ml-4 text-white text-2xl"
          />
        </a>
      ))}
    </>
  );
};
export default SocialMediaLinks;
