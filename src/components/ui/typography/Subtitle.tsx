interface SubtitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}
const Subtitle = ({ children, ...props }: SubtitleProps) => {
  return (
    <h1 className="text-xl mb-2 text-brand dark:text-brand-on-dark" {...props}>
      {children}
    </h1>
  );
};

export default Subtitle;
