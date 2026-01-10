import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import getRandomQuote from "@/components/quote/getRandomQuote";
import Quote from "@/components/quote/Quote";
import type QuoteType from "@/types/quote.type";

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal = ({ onClose }: WelcomeModalProps) => {
  const { t } = useTranslation();
  const [quote] = useState<QuoteType>(() => getRandomQuote());
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
        className={`relative bg-white rounded-2xl p-8 mx-4 max-w-sm shadow-2xl transform transition-all duration-200 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          &times;
        </button>

        <div className="text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {t("welcomeModal.title")}
          </h2>
          <p className="text-gray-600 mb-6">{t("welcomeModal.message")}</p>

          <Quote quote={quote} clickable={false} className="mt-0 shadow-none" />
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
