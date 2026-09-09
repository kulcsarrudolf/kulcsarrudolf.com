import type { Board } from "@/lib/sudoku";

import SudokuCell from "./SudokuCell";
import { SIZE, type CellHighlighting } from "./useSudokuGame";

interface SudokuBoardProps {
  board: Board;
  originalCells: Set<number>;
  selectedCell: number | null;
  shakingCell: number | null;
  /** The board is revealed once the player has run out of mistakes. */
  isRevealed: boolean;
  highlightingFor: (index: number) => CellHighlighting;
  onSelect: (index: number) => void;
}

// Thicker rules after the third and sixth cell mark out the 3x3 boxes.
const boxBorders = (index: number) => {
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;
  const right = col === 2 || col === 5 ? "border-r-2 border-r-gray-800" : "";
  const bottom = row === 2 || row === 5 ? "border-b-2 border-b-gray-800" : "";
  return `${right} ${bottom}`;
};

const SudokuBoard = ({
  board,
  originalCells,
  selectedCell,
  shakingCell,
  isRevealed,
  highlightingFor,
  onSelect,
}: SudokuBoardProps) => (
  <div className="grid grid-cols-9 gap-0 border-2 border-gray-800">
    {board.map((value, index) => {
      const { isHighlighted, isSameNumber } = highlightingFor(index);

      return (
        <div key={index} className={boxBorders(index)}>
          <SudokuCell
            value={value}
            isOriginal={originalCells.has(index)}
            isSelected={selectedCell === index}
            isHighlighted={isHighlighted}
            isSameNumber={isSameNumber}
            isShaking={shakingCell === index}
            isRevealed={isRevealed && !originalCells.has(index)}
            onClick={() => onSelect(index)}
          />
        </div>
      );
    })}
  </div>
);

export default SudokuBoard;
