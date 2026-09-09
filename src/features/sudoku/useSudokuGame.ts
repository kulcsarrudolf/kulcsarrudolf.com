import { useCallback, useEffect, useMemo, useState } from "react";

import { makePuzzle, solvePuzzle, type Board } from "@/features/sudoku/engine";

export const MAX_MISTAKES = 5;
export const SIZE = 9;

/** Which cells share a row, a column or a box with the selected one. */
export interface CellHighlighting {
  isHighlighted: boolean;
  isSameNumber: boolean;
}

const rowOf = (index: number) => Math.floor(index / SIZE);
const colOf = (index: number) => index % SIZE;
const boxOf = (index: number) => `${Math.floor(rowOf(index) / 3)}-${Math.floor(colOf(index) / 3)}`;

/**
 * The whole game: the puzzle, the player's board, the clock, and the keyboard.
 * The components below it only draw what this returns.
 */
export function useSudokuGame() {
  const [puzzle, setPuzzle] = useState<Board | null>(null);
  const [solution, setSolution] = useState<Board | null>(null);
  const [userBoard, setUserBoard] = useState<Board>([]);
  const [originalCells, setOriginalCells] = useState<Set<number>>(new Set());
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shakingCell, setShakingCell] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

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
    setElapsedSeconds(0);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver]);

  const selectCell = (index: number) => {
    if (gameOver) return;
    setSelectedCell(index);
  };

  const enterNumber = useCallback(
    (num: number) => {
      if (selectedCell === null || gameOver || !solution) return;
      if (originalCells.has(selectedCell)) return;
      if (userBoard[selectedCell] !== null) return; // Already filled

      if (num === solution[selectedCell]) {
        const newBoard = [...userBoard];
        newBoard[selectedCell] = num;
        setUserBoard(newBoard);

        if (newBoard.every((val, idx) => val === solution[idx])) {
          setWon(true);
          setGameOver(true);
        }
        return;
      }

      // Wrong answer - trigger shake animation
      setShakingCell(selectedCell);
      setTimeout(() => setShakingCell(null), 500);

      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);

      if (newMistakes >= MAX_MISTAKES) {
        setUserBoard([...solution]);
        setGameOver(true);
      }
    },
    [selectedCell, gameOver, solution, originalCells, userBoard, mistakes],
  );

  const clearCell = useCallback(() => {
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
        enterNumber(parseInt(e.key) - 1);
        return;
      }

      // Backspace or Delete to clear
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        clearCell();
        return;
      }

      // Arrow keys for navigation
      if (selectedCell === null) return;

      const row = rowOf(selectedCell);
      const col = colOf(selectedCell);
      let newCell = selectedCell;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (row > 0) newCell = selectedCell - SIZE;
          break;
        case "ArrowDown":
          e.preventDefault();
          if (row < SIZE - 1) newCell = selectedCell + SIZE;
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (col > 0) newCell = selectedCell - 1;
          break;
        case "ArrowRight":
          e.preventDefault();
          if (col < SIZE - 1) newCell = selectedCell + 1;
          break;
        case "Escape":
          e.preventDefault();
          setSelectedCell(null);
          return;
      }

      if (newCell !== selectedCell) {
        setSelectedCell(newCell);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, gameOver, clearCell, enterNumber]);

  // How often each number (0-8, drawn as 1-9) is already on the board, so the
  // pad can retire a number once all nine of it are placed.
  const numberCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (let i = 0; i < SIZE; i++) {
      counts.set(i, 0);
    }
    userBoard.forEach((val) => {
      if (val !== null) {
        counts.set(val, (counts.get(val) || 0) + 1);
      }
    });
    return counts;
  }, [userBoard]);

  const highlightingFor = (index: number): CellHighlighting => {
    if (selectedCell === null) {
      return { isHighlighted: false, isSameNumber: false };
    }

    const isHighlighted =
      rowOf(index) === rowOf(selectedCell) ||
      colOf(index) === colOf(selectedCell) ||
      boxOf(index) === boxOf(selectedCell);

    const selectedValue = userBoard[selectedCell];
    const cellValue = userBoard[index];
    const isSameNumber =
      selectedValue !== null &&
      cellValue !== null &&
      selectedValue === cellValue &&
      index !== selectedCell;

    return { isHighlighted, isSameNumber };
  };

  return {
    ready: Boolean(puzzle && solution),
    userBoard,
    originalCells,
    selectedCell,
    mistakes,
    gameOver,
    won,
    shakingCell,
    elapsedSeconds,
    numberCounts,
    highlightingFor,
    selectCell,
    enterNumber,
    clearCell,
    initGame,
  };
}
