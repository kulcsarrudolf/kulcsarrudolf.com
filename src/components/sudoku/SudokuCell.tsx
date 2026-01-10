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

  let bgColor = "bg-white";
  let textColor = "text-gray-800";

  // Background priority: selected > same number > highlighted > default
  if (isSelected) {
    bgColor = "bg-blue-300";
  } else if (isSameNumber) {
    bgColor = "bg-blue-200";
  } else if (isHighlighted) {
    bgColor = "bg-blue-50";
  }

  // Text color
  if (isOriginal) {
    textColor = "text-gray-900 font-bold";
  } else if (value !== null) {
    textColor = "text-blue-600";
  }

  if (isRevealed && !isOriginal) {
    textColor = "text-green-600";
    bgColor = "bg-green-50";
  }

  return (
    <button
      className={`w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 flex items-center justify-center text-sm sm:text-base transition-colors ${bgColor} ${textColor} ${
        !isRevealed ? "cursor-pointer" : ""
      } ${isShaking ? "animate-shake" : ""}`}
      onClick={onClick}
    >
      {displayValue}
    </button>
  );
};

export default SudokuCell;
