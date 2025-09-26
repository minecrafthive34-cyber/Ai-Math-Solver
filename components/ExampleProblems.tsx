import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { ExampleProblem } from '../types';

interface ExampleProblemsProps {
  problems: ExampleProblem[];
  onSelectProblem: (problem: string) => void;
  isDisabled: boolean;
}

const ExampleProblems: React.FC<ExampleProblemsProps> = ({ problems, onSelectProblem, isDisabled }) => {
  const { t } = useLanguage();

  return (
    <div className="my-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-2">{t('exampleProblems')}</h3>
      <div className="flex flex-wrap gap-2">
        {problems.map((example) => (
          <button
            key={example.id}
            onClick={() => onSelectProblem(example.problem)}
            disabled={isDisabled}
            className="px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-md hover:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {example.problem}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExampleProblems;
