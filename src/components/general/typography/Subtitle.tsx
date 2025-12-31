interface SubtitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}
const Subtitle = ({ children, ...props }: SubtitleProps) => {
  return (
    <h1
      className="text-xl mb-2"
      style={{
        color: "#4267b2",
      }}
      {...props}
    >
      {children}
    </h1>
  );
};

export default Subtitle;
