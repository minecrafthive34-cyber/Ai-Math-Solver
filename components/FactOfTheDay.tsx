import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import LightbulbIcon from './icons/LightbulbIcon';
import LoadingSpinner from './icons/LoadingSpinner';

interface FactOfTheDayProps {
  fact: string | null;
  isLoading: boolean;
}

const FactOfTheDay: React.FC<FactOfTheDayProps> = ({ fact, isLoading }) => {
  const { t } = useLanguage();

  return (
    <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <LightbulbIcon className="w-6 h-6 text-yellow-400" />
        <h3 className="text-lg font-bold text-yellow-400">{t('factOfTheDay')}</h3>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-500">
            <LoadingSpinner className="w-4 h-4" />
            <span>{t('loadingData')}</span>
        </div>
      ) : (
        <p className="text-gray-300 text-start">{fact}</p>
      )}
    </div>
  );
};

export default FactOfTheDay;
