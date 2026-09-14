import { useState } from "react";

import Button from "@/components/ui/Button";
import CloseButton from "@/components/ui/CloseButton";
import Modal from "@/components/ui/modal/Modal";
import PhoneFrame from "@/components/ui/PhoneFrame";
import getRandomQuote from "@/features/quotes/getRandomQuote";
import QuoteCard from "@/features/quotes/QuoteCard";
import SudokuModal from "@/features/sudoku/SudokuModal";
import { useTranslation } from "@/i18n/useTranslation";
import type { Quote as QuoteType } from "@/types/quote";

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal = ({ onClose }: WelcomeModalProps) => {
  const { t } = useTranslation();
  const [quote] = useState<QuoteType>(() => getRandomQuote());
  const [showSudoku, setShowSudoku] = useState(false);

  if (showSudoku) {
    return <SudokuModal onClose={() => setShowSudoku(false)} />;
  }

  return (
    <Modal onClose={onClose} frameless panelClassName="p-8 md:p-0">
      {(close) => (
        <PhoneFrame>
          {/* Inside the frame, so from `md` up the × sits on the screen rather than the bezel. */}
          <CloseButton onClick={close} label={t("nav.close") as string} />
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 dark:text-gray-100">
              {t("welcomeModal.title")}
            </h2>
            <p className="text-gray-600 mb-6 dark:text-gray-400">{t("welcomeModal.message")}</p>

            <QuoteCard quote={quote} centered className="shadow-none" />

            <Button className="mt-6" onClick={() => setShowSudoku(true)}>
              {t("welcomeModal.playSudoku")}
            </Button>
          </div>
        </PhoneFrame>
      )}
    </Modal>
  );
};

export default WelcomeModal;
