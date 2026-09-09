import { HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface RootDocumentProps {
  children: ReactNode;
}

/**
 * The document itself: `<html>`, `<head>` and `<body>`, the colour behind the
 * cards and the clearance under the fixed navbar.
 *
 * This is the one component without a story. Storybook renders every story
 * inside a document of its own, so a second `<html>` nested in that one shows
 * nothing worth looking at. The part that can be looked at, the centred column
 * and the card, is `PageShell`, and that has a story.
 */
const RootDocument = ({ children }: RootDocumentProps) => (
  <html suppressHydrationWarning lang="en" className="bg-surface p-2">
    <head>
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
