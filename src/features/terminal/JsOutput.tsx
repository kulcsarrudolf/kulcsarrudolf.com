import type { JsLine, JsTone } from "./jsConsole";

interface JsOutputProps {
  lines: JsLine[];
}

// The terminal is dark in both themes, so the colours need no dark partner.
const TONES: Record<JsTone, string> = {
  log: "text-gray-300",
  info: "text-gray-300",
  warn: "text-yellow-300",
  error: "text-red-400",
  result: "text-white",
};

/**
 * What a line typed at the `js` console printed: its logs in order, then what
 * it came to, each kept on its own row and wrapped wherever it has to be.
 */
const JsOutput = ({ lines }: JsOutputProps) => (
  <div className="flex flex-col pl-[34px]">
    {lines.map(({ tone, text }, index) => (
      <p key={index} className={`whitespace-pre-wrap break-all ${TONES[tone]}`}>
        {tone === "result" && (
          <span className="text-gray-500" aria-hidden="true">
            {"← "}
          </span>
        )}
        {text}
      </p>
    ))}
  </div>
);

export default JsOutput;
