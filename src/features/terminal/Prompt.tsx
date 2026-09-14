interface PromptProps {
  /** A question asked in place of the shell's own prompt, such as `name:`. */
  label?: string;
}

/** The shell prompt, hidden from screen readers: it is decoration around the line. */
const Prompt = ({ label }: PromptProps) => (
  <span className="shrink-0 text-brand-on-dark" aria-hidden="true">
    {label ?? "~ $"}
  </span>
);

export default Prompt;
