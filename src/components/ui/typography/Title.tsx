interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  mb?: number;
  /** The page's own title is the `h1`; a section within a page is an `h2`. */
  as?: "h1" | "h2";
}
const Title = ({ children, mb, as: Heading = "h1", ...props }: TitleProps) => {
  return (
    <Heading
      className="text-2xl font-bold mb-2 text-brand dark:text-brand-dark-accent"
      style={{ marginBottom: mb === undefined ? "1rem" : `${mb}rem` }}
      {...props}
    >
      {children}
    </Heading>
  );
};

export default Title;
