import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import CloseIcon from './icons/CloseIcon';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const { t, language } = useLanguage();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 modal-enter"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 p-6 sm:p-8 relative modal-content-enter"
        onClick={(e) => e.stopPropagation()}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-gray-400 hover:text-white transition-colors"
          aria-label={t('close')}
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-6 text-start">{t('aboutTitle')}</h2>
        <div className="space-y-4 text-gray-300 leading-relaxed text-start">
          <p>{t('aboutText1')}</p>
          <p>{t('aboutText2')}</p>
        </div>
        <div className="mt-8 flex justify-end">
            <button
                onClick={onClose}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200"
            >
                {t('close')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;