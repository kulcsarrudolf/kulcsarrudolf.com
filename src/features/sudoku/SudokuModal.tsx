import Modal from "@/components/ui/modal/Modal";
import PhoneFrame from "@/components/ui/PhoneFrame";
import { useTranslation } from "@/i18n/useTranslation";

import Sudoku from "./Sudoku";

interface SudokuModalProps {
  onClose: () => void;
}

const SudokuModal = ({ onClose }: SudokuModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose} frameless panelClassName="p-6 md:p-0">
      {(close) => (
        <PhoneFrame>
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center dark:text-gray-100">
            {t("sudoku.title")}
          </h2>
          <Sudoku onClose={close} />
        </PhoneFrame>
      )}
    </Modal>
  );
};

export default SudokuModal;
