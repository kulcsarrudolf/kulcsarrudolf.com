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
    <div className="flex items-center">
      {SOCIAL_MEDIA.map((socialMedia: SocialMediaLink) => (
        <a key={socialMedia.title} href={socialMedia.href} target="_blank" className="flex items-center">
          <FontAwesomeIcon
            icon={socialMedia.icon}
            className={`${iconClassName} text-white text-2xl`}
          />
        </a>
      ))}
    </div>
  );
};
export default SocialMediaLinks;
