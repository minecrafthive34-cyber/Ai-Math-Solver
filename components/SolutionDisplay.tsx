import React, { useState, useRef } from 'react';
import { SolutionResponse, SolutionStatus, SolveInput } from '../types';
import LoadingSpinner from './icons/LoadingSpinner';
import { useLanguage } from '../hooks/useLanguage';
import LatexRenderer from './LatexRenderer';
import ShareIcon from './icons/ShareIcon';
import ShareMenu from './ShareMenu';


interface SolutionDisplayProps {
  solution: SolutionResponse | null;
  problem: SolveInput | null;
  isLoading: boolean;
  error: string | null;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution, problem, isLoading, error }) => {
    const { t } = useLanguage();
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const solutionContentRef = useRef<HTMLDivElement>(null);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-600 dark:text-gray-400">
                    <LoadingSpinner className="w-12 h-12 mb-4" />
                    <p className="text-lg">{t('analyzing')}</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-red-500 dark:text-red-400 text-center">
                    <p className="text-lg font-semibold">{t('errorOccurred')}</p>
                    <p>{error}</p>
                </div>
            );
        }

        if (!solution) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    <p className="text-lg">{t('solutionPlaceholder')}</p>
                </div>
            );
        }

        const isSolved = solution.status === SolutionStatus.SOLVED;
        const statusBg = isSolved ? 'bg-green-500/20 text-green-500 dark:text-green-400' : 'bg-yellow-500/20 text-yellow-500 dark:text-yellow-400';
        const statusText = isSolved ? t('solved') : t('unsolved');
        
        const difficultyColor = {
            Easy: 'text-green-500 dark:text-green-400',
            Medium: 'text-yellow-500 dark:text-yellow-400',
            Hard: 'text-orange-500 dark:text-orange-400',
            Advanced: 'text-red-600 dark:text-red-500',
        }[solution.difficulty] || 'text-gray-800 dark:text-gray-200';

        const difficultyBg = {
            Easy: 'bg-green-500',
            Medium: 'bg-yellow-500',
            Hard: 'bg-orange-500',
            Advanced: 'bg-red-600',
        }[solution.difficulty] || 'bg-gray-400';


        return (
            <div className="animate-fade-in text-start" ref={solutionContentRef}>
                <div className="flex justify-between items-start mb-4 gap-4">
                    <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300">{solution.title}</h2>
                     <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusBg}`}>
                            {statusText}
                        </span>
                        <div className="relative">
                           <button 
                                id="share-button"
                                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                                className="p-1.5 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                                aria-label={t('share')}
                                aria-haspopup="true"
                                aria-expanded={isShareMenuOpen}
                            >
                                <ShareIcon className="w-5 h-5" />
                           </button>
                           {isShareMenuOpen && (
                               <ShareMenu 
                                   problem={problem}
                                   solution={solution}
                                   solutionElement={solutionContentRef.current}
                                   onClose={() => setIsShareMenuOpen(false)}
                               />
                           )}
                        </div>
                    </div>
                </div>
                
                {/* Advanced Analysis */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('advancedAnalysis')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                         <div>
                            <p className="font-semibold text-gray-500 dark:text-gray-400 text-sm">{t('problemClassification')}</p>
                            <p className="text-gray-800 dark:text-gray-200">{solution.classification}</p>
                        </div>
                        <div>
                           <div className="flex justify-between items-center mb-1">
                                <p className="font-semibold text-gray-500 dark:text-gray-400 text-sm">{t('difficulty')}</p>
                                <p className={`font-medium text-sm ${difficultyColor}`}>{solution.difficulty} ({solution.difficultyRating}/10)</p>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div className={`${difficultyBg} h-2.5 rounded-full`} style={{ width: `${solution.difficultyRating * 10}%` }}></div>
                            </div>
                        </div>
                    </div>
                     {solution.difficultyJustification && (
                        <div className="pt-2">
                            <p className="font-semibold text-gray-500 dark:text-gray-400 text-sm mb-1">{t('difficultyJustification')}</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm italic">"{solution.difficultyJustification}"</p>
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-gray-500 dark:text-gray-400 text-sm mb-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">{t('keyConcepts')}</p>
                        <div className="flex flex-wrap gap-2">
                            {solution.keyConcepts.map((concept, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs font-medium rounded-md">
                                    {concept}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-gray-600 dark:text-gray-400 italic mb-6 border-s-4 border-gray-300 dark:border-gray-600 ps-4">
                    <LatexRenderer>{solution.reasoning}</LatexRenderer>
                </div>
                
                {isSolved && solution.solution && (
                    <div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">{t('stepByStep')}</h3>
                        <ol className="space-y-4">
                            {solution.solution.map((step, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="ms-0 me-3 flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center font-bold">{index + 1}</span>
                                    <LatexRenderer className="text-gray-700 dark:text-gray-300">{step}</LatexRenderer>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
                
                {!isSolved && solution.explanation && (
                     <div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">{t('detailedExplanation')}</h3>
                        <LatexRenderer className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{solution.explanation}</LatexRenderer>
                    </div>
                )}

                {(solution.alternativeMethods || solution.commonPitfalls) && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
                        {solution.alternativeMethods && (
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{t('alternativeMethods')}</h3>
                                <div className="border-s-4 border-yellow-400/50 dark:border-yellow-500/50 ps-4">
                                    <LatexRenderer className="text-gray-700 dark:text-gray-300 leading-relaxed">{solution.alternativeMethods}</LatexRenderer>
                                </div>
                            </div>
                        )}
                        {solution.commonPitfalls && (
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{t('commonPitfalls')}</h3>
                                 <div className="border-s-4 border-red-400/50 dark:border-red-500/50 ps-4">
                                    <LatexRenderer className="text-gray-700 dark:text-gray-300 leading-relaxed">{solution.commonPitfalls}</LatexRenderer>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg min-h-[300px] mt-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-500 dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 pb-2 text-start">{t('analysis')}</h2>
            <div className="mt-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default SolutionDisplay;