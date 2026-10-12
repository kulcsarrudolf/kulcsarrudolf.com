import Modal from "@/components/ui/modal/Modal";

import MemoryBlocks from "./MemoryBlocks";

interface MemoryBlocksModalProps {
  onClose: () => void;
}

/**
 * Memory Blocks over the page, the way `memory` in the terminal opens it: the
 * whole screen on a phone, the Windows 3.1 window on its own from `md` up.
 * The window's control-menu box and Game, Exit both close it.
 */
const MemoryBlocksModal = ({ onClose }: MemoryBlocksModalProps) => (
  <Modal onClose={onClose} frameless panelClassName="p-0">
    {(close) => (
      <div className="flex max-h-dvh min-h-0 flex-1 flex-col md:flex-none md:shadow-[6px_6px_0_rgb(0_0_0/0.5)]">
        <MemoryBlocks onClose={close} />
      </div>
    )}
  </Modal>
);

export default MemoryBlocksModal;
