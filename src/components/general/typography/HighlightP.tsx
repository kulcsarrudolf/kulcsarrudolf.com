interface HighlightPProps {
  children: React.ReactNode;
}

const HighlightP = ({ children }: HighlightPProps) => {
  return (
    <span
      style={{
        borderRadius: "0.25rem",
        lineHeight: "2.0rem",
        color: "#4267b2",
      }}
    >
      {children}
    </span>
  );
};

export default HighlightP;
