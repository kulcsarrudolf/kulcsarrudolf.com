interface ParagraphProps {
  children: React.ReactNode;
}

const Paragraph = ({ children }: ParagraphProps) => {
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
