import Modal from "@/components/general/modal/Modal";
import { useTranslation } from "@/i18n/useTranslation";

import Sudoku from "./Sudoku";

interface SudokuModalProps {
  onClose: () => void;
}

const SudokuModal = ({ onClose }: SudokuModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose}>
      {(close) => (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{t("sudoku.title")}</h2>
          <Sudoku onClose={close} />
        </>
      )}
    </Modal>
  );
};

export default SudokuModal;
