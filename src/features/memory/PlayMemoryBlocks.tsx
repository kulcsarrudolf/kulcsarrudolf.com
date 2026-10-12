import { Suspense, lazy, useState } from "react";

import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n/useTranslation";

// Fetched on the first press, so a post that offers the game does not load it with the page.
const MemoryBlocksModal = lazy(() => import("./MemoryBlocksModal"));

/**
 * A button that opens Memory Blocks over the page, the same window `memory`
 * in the terminal opens, for a blog post to offer the game in a click.
 */
const PlayMemoryBlocks = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="not-prose my-8 flex justify-center">
      <Button onClick={() => setOpen(true)}>{t("memory.play")}</Button>
      {open && (
        <Suspense fallback={null}>
          <MemoryBlocksModal onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </div>
  );
};

export default PlayMemoryBlocks;
