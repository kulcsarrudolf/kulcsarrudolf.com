const Subtitle = ({ children }: any) => {
  return (
    <h1
      className="text-xl mb-2"
      style={{
        color: "#4267b2",
      }}
    >
      {children}
    </h1>
  );
};

export default Subtitle;
