const Paragraph = ({ children }: any) => {
  return (
    <p
      className="mb-4"
      style={{
        lineHeight: "2.0rem",
      }}
    >
      {children}
    </p>
  );
};

export default Paragraph;
