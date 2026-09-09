interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  mb?: number;
}
const Title = ({ children, mb, ...props }: TitleProps) => {
  return (
    <h1
      className="text-2xl font-bold mb-2"
      style={{
        color: "#4267b2",
        marginBottom: mb === undefined ? "1rem" : `${mb}rem`,
      }}
      {...props}
    >
      {children}
    </h1>
  );
};

export default Title;
