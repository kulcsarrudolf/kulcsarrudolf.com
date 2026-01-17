"use client";

import { useEffect, useState } from "react";
import Sudoku from "./Sudoku";
import { useTranslation } from "@/i18n/useTranslation";

interface SudokuModalProps {
  onClose: () => void;
}

const SudokuModal = ({ onClose }: SudokuModalProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        className={`relative bg-white p-6 shadow-2xl transform transition-all duration-200 w-full h-full md:w-auto md:h-auto md:mx-4 md:rounded-2xl flex flex-col justify-center ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          {t("sudoku.title")}
        </h2>
        <Sudoku onClose={handleClose} />
      </div>
    </div>
  );
};

export default SudokuModal;
