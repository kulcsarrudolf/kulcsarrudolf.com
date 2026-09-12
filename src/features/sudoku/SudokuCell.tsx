interface SudokuCellProps {
  value: number | null;
  isOriginal: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isSameNumber: boolean;
  isShaking: boolean;
  isRevealed: boolean;
  onClick: () => void;
}

const SudokuCell = ({
  value,
  isOriginal,
  isSelected,
  isHighlighted,
  isSameNumber,
  isShaking,
  isRevealed,
  onClick,
}: SudokuCellProps) => {
  const displayValue = value !== null ? value + 1 : "";

  let bgColor = "bg-white dark:bg-card-dark";
  let textColor = "text-gray-800 dark:text-gray-200";

  // Background priority: selected > same number > highlighted > default
  if (isSelected) {
    bgColor = "bg-brand/40 dark:bg-brand-on-dark/35";
  } else if (isSameNumber) {
    bgColor = "bg-brand/25 dark:bg-brand-on-dark/20";
  } else if (isHighlighted) {
    bgColor = "bg-brand/5 dark:bg-brand-on-dark/10";
  }

  // Text color
  if (isOriginal) {
    textColor = "text-gray-900 font-bold dark:text-gray-100";
  } else if (value !== null) {
    textColor = "text-brand dark:text-brand-on-dark";
  }

  if (isRevealed && !isOriginal) {
    textColor = "text-green-600 dark:text-green-400";
    bgColor = "bg-green-50 dark:bg-green-950/40";
  }

  return (
    <button
      className={`w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 dark:border-line-dark flex items-center justify-center text-sm sm:text-base transition-colors ${bgColor} ${textColor} ${
        !isRevealed ? "cursor-pointer" : ""
      } ${isShaking ? "animate-shake" : ""}`}
      onClick={onClick}
    >
      {displayValue}
    </button>
  );
};

export default SudokuCell;
