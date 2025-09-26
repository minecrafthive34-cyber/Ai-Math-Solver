import React, { useState, useRef, useEffect } from 'react';
import { useFont } from '../hooks/useFont';
import { useLanguage } from '../hooks/useLanguage';
import { FONT_OPTIONS } from '../constants';
import FontIcon from './icons/FontIcon';

const FontSelector: React.FC = () => {
  const { font, setFont } = useFont();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
        aria-label={t('selectFont')}
      >
        <FontIcon />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 end-0 w-48 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {FONT_OPTIONS.map(option => (
              <li key={option.id}>
                <button
                  onClick={() => {
                    setFont(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-start px-4 py-2 text-sm ${font === option.id ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-600'}`}
                >
                  {option.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FontSelector;
