interface LanguageBadgeProps {
  lang?: string;
}

/**
 * The `[HU]` marker in front of a Hungarian post or project title. English is
 * the site's default, so it goes unmarked and this renders nothing, which is
 * also why it returns null rather than an empty span: the trailing margin
 * should only exist when there is a badge to separate from the title.
 */
const LanguageBadge = ({ lang }: LanguageBadgeProps) => {
  if (lang !== "hu") {
    return null;
  }

  return <span className="mr-1 text-brand">[HU]</span>;
};

export default LanguageBadge;
