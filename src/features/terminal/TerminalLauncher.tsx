import { useRouterState } from "@tanstack/react-router";
import { Suspense, lazy, useState } from "react";

import { useTranslation } from "@/i18n/useTranslation";

import TerminalDock from "./TerminalDock";

// Behind a button nobody has to press, so the window and everything in it is
// fetched on the first press rather than with every page.
const Terminal = lazy(() => import("./Terminal"));

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
 * Until the button is first pressed the button is all there is. The press
 * loads the window, which opens as it arrives, and from then on the window
 * owns the button the way the home page's does.
 *
 * Rendered once, in the root route's shell, so every page has it without any
 * page having to ask, bar the handful listed above that have their own reasons
 * not to want it.
 */
const TerminalLauncher = () => {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [requested, setRequested] = useState(false);

  if (WITHOUT.has(pathname)) return null;

  const dock = (
    <TerminalDock onOpen={() => setRequested(true)} label={t("terminal.open") as string} />
  );
  if (!requested) return dock;

  return (
    <Suspense fallback={dock}>
      <Terminal launcher openOnMount />
    </Suspense>
  );
};

export default TerminalLauncher;
