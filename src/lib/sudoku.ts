// Sudoku Generator and Solver
// Based on David Bau's python implementation
// http://davidbau.com/archives/2006/09/04/sudoku_generator.html

type Board = (number | null)[];
type Entry = { pos: number; num: number };
type Guess = Entry[];
type SolveState = { guesses: Guess; count: number; board: Board }[];
type SolveResult = { state: SolveState; answer: Board | null };

function makepuzzle(board: Board): Board {
  const puzzle: Entry[] = [];
  const deduced: Board = Array(81).fill(null);
  const order = Array.from({ length: 81 }, (_, i) => i);
  shuffleArray(order);

  for (let i = 0; i < order.length; i++) {
    const pos = order[i];

    if (deduced[pos] === null) {
      puzzle.push({
        pos: pos,
        num: board[pos]!,
      });
      deduced[pos] = board[pos];
      deduce(deduced);
    }
  }

  shuffleArray(puzzle);

  for (let i = puzzle.length - 1; i >= 0; i--) {
    const e = puzzle[i];
    removeElement(puzzle, i);
    const rating = checkpuzzle(boardforentries(puzzle), board);

    if (rating === -1) {
      puzzle.push(e);
    }
  }

  return boardforentries(puzzle);
}

function checkpuzzle(puzzle: Board, board: Board | null = null): number {
  const tuple1 = solveboard(puzzle);

  if (tuple1.answer === null) {
    return -1;
  }

  if (board != null && !boardmatches(board, tuple1.answer)) {
    return -1;
  }

  const difficulty = tuple1.state.length;
  const tuple2 = solvenext(tuple1.state);

  if (tuple2.answer != null) {
    return -1;
  }

  return difficulty;
}

function solvepuzzle(board: Board): Board | null {
  return solveboard(board).answer;
}

function solveboard(original: Board): SolveResult {
  const board = [...original];
  const guesses = deduce(board);

  if (guesses === null) {
    return {
      state: [],
      answer: board,
    };
  }

  const track: SolveState = [
    {
      guesses: guesses,
      count: 0,
      board: board,
    },
  ];
  return solvenext(track);
}

function solvenext(remembered: SolveState): SolveResult {
  while (remembered.length > 0) {
    const tuple1 = remembered.pop()!;

    if (tuple1.count >= tuple1.guesses.length) {
      continue;
    }

    remembered.push({
      guesses: tuple1.guesses,
      count: tuple1.count + 1,
      board: tuple1.board,
    });

    const workspace = [...tuple1.board];
    const tuple2 = tuple1.guesses[tuple1.count];
    workspace[tuple2.pos] = tuple2.num;
    const guesses = deduce(workspace);

    if (guesses === null) {
      return {
        state: remembered,
        answer: workspace,
      };
    }

    remembered.push({
      guesses: guesses,
      count: 0,
      board: workspace,
    });
  }

  return {
    state: [],
    answer: null,
  };
}

function deduce(board: Board): Guess | null {
  while (true) {
    let stuck = true;
    let guess: Guess | null = null;
    let count = 0;

    let { allowed, needed } = figurebits(board);

    for (let pos = 0; pos < 81; pos++) {
      if (board[pos] === null) {
        const numbers = listbits(allowed[pos]);

        if (numbers.length === 0) {
          return [];
        } else if (numbers.length === 1) {
          board[pos] = numbers[0];
          stuck = false;
        } else if (stuck) {
          const t: Guess = numbers.map((val) => ({
            pos: pos,
            num: val,
          }));
          const tuple2 = pickbetter(guess, count, t);
          guess = tuple2.guess;
          count = tuple2.count;
        }
      }
    }

    if (!stuck) {
      const tuple3 = figurebits(board);
      allowed = tuple3.allowed;
      needed = tuple3.needed;
    }

    for (let axis = 0; axis < 3; axis++) {
      for (let x = 0; x < 9; x++) {
        const numbers = listbits(needed[axis * 9 + x]);

        for (let i = 0; i < numbers.length; i++) {
          const n = numbers[i];
          const bit = 1 << n;
          const spots: number[] = [];

          for (let y = 0; y < 9; y++) {
            const pos = posfor(x, y, axis);

            if (allowed[pos] & bit) {
              spots.push(pos);
            }
          }

          if (spots.length === 0) {
            return [];
          } else if (spots.length === 1) {
            board[spots[0]] = n;
            stuck = false;
          } else if (stuck) {
            const t: Guess = spots.map((val) => ({
              pos: val,
              num: n,
            }));
            const tuple4 = pickbetter(guess, count, t);
            guess = tuple4.guess;
            count = tuple4.count;
          }
        }
      }
    }

    if (stuck) {
      if (guess != null) {
        shuffleArray(guess);
      }

      return guess;
    }
  }
}

function figurebits(board: Board): { allowed: number[]; needed: number[] } {
  const needed: number[] = [];
  const allowed: number[] = board.map((val) => (val === null ? 511 : 0));

  for (let axis = 0; axis < 3; axis++) {
    for (let x = 0; x < 9; x++) {
      const bits = axismissing(board, x, axis);
      needed.push(bits);

      for (let y = 0; y < 9; y++) {
        const pos = posfor(x, y, axis);
        allowed[pos] = allowed[pos] & bits;
      }
    }
  }

  return {
    allowed: allowed,
    needed: needed,
  };
}

function posfor(x: number, y: number, axis: number = 0): number {
  if (axis === 0) {
    return x * 9 + y;
  } else if (axis === 1) {
    return y * 9 + x;
  }
  return [0, 3, 6, 27, 30, 33, 54, 57, 60][x] + [0, 1, 2, 9, 10, 11, 18, 19, 20][y];
}

function axismissing(board: Board, x: number, axis: number): number {
  let bits = 0;

  for (let y = 0; y < 9; y++) {
    const e = board[posfor(x, y, axis)];

    if (e != null) {
      bits |= 1 << e;
    }
  }

  return 511 ^ bits;
}

function listbits(bits: number): number[] {
  const list: number[] = [];

  for (let y = 0; y < 9; y++) {
    if ((bits & (1 << y)) != 0) {
      list.push(y);
    }
  }

  return list;
}

function pickbetter(
  b: Guess | null,
  c: number,
  t: Guess
): { guess: Guess; count: number } {
  if (b === null || t.length < b.length) {
    return {
      guess: t,
      count: 1,
    };
  } else if (t.length > b.length) {
    return {
      guess: b,
      count: c,
    };
  } else if (randomInt(c) === 0) {
    return {
      guess: t,
      count: c + 1,
    };
  }

  return {
    guess: b,
    count: c + 1,
  };
}

function boardforentries(entries: Entry[]): Board {
  const board: Board = Array(81).fill(null);

  for (let i = 0; i < entries.length; i++) {
    const item = entries[i];
    const pos = item.pos;
    const num = item.num;
    board[pos] = num;
  }

  return board;
}

function boardmatches(b1: Board, b2: Board): boolean {
  for (let i = 0; i < 81; i++) {
    if (b1[i] != b2[i]) {
      return false;
    }
  }

  return true;
}

function randomInt(max: number): number {
  return Math.floor(Math.random() * (max + 1));
}

function shuffleArray<T>(original: T[]): void {
  for (let i = original.length - 1; i > 0; i--) {
    const j = randomInt(i);
    const contents = original[i];
    original[i] = original[j];
    original[j] = contents;
  }
}

function removeElement<T>(array: T[], from: number, to?: number): T[] {
  const rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest) as unknown as T[];
}

export const makePuzzle = (): Board => {
  return makepuzzle(solvepuzzle(Array(81).fill(null))!);
};

export const solvePuzzle = (board: Board): Board | null => {
  return solvepuzzle(board);
};

export { posfor };
export type { Board };
