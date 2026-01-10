import { useEffect, useState } from "react";

interface WelcomeModalProps {
  onClose: () => void;
}

const welcomeMessages = [
  "You found the secret! Welcome, curious one!",
  "Patience is a virtue... and you have it! Welcome!",
  "7 seconds well spent! Welcome aboard!",
  "You're persistent! I like that. Welcome!",
  "Achievement unlocked: Master of Patience!",
];

const WelcomeModal = ({ onClose }: WelcomeModalProps) => {
  const [message] = useState(
    () => welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome!</h2>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
