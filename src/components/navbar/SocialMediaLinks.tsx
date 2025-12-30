import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SocialMediaLink from "@/types/social-media-link";
import { SOCIAL_MEDIA } from "./navber-links";

interface SocialMediaLinksProps {
  iconClassName?: string;
}

export const SocialMediaLinks = ({
  iconClassName = "ml-4",
}: SocialMediaLinksProps) => {
  return (
    <>
      {SOCIAL_MEDIA.map((socialMedia: SocialMediaLink) => (
        <a key={socialMedia.title} href={socialMedia.href} target="_blank">
          <FontAwesomeIcon
            icon={socialMedia.icon}
            className={`${iconClassName} text-white text-2xl`}
          />
        </a>
      ))}
    </>
  );
};
export default SocialMediaLinks;
