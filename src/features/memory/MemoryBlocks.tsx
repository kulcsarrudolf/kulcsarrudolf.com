import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

import { useTranslation } from "@/i18n/useTranslation";

import { isMatch, SKILLS, type Skill } from "./engine";
import { placeOf, qualifies } from "./highScores";
import MemoryBoard from "./MemoryBoard";
import MemoryDialog from "./MemoryDialog";
import MemoryMenuBar, { type Menu } from "./MemoryMenuBar";
import MemoryScores from "./MemoryScores";
import MemoryStatusBar from "./MemoryStatusBar";
import MemoryTitleBar from "./MemoryTitleBar";
import MemoryWon from "./MemoryWon";
import { PICTURES } from "./pictures";
import { useHighScores } from "./useHighScores";
import { type Result, useMemoryGame } from "./useMemoryGame";
import { asText } from "./text";
import { BEVEL_BUTTON, SYSTEM_TEXT } from "./win";

type DialogKind = "howTo" | "about" | "scores" | "won";

interface MemoryBlocksProps {
  /** Closes the window: the control-menu box and Game, Exit. Without it, neither is offered. */
  onClose?: () => void;
  /** How big a board to deal first. */
  initialSkill?: Skill;
}

const OK = `${BEVEL_BUTTON} min-w-20 px-4 py-1`;

/**
 * Memory Blocks, the matching game from the Symantec Game Pack of 1991, as
 * the Windows 3.1 window it ran in: the title bar, the Game, Skill and Help
 * menus, the yellow blocks on the aqua board and the time and pairs along
 * the bottom. The window keeps its 1991 colours in both of the site's themes.
 *
 * Every pair of blocks with the same picture has to be found. A cleared board
 * is scored on its time and on the pairs it took, and the five best of each
 * skill are kept on this browser's high score list. F2 deals a new game, as
 * it did.
 */
const MemoryBlocks = ({ onClose, initialSkill = "intermediate" }: MemoryBlocksProps) => {
  const { t } = useTranslation();
  const [skill, setSkill] = useState<Skill>(initialSkill);
  const [dialog, setDialog] = useState<DialogKind | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [placed, setPlaced] = useState<number | undefined>();
  const highScores = useHighScores();
  const boardAreaRef = useRef<HTMLDivElement>(null);

  // An answered dialog hands the caret back to the board, rather than letting
  // it drop onto the page behind the window.
  const hadDialog = useRef(false);
  useEffect(() => {
    if (hadDialog.current && dialog === null) {
      boardAreaRef.current?.querySelector<HTMLElement>('button[tabindex="0"]')?.focus();
    }
    hadDialog.current = dialog !== null;
  }, [dialog]);

  const onCleared = useCallback((cleared: Result) => {
    setResult(cleared);
    setDialog("won");
  }, []);
  const game = useMemoryGame(onCleared, initialSkill);
  const { board, newGame } = game;

  const start = (next: Skill) => {
    setSkill(next);
    setPlaced(undefined);
    newGame(next);
  };

  const record = result !== null && qualifies(highScores.scores[result.skill], result);

  const answerWon = (name?: string) => {
    if (result && name !== undefined) {
      const score = { name, seconds: result.seconds, pairs: result.pairs };
      setPlaced(placeOf(highScores.scores[result.skill], score));
      highScores.add(result.skill, score);
      setDialog("scores");
    } else {
      setDialog(null);
    }
    newGame(skill);
  };

  const closeDialog = () => {
    setDialog(null);
    setPlaced(undefined);
  };

  const menus: Menu[] = [
    {
      id: "game",
      label: t("memory.menu.game") as string,
      entries: [
        { label: t("memory.menu.new") as string, shortcut: "F2", onSelect: () => start(skill) },
        { label: t("memory.menu.scores") as string, onSelect: () => setDialog("scores") },
        ...(onClose
          ? (["separator", { label: t("memory.menu.exit") as string, onSelect: onClose }] as const)
          : []),
      ],
    },
    {
      id: "skill",
      label: t("memory.menu.skill") as string,
      entries: SKILLS.map((each) => ({
        label: t(`memory.skill.${each}`) as string,
        checked: each === skill,
        onSelect: () => start(each),
      })),
    },
    {
      id: "help",
      label: t("memory.menu.help") as string,
      entries: [
        { label: t("memory.menu.howTo") as string, onSelect: () => setDialog("howTo") },
        { label: t("memory.menu.about") as string, onSelect: () => setDialog("about") },
      ],
    },
  ];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "F2" || dialog) return;
    event.preventDefault();
    start(skill);
  };

  // What a screen reader hears when a pair is turned over, since the
  // pictures themselves say nothing.
  const [first, second] = board.open;
  const nameOf = (index: number) =>
    t(`memory.pictures.${PICTURES[board.blocks[index].picture].id}`) as string;
  const announcement =
    second === undefined
      ? ""
      : isMatch(board)
        ? t("memory.match", { picture: nameOf(first) })
        : t("memory.miss", { first: nameOf(first), second: nameOf(second) });

  return (
    <div
      onKeyDown={onKeyDown}
      className={`relative flex h-full w-full select-none flex-col border-2 border-black bg-win-silver md:h-auto md:w-auto ${SYSTEM_TEXT}`}
    >
      <MemoryTitleBar
        title={t("memory.title") as string}
        onClose={onClose}
        closeLabel={t("memory.close") as string}
      />

      <div inert={dialog !== null} className="flex min-h-0 flex-1 flex-col">
        <MemoryMenuBar menus={menus} />
        <div
          ref={boardAreaRef}
          className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-win-aqua p-4 sm:p-6"
        >
          <MemoryBoard key={game.round} board={board} onFlip={game.flip} autoFocus />
        </div>
        <MemoryStatusBar seconds={game.seconds} pairs={board.pairsFlipped} />
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {dialog === "won" && result && (
        <MemoryWon
          result={result}
          record={record}
          defaultName={highScores.lastName}
          onDone={answerWon}
        />
      )}

      {dialog === "scores" && (
        <MemoryDialog
          title={asText(t("memory.scores.title", { skill: t(`memory.skill.${skill}`) as string }))}
          onDismiss={closeDialog}
          actions={
            <button type="button" onClick={closeDialog} className={OK}>
              {t("memory.ok")}
            </button>
          }
        >
          <MemoryScores scores={highScores.scores[skill]} highlight={placed} />
        </MemoryDialog>
      )}

      {dialog === "howTo" && (
        <MemoryDialog
          title={t("memory.howTo.title") as string}
          onDismiss={closeDialog}
          actions={
            <button type="button" onClick={closeDialog} className={OK}>
              {t("memory.ok")}
            </button>
          }
        >
          {(["deal", "flip", "goal", "score", "keys"] as const).map((key) => (
            <p key={key} className="font-normal">
              {t(`memory.howTo.${key}`)}
            </p>
          ))}
        </MemoryDialog>
      )}

      {dialog === "about" && (
        <MemoryDialog
          title={t("memory.about.title") as string}
          onDismiss={closeDialog}
          actions={
            <button type="button" onClick={closeDialog} className={OK}>
              {t("memory.ok")}
            </button>
          }
        >
          <div className="flex flex-col items-center gap-1 border border-black px-4 py-3 text-center">
            <p>{t("memory.title")}</p>
            <p>{t("memory.about.version")}</p>
            <p className="pt-2 font-normal">{t("memory.about.original")}</p>
            <p className="font-normal">{t("memory.about.port")}</p>
          </div>
        </MemoryDialog>
      )}
    </div>
  );
};

export default MemoryBlocks;
