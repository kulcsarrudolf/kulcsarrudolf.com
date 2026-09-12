import { HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";

interface RootDocumentProps {
  children: ReactNode;
}

/**
 * The document itself: `<html>`, `<head>` and `<body>`, the colour behind the
 * cards and the clearance under the fixed navbar.
 *
 * Dark mode is the `dark` class on `<html>`. The server always sends the
 * light document; the first thing in `<head>` is an inline script that adds
 * the class if the visitor chose dark last time, before anything is painted,
 * so the page never flashes light on its way to dark. `suppressHydrationWarning`
 * is what lets React find a class the server did not render.
 *
 * This is the one component without a story. Storybook renders every story
 * inside a document of its own, so a second `<html>` nested in that one shows
 * nothing worth looking at. The part that can be looked at, the centred column
 * and the card, is `PageShell`, and that has a story.
 */
const RootDocument = ({ children }: RootDocumentProps) => (
  <html
    suppressHydrationWarning
    lang="en"
    className="bg-surface p-2 dark:bg-surface-dark dark:text-gray-200"
  >
    <head>
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      <HeadContent />
    </head>
    {/* Clears the fixed navbar, less the 8px of padding on <html>: the bar
        sits 12px down and is 56px tall on phones, 20px and 80px from 640px
        up. Both leave the same 20px between the bar and the first card. */}
    <body suppressHydrationWarning className="mt-20 sm:mt-28">
      {children}
      <Scripts />
    </body>
  </html>
);

export default RootDocument;
