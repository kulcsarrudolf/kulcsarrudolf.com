import { SIZE } from "./useSudokuGame";

interface SudokuNumberPadProps {
  /** How often each number is already on the board, keyed 0-8. */
  numberCounts: Map<number, number>;
  /** Nothing can be entered until a cell is picked, so the pad greys out. */
  hasSelection: boolean;
  onEnter: (num: number) => void;
  onClear: () => void;
  clearLabel: string;
}

const NUMBERS = Array.from({ length: SIZE }, (_, index) => index);

const KEY = "w-10 h-10 rounded-lg disabled:cursor-not-allowed";

const SudokuNumberPad = ({
  numberCounts,
  hasSelection,
  onEnter,
  onClear,
  clearLabel,
}: SudokuNumberPadProps) => (
  <div className="grid grid-cols-5 gap-2">
    {NUMBERS.map((num) => {
      // All nine placed: the number is spent, so it retires rather than
      // letting the player spend a mistake on it.
      const isComplete = (numberCounts.get(num) || 0) >= SIZE;

      return (
        <button
          key={num}
          onClick={() => onEnter(num)}
          disabled={!hasSelection || isComplete}
          className={`${KEY} font-bold ${
            isComplete
              ? "bg-green-200 text-green-600 opacity-50 dark:bg-green-900/50 dark:text-green-400"
              : hasSelection
                ? "bg-brand text-white hover:bg-brand-hover"
                : "bg-gray-300 text-gray-500 dark:bg-fill-dark dark:text-gray-500"
          }`}
        >
          {num + 1}
        </button>
      );
    })}
    <button
      onClick={onClear}
      disabled={!hasSelection}
      className={`${KEY} bg-gray-500 text-white text-xs hover:bg-gray-600 disabled:bg-gray-300 dark:disabled:bg-fill-dark`}
    >
      {clearLabel}
    </button>
  </div>
);

export default SudokuNumberPad;
