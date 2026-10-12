import { type FormEvent, useEffect, useId, useRef, useState } from "react";

import { useTranslation } from "@/i18n/useTranslation";

import { MAX_NAME_LENGTH } from "./highScores";
import MemoryDialog from "./MemoryDialog";
import type { Result } from "./useMemoryGame";
import { BEVEL_BUTTON } from "./win";

interface MemoryWonProps {
  result: Result;
  /** Whether the result earns a place on the high score list, and so asks for a name. */
  record: boolean;
  /** The name typed last time, offered again. */
  defaultName: string;
  /** Answered: with the name to put on the list, when there is a place on it. */
  onDone: (name?: string) => void;
}

/**
 * What a cleared board says: how long it took and how many pairs, and, for a
 * result good enough for the list, a box for the name to put on it.
 */
const MemoryWon = ({ result, record, defaultName, onDone }: MemoryWonProps) => {
  const { t } = useTranslation();
  const inputId = useId();
  const [name, setName] = useState(defaultName);
  const inputRef = useRef<HTMLInputElement>(null);

  // The dialog opened to ask for the name, so the caret starts in the box.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const done = () => {
    if (!record) return onDone();
    onDone(name.trim() || (t("memory.won.anonymous") as string));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    done();
  };

  return (
    <MemoryDialog
      title={t("memory.won.title") as string}
      onDismiss={done}
      keepFocus={record}
      actions={
        <button
          type="submit"
          form={record ? inputId : undefined}
          onClick={record ? undefined : done}
          className={`${BEVEL_BUTTON} min-w-20 px-4 py-1`}
        >
          {t("memory.ok")}
        </button>
      }
    >
      <p>
        {t("memory.won.result", {
          seconds: String(result.seconds),
          pairs: String(result.pairs),
        })}
      </p>
      {record && (
        <form id={inputId} onSubmit={onSubmit} className="flex flex-col gap-2">
          <label htmlFor={`${inputId}-name`}>{t("memory.won.record")}</label>
          <input
            id={`${inputId}-name`}
            value={name}
            maxLength={MAX_NAME_LENGTH}
            autoComplete="nickname"
            ref={inputRef}
            onChange={(event) => setName(event.target.value)}
            onFocus={(event) => event.target.select()}
            className="border border-black px-2 py-1 font-normal shadow-[inset_1px_1px_0_var(--color-win-gray)] focus:outline-hidden"
          />
        </form>
      )}
    </MemoryDialog>
  );
};

export default MemoryWon;
