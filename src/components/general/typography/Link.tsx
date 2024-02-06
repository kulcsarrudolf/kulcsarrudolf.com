type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export const Link = ({
  href,
  children,
  className = "text-blue-500 hover:underline font-bold",
}: LinkProps) => {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
};

export default Link;
