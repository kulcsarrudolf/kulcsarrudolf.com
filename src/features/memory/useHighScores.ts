import { useCallback, useEffect, useState } from "react";

import type { Skill } from "./engine";
import {
  emptyScores,
  type HighScores,
  insertScore,
  NAME_STORAGE_KEY,
  parseScores,
  type Score,
  SCORES_STORAGE_KEY,
} from "./highScores";

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // A private window or full storage: the list lasts as long as the page.
  }
};

/**
 * The high score lists and the name last entered on one, read from
 * localStorage after the first render so the server and the client agree,
 * and written back whenever a score is added.
 */
export function useHighScores() {
  const [scores, setScores] = useState<HighScores>(emptyScores);
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    setScores(parseScores(read(SCORES_STORAGE_KEY)));
    setLastName(read(NAME_STORAGE_KEY) ?? "");
  }, []);

  const add = useCallback((skill: Skill, score: Score) => {
    setScores((current) => {
      const next = { ...current, [skill]: insertScore(current[skill], score) };
      write(SCORES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setLastName(score.name);
    write(NAME_STORAGE_KEY, score.name);
  }, []);

  return { scores, lastName, add };
}
