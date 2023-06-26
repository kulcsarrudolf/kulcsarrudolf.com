interface TitleProps {
  children: React.ReactNode;
  mb?: number;
}
const Title = ({ children, mb }: TitleProps) => {
  return (
    <h1
      className="text-2xl font-bold mb-2"
      style={{
        color: "#4267b2",
        marginBottom: mb ? `${mb}rem` : "1rem",
      }}
    >
      {children}
    </h1>
  );
};

export default Title;
