import { useTranslation } from "@/i18n/useTranslation";

import SudokuBoard from "./SudokuBoard";
import SudokuNumberPad from "./SudokuNumberPad";
import useSudokuGame, { MAX_MISTAKES } from "./useSudokuGame";

interface SudokuProps {
  onClose: () => void;
}

// The two game buttons differ only in colour, so the shape is written once.
const GAME_BUTTON = "px-4 py-2 text-white rounded-lg font-semibold";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Sudoku = ({ onClose }: SudokuProps) => {
  const { t } = useTranslation();
  const game = useSudokuGame();

  if (!game.ready) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">{t("sudoku.loading")}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full">
        <div className="text-sm text-gray-600">
          {t("sudoku.mistakes")}:{" "}
          <span
            className={
              game.mistakes >= MAX_MISTAKES ? "text-red-500 font-bold" : ""
            }
          >
            {game.mistakes}/{MAX_MISTAKES}
          </span>
        </div>
        <div className="text-sm text-gray-600 font-mono">
          {formatTime(game.elapsedSeconds)}
        </div>
      </div>

      {game.gameOver && (
        <div
          className={`text-center font-bold ${
            game.won ? "text-green-600" : "text-red-500"
          }`}
        >
          {game.won ? t("sudoku.won") : t("sudoku.lost")}
        </div>
      )}

      <SudokuBoard
        board={game.userBoard}
        originalCells={game.originalCells}
        selectedCell={game.selectedCell}
        shakingCell={game.shakingCell}
        isRevealed={game.gameOver && !game.won}
        highlightingFor={game.highlightingFor}
        onSelect={game.selectCell}
      />

      {!game.gameOver && (
        <SudokuNumberPad
          numberCounts={game.numberCounts}
          hasSelection={game.selectedCell !== null}
          onEnter={game.enterNumber}
          onClear={game.clearCell}
          clearLabel={t("sudoku.clear") as string}
        />
      )}

      <div className="flex gap-2">
        <button
          onClick={game.initGame}
          className={`${GAME_BUTTON} bg-green-500 hover:bg-green-600`}
        >
          {t("sudoku.newGame")}
        </button>
        <button
          onClick={onClose}
          className={`${GAME_BUTTON} bg-gray-500 hover:bg-gray-600`}
        >
          {t("sudoku.endGame")}
        </button>
      </div>
    </div>
  );
};

export default Sudoku;
