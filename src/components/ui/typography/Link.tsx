import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";

type LinkProps = {
  href: string;
  children: React.ReactNode;
};

// Underlined at rest, not only on hover: these links sit inside running text
// in a grey close to the brand, so colour alone does not set them apart.
const Link = ({ href, children }: LinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-brand underline decoration-1 underline-offset-2 hover:decoration-2 dark:text-brand-dark-accent"
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
