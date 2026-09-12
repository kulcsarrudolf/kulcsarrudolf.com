import { useRouterState } from "@tanstack/react-router";

import Terminal from "./Terminal";

/**
 * The pages that carry no launcher. The home page has the terminal on it
 * already, with the same button in the same corner once it is closed, and two
 * of them would be one too many. The wedding invitation is not a page of this
 * site so much as a page of its own: it covers the shell with a full-bleed
 * design of its own, which the button would sit under rather than on.
 */
const WITHOUT = new Set(["/", "/rudolf-and-nora", "/rudolf-es-nora", "/rn", "/nr"]);

/**
 * The terminal every other page carries: a button in the bottom right corner
 * and, behind it, the same window the home page opens with. It comes up over
 * the page rather than in it, since no page but the home page has a place set
 * aside for it, and it closes itself when the visitor changes page.
 *
 * Rendered once, in the root route's shell, so every page has it without any
 * page having to ask, bar the handful listed above that have their own reasons
 * not to want it.
 */
const TerminalLauncher = () => {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (WITHOUT.has(pathname)) return null;
  return <Terminal launcher />;
};

export default TerminalLauncher;
