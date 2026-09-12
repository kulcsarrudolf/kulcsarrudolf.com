import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";

type LinkProps = {
  href: string;
  children: React.ReactNode;
};

const Link = ({ href, children }: LinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-brand hover:underline dark:text-brand-dark-accent"
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
