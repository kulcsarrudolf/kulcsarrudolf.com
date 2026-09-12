interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  mb?: number;
}
const Title = ({ children, mb, ...props }: TitleProps) => {
  return (
    <h1
      className="text-2xl font-bold mb-2 text-brand dark:text-brand-on-dark"
      style={{ marginBottom: mb === undefined ? "1rem" : `${mb}rem` }}
      {...props}
    >
      {children}
    </h1>
  );
};

export default Title;
