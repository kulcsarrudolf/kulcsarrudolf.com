import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export const Link = ({
  href,
  children,
  className = "hover:underline",
}: LinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`text-brand ${className}`}
    >
      {children}
      <FontAwesomeIcon
        icon={faExternalLink}
        className="ml-1"
        style={{ fontSize: "0.75em", verticalAlign: "baseline" }}
      />
    </a>
  );
};

export default Link;
