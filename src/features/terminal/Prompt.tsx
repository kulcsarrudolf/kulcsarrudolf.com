/** The shell prompt, hidden from screen readers: it is decoration around the line. */
const Prompt = () => (
  <span className="shrink-0 text-blue-300" aria-hidden="true">
    ~ $
  </span>
);

export default Prompt;
