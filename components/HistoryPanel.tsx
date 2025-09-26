import React, { useState, useEffect } from 'react';
import { HistoryItem, SolveInput } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import CloseIcon from './icons/CloseIcon';
import ConfirmationModal from './ConfirmationModal';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onLoadItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onLoadItem,
  onClearHistory,
}) => {
  const { t, language } = useLanguage();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [panelLanguage, setPanelLanguage] = useState(language);

  useEffect(() => {
    // If the panel is closed, its position should follow the current app language.
    // If the panel is open, its position should be "latched" to the language
    // it was opened with, preventing a jarring switch if the user changes language.
    if (!isOpen) {
      setPanelLanguage(language);
    }
  }, [isOpen, language]);

  const handleClearRequest = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmClear = () => {
    onClearHistory();
    setIsConfirmModalOpen(false);
  };


  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      ></div>
      <aside
        className={`fixed top-0 bottom-0 z-50 w-full max-w-sm bg-gray-800 border-gray-700 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col
          ${panelLanguage === 'ar' ? 'right-0 border-l' : 'left-0 border-r'}
          ${isOpen ? 'translate-x-0' : (panelLanguage === 'ar' ? 'translate-x-full' : '-translate-x-full')}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 id="history-title" className="text-xl font-bold text-blue-400">{t('historyTitle')}</h2>
          <button onClick={onClose} aria-label={t('close')} className="text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </header>

        <div className="flex-grow overflow-y-auto p-4">
          {history.length > 0 ? (
            <ul className="space-y-3">
              {history.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onLoadItem(item)}
                    className="w-full text-start p-3 bg-gray-900 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 space-y-2 group"
                  >
                     {/* Problem Preview */}
                    {typeof item.problem === 'string' ? (
                      <p className="text-sm text-gray-400 italic max-h-10 overflow-hidden" title={item.problem}>
                        {item.problem}
                      </p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <img
                          src={`data:${item.problem.image.mimeType};base64,${item.problem.image.data}`}
                          alt="Thumbnail of math problem"
                          className="w-10 h-10 rounded object-cover border border-gray-600 transition-transform duration-200 group-hover:scale-110"
                        />
                        <p className="text-sm text-gray-400 italic">Image Problem</p>
                      </div>
                    )}
                    
                    {/* Solution Title and Date */}
                    <div>
                      <p className="font-semibold text-gray-200 truncate">{item.solution.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.timestamp).toLocaleString(language)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>{t('noHistory')}</p>
            </div>
          )}
        </div>
        
        {history.length > 0 && (
            <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                <button
                    onClick={handleClearRequest}
                    className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-red-500 transition duration-200"
                >
                    {t('clearHistory')}
                </button>
            </footer>
        )}
      </aside>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmClear}
        title={t('clearHistory')}
        message={t('confirmClearHistory')}
      />
    </>
  );
};

export default HistoryPanel;