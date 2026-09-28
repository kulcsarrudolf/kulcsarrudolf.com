import type { MouseEvent } from "react";

import type { Candidate } from "./autocomplete";

interface SuggestionsProps {
  /** The listbox's id, which the prompt names as what it controls. */
  id: string;
  label: string;
  candidates: Candidate[];
  /** Which candidate is on the line. */
  selected: number;
  /** What the selected candidate is, in a few words. */
  description: string;
  onPick: (index: number) => void;
}

// As with the suggestion itself, a press must not take the caret from the prompt.
const keepFocus = (event: MouseEvent) => event.preventDefault();

/** The id of one candidate, for the prompt to name as the active one. */
export const optionId = (id: string, index: number) => `${id}-${index}`;

/**
 * The row of candidates under the prompt, once Tab has more than one to walk
 * through. The one on the line is lit, with a few words on what it is, and a
 * line from the visitor's own history is marked as theirs. Indented to sit
 * under what is typed, like everything the terminal prints.
 */
const Suggestions = ({
  id,
  label,
  candidates,
  selected,
  description,
  onPick,
}: SuggestionsProps) => (
  <div className="flex flex-col gap-1 pl-[34px] text-[13px] leading-[1.6]">
    <div id={id} role="listbox" aria-label={label} className="-ml-2 flex flex-wrap gap-x-1 gap-y-1">
      {candidates.map(({ value, source }, index) => (
        <button
          key={value}
          id={optionId(id, index)}
          type="button"
          role="option"
          aria-selected={index === selected}
          tabIndex={-1}
          className={`max-w-full cursor-pointer truncate whitespace-pre rounded px-2 font-mono transition-colors ${
            index === selected
              ? "bg-white/15 text-white"
              : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
          }`}
          onMouseDown={keepFocus}
          onClick={() => onPick(index)}
        >
          {source === "history" && (
            <span className="mr-1.5 text-brand-on-dark" aria-hidden="true">
              ↺
            </span>
          )}
          {value}
        </button>
      ))}
    </div>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default Suggestions;
