"use client";

import { useCallback, useEffect, useState } from "react";
import { makePuzzle, solvePuzzle, type Board } from "@/lib/sudoku";
import SudokuCell from "./SudokuCell";
import { useTranslation } from "@/i18n/useTranslation";

const MAX_MISTAKES = 5;

interface SudokuProps {
  onClose: () => void;
}

const Sudoku = ({ onClose }: SudokuProps) => {
  const { t } = useTranslation();
  const [puzzle, setPuzzle] = useState<Board | null>(null);
  const [solution, setSolution] = useState<Board | null>(null);
  const [userBoard, setUserBoard] = useState<Board>([]);
  const [originalCells, setOriginalCells] = useState<Set<number>>(new Set());
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shakingCell, setShakingCell] = useState<number | null>(null);

  const initGame = useCallback(() => {
    const newPuzzle = makePuzzle();
    const newSolution = solvePuzzle(newPuzzle);

    const originals = new Set<number>();
    newPuzzle.forEach((val, idx) => {
      if (val !== null) {
        originals.add(idx);
      }
    });

    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setUserBoard([...newPuzzle]);
    setOriginalCells(originals);
    setSelectedCell(null);
    setMistakes(0);
    setGameOver(false);
    setWon(false);
    setShakingCell(null);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCellClick = (index: number) => {
    if (gameOver) return;
    setSelectedCell(index);
  };

  const handleNumberInput = useCallback(
    (num: number) => {
      if (selectedCell === null || gameOver || !solution) return;
      if (originalCells.has(selectedCell)) return;
      if (userBoard[selectedCell] !== null) return; // Already filled

      const correctValue = solution[selectedCell];

      if (num === correctValue) {
        const newBoard = [...userBoard];
        newBoard[selectedCell] = num;
        setUserBoard(newBoard);

        // Check for win
        const isComplete = newBoard.every(
          (val, idx) => val === solution[idx]
        );
        if (isComplete) {
          setWon(true);
          setGameOver(true);
        }
      } else {
        // Wrong answer - trigger shake animation
        setShakingCell(selectedCell);
        setTimeout(() => setShakingCell(null), 500);

        const newMistakes = mistakes + 1;
        setMistakes(newMistakes);

        if (newMistakes >= MAX_MISTAKES) {
          setUserBoard([...solution]);
          setGameOver(true);
        }
      }
    },
    [selectedCell, gameOver, solution, originalCells, userBoard, mistakes]
  );

  const handleClear = useCallback(() => {
    if (selectedCell === null || gameOver || !puzzle) return;
    if (originalCells.has(selectedCell)) return;

    const newBoard = [...userBoard];
    newBoard[selectedCell] = puzzle[selectedCell];
    setUserBoard(newBoard);
  }, [selectedCell, gameOver, puzzle, originalCells, userBoard]);

  // Keyboard input handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      // Number keys 1-9
      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        const num = parseInt(e.key) - 1;
        handleNumberInput(num);
        return;
      }

      // Backspace or Delete to clear
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        handleClear();
        return;
      }

      // Arrow keys for navigation
      if (selectedCell !== null) {
        const row = Math.floor(selectedCell / 9);
        const col = selectedCell % 9;
        let newCell = selectedCell;

        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            if (row > 0) newCell = selectedCell - 9;
            break;
          case "ArrowDown":
            e.preventDefault();
            if (row < 8) newCell = selectedCell + 9;
            break;
          case "ArrowLeft":
            e.preventDefault();
            if (col > 0) newCell = selectedCell - 1;
            break;
          case "ArrowRight":
            e.preventDefault();
            if (col < 8) newCell = selectedCell + 1;
            break;
          case "Escape":
            e.preventDefault();
            setSelectedCell(null);
            return;
        }

        if (newCell !== selectedCell) {
          setSelectedCell(newCell);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, gameOver, handleClear, handleNumberInput]);

  // Count occurrences of each number (1-9) on the board
  const getNumberCounts = useCallback(() => {
    const counts = new Map<number, number>();
    for (let i = 0; i < 9; i++) {
      counts.set(i, 0);
    }
    userBoard.forEach((val) => {
      if (val !== null) {
        counts.set(val, (counts.get(val) || 0) + 1);
      }
    });
    return counts;
  }, [userBoard]);

  const numberCounts = getNumberCounts();

  // Get highlighting info for a cell
  const getCellHighlighting = (index: number) => {
    if (selectedCell === null) {
      return { isHighlighted: false, isSameNumber: false };
    }

    const selectedRow = Math.floor(selectedCell / 9);
    const selectedCol = selectedCell % 9;
    const selectedBoxRow = Math.floor(selectedRow / 3);
    const selectedBoxCol = Math.floor(selectedCol / 3);

    const cellRow = Math.floor(index / 9);
    const cellCol = index % 9;
    const cellBoxRow = Math.floor(cellRow / 3);
    const cellBoxCol = Math.floor(cellCol / 3);

    // Check if same row, column, or 3x3 box
    const isHighlighted =
      cellRow === selectedRow ||
      cellCol === selectedCol ||
      (cellBoxRow === selectedBoxRow && cellBoxCol === selectedBoxCol);

    // Check if same number (and not empty)
    const selectedValue = userBoard[selectedCell];
    const cellValue = userBoard[index];
    const isSameNumber =
      selectedValue !== null &&
      cellValue !== null &&
      selectedValue === cellValue &&
      index !== selectedCell;

    return { isHighlighted, isSameNumber };
  };

  if (!puzzle || !solution) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">{t("sudoku.loading")}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="text-sm text-gray-600">
          {t("sudoku.mistakes")}:{" "}
          <span
            className={
              mistakes >= MAX_MISTAKES ? "text-red-500 font-bold" : ""
            }
          >
            {mistakes}/{MAX_MISTAKES}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          &times;
        </button>
      </div>

      {/* Game status */}
      {gameOver && (
        <div
          className={`text-center font-bold ${
            won ? "text-green-600" : "text-red-500"
          }`}
        >
          {won ? t("sudoku.won") : t("sudoku.lost")}
        </div>
      )}

      {/* Board */}
      <div className="grid grid-cols-9 gap-0 border-2 border-gray-800">
        {userBoard.map((value, index) => {
          const row = Math.floor(index / 9);
          const col = index % 9;

          // Add thicker borders for 3x3 boxes
          const borderRight =
            col === 2 || col === 5 ? "border-r-2 border-r-gray-800" : "";
          const borderBottom =
            row === 2 || row === 5 ? "border-b-2 border-b-gray-800" : "";

          const { isHighlighted, isSameNumber } = getCellHighlighting(index);

          return (
            <div key={index} className={`${borderRight} ${borderBottom}`}>
              <SudokuCell
                value={value}
                isOriginal={originalCells.has(index)}
                isSelected={selectedCell === index}
                isHighlighted={isHighlighted}
                isSameNumber={isSameNumber}
                isShaking={shakingCell === index}
                isRevealed={gameOver && !won && !originalCells.has(index)}
                onClick={() => handleCellClick(index)}
              />
            </div>
          );
        })}
      </div>

      {/* Number pad */}
      {!gameOver && (
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
            const count = numberCounts.get(num) || 0;
            const isComplete = count >= 9;
            return (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                disabled={selectedCell === null || isComplete}
                className={`w-10 h-10 rounded-lg font-bold disabled:cursor-not-allowed ${
                  isComplete
                    ? "bg-green-200 text-green-600 opacity-50"
                    : selectedCell === null
                      ? "bg-gray-300 text-gray-500"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {num + 1}
              </button>
            );
          })}
          <button
            onClick={handleClear}
            disabled={selectedCell === null}
            className="w-10 h-10 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t("sudoku.clear")}
          </button>
        </div>
      )}

      {/* New game button */}
      <button
        onClick={initGame}
        className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
      >
        {t("sudoku.newGame")}
      </button>
    </div>
  );
};

export default Sudoku;
