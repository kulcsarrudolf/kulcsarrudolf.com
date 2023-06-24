const Title = ({ children }: any) => {
  return (
    <h1
      className="text-2xl font-bold mb-2"
      style={{
        color: "#4267b2",
      }}
    >
      {children}
    </h1>
  );
};

export default Title;
