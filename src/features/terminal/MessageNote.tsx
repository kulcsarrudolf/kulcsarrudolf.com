import { Fragment, type ReactNode } from "react";

import { useTranslation } from "@/i18n/useTranslation";

import type { MessageNote as Note } from "./sendMessage";

interface MessageNoteProps {
  note: Note;
}

const TONES = {
  plain: "text-gray-300",
  success: "text-green-400",
  error: "text-red-400",
};

const SUMMARY_FIELDS = ["name", "email", "website", "message"] as const;

/** One line of output, indented under the prompt like a real shell's. */
const Line = ({ tone = "plain", children }: { tone?: keyof typeof TONES; children: ReactNode }) => (
  <p className={`pl-[34px] text-pretty ${TONES[tone]}`}>{children}</p>
);

/**
 * What `send-message` prints between its questions: why an answer was not
 * taken, the message read back before it goes, and how the sending went.
 * The terminal is dark in both themes, so the colours need no dark partner.
 */
const MessageNote = ({ note }: MessageNoteProps) => {
  const { t } = useTranslation();

  switch (note.kind) {
    case "summary":
      return (
        <div className="pl-[34px] text-gray-300">
          <p>{t("terminal.message.summary")}</p>
          <dl className="mt-1 grid grid-cols-[auto_minmax(0,1fr)] gap-x-2.5">
            {SUMMARY_FIELDS.filter((field) => note.draft[field]).map((field) => (
              <Fragment key={field}>
                <dt className="text-brand-on-dark">{t(`contact.form.${field}`)}</dt>
                <dd className="break-words text-white">{note.draft[field]}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      );
    case "invalid":
      return <Line tone="error">{t(`terminal.message.invalid.${note.field}`)}</Line>;
    case "sent":
      return <Line tone="success">{t("terminal.message.sent")}</Line>;
    case "failed":
      return <Line tone="error">{t("terminal.message.failed")}</Line>;
    case "gaveUp":
      return <Line>{t("terminal.message.gaveUp", { email: t("contact.email") as string })}</Line>;
    case "yesNo":
    case "discarded":
      return <Line>{t(`terminal.message.${note.kind}`)}</Line>;
  }
};

export default MessageNote;
