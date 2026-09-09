interface HighlightPProps {
  children: React.ReactNode;
}

const HighlightP = ({ children }: HighlightPProps) => {
  return (
    <span className="text-brand" style={{ borderRadius: "0.25rem", lineHeight: "2.0rem" }}>
      {children}
    </span>
  );
};

export default HighlightP;
