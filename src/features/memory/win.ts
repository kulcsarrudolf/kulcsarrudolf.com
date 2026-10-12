/**
 * The pieces of Windows 3.1 that the window, its menus and its dialogs share,
 * as class strings: the bevelled grey button and the bold system text.
 */

/** A push button: silver, lit from the top left, sinking in while pressed. */
export const BEVEL_BUTTON =
  "rounded-[3px] border border-black bg-win-silver text-black shadow-[inset_-2px_-2px_0_var(--color-win-gray),inset_2px_2px_0_white] active:shadow-[inset_2px_2px_0_var(--color-win-gray)] focus-visible:outline-1 focus-visible:-outline-offset-5 focus-visible:outline-black focus-visible:outline-dotted";

/** What Windows 3.1 called the System font: bold, black and small. */
export const SYSTEM_TEXT = "font-sans text-[13px] font-bold leading-tight text-black";
