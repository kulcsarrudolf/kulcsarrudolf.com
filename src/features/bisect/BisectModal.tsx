import CloseButton from "@/components/ui/CloseButton";
import Modal from "@/components/ui/modal/Modal";
import { useTranslation } from "@/i18n/useTranslation";

import Bisect from "./Bisect";

interface BisectModalProps {
  onClose: () => void;
}

/**
 * Bisect over the page, the way the terminal opens it: the whole screen on a
 * phone, a window of its own from `md` up. The window carries the `dark`
 * class, so it is dark in both themes like the terminal it came from, and the
 * shared button and the × inside it take their dark look without being told.
 */
const BisectModal = ({ onClose }: BisectModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose} frameless panelClassName="p-0">
      {(close) => (
        <div className="dark relative flex flex-1 flex-col justify-center bg-gray-800 px-5 py-6 md:w-[26rem] md:flex-none md:rounded-2xl md:shadow-2xl md:ring-1 md:ring-white/10">
          <CloseButton onClick={close} label={t("bisect.close") as string} />
          <Bisect />
        </div>
      )}
    </Modal>
  );
};

export default BisectModal;
