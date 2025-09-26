import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const { t, language } = useLanguage();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 modal-enter"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 p-6 sm:p-8 relative modal-content-enter"
        onClick={(e) => e.stopPropagation()}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 text-start">{title}</h2>
        <p className="text-gray-300 leading-relaxed text-start mb-8">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-700 transition duration-200"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition duration-200"
          >
            {t('confirmClear')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;