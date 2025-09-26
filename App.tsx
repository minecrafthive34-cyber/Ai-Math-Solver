import React, { useState, useCallback, useEffect } from 'react';
import ProblemInput from './components/ProblemInput';
import SolutionDisplay from './components/SolutionDisplay';
import Chat from './components/Chat';
import AboutModal from './components/AboutModal';
import { solveProblem, createChatSession, generateInitialData } from './services/geminiService';
import { SolutionResponse, AppChatSession, SolveInput, HistoryItem, ExampleProblem } from './types';
import { useLanguage } from './hooks/useLanguage';
import { useHistory } from './hooks/useHistory';
import HistoryPanel from './components/HistoryPanel';
import HistoryIcon from './components/icons/HistoryIcon';
import FontSelector from './components/FontSelector';
import Clock from './components/Clock';
import FactOfTheDay from './components/FactOfTheDay';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [solution, setSolution] = useState<SolutionResponse | null>(null);
  const [currentProblem, setCurrentProblem] = useState<SolveInput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<AppChatSession | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [exampleProblems, setExampleProblems] = useState<ExampleProblem[]>([]);
  const [mathFact, setMathFact] = useState<string | null>(null);
  const [isInitialDataLoading, setIsInitialDataLoading] = useState<boolean>(true);
  const [initialDataCache, setInitialDataCache] = useState<{ [lang: string]: { examples: ExampleProblem[], fact: string } }>({});


  const { t, language, setLanguage } = useLanguage();
  const { history, addHistoryItem, clearHistory } = useHistory();

  // Effect for loading screen
  useEffect(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('opacity-0');
        loadingScreen.addEventListener('transitionend', () => {
          loadingScreen.remove();
        });
      }, 1500);
    }
  }, []);
  
  // Effect to parse shared link data from URL hash on initial load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#data=')) {
        try {
            const encodedData = hash.substring(6); // Remove #data=
            const decodedData = atob(decodeURIComponent(encodedData));
            const sharedContent = JSON.parse(decodedData);

            if (sharedContent.problem && sharedContent.solution) {
                // Set language first to ensure UI consistency
                if (sharedContent.language && (sharedContent.language === 'en' || sharedContent.language === 'ar')) {
                    setLanguage(sharedContent.language);
                }
                setSolution(sharedContent.solution);
                setCurrentProblem(sharedContent.problem);
                
                // Clear the hash to prevent re-processing and clean up the URL
                window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
            }
        } catch (e) {
            console.error("Failed to parse shared data from URL hash:", e);
            window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
        }
    }
  }, [setLanguage]);

  // Effect to fetch dynamic data and create chat session when language changes
  useEffect(() => {
    const fetchInitialData = async () => {
        // Check cache first to avoid redundant API calls
        if (initialDataCache[language]) {
            setExampleProblems(initialDataCache[language].examples);
            setMathFact(initialDataCache[language].fact);
            setIsInitialDataLoading(false);
            return;
        }

        setIsInitialDataLoading(true);
        const { examples, fact } = await generateInitialData(language);
        setExampleProblems(examples);
        setMathFact(fact);
        // Update cache with new data
        setInitialDataCache(prev => ({ ...prev, [language]: { examples, fact } }));
        setIsInitialDataLoading(false);
    }
    
    // Only fetch if there's no solution loaded from a previous action or URL hash
    if (!solution) {
        fetchInitialData();
    } else {
        // A solution exists, so we aren't "initial loading".
        // This handles cases where a solution is loaded from a URL hash.
        setIsInitialDataLoading(false);
    }
    
    setChatSession(createChatSession(language));
  }, [language, solution]);

  const handleSolve = useCallback(async (problem: SolveInput) => {
    setIsLoading(true);
    setError(null);
    setSolution(null);
    setCurrentProblem(problem);

    try {
      const result = await solveProblem(problem, language);
      setSolution(result);
      addHistoryItem(problem, result);
      const newChatSession = createChatSession(language);
      setChatSession(newChatSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [addHistoryItem, language]);

  const handleClear = useCallback(() => {
    setSolution(null);
    setError(null);
    setCurrentProblem(null);
    setChatSession(createChatSession(language));
    setIsLoading(false);
  }, [language]);

  const handleLoadFromHistory = useCallback((item: HistoryItem) => {
    setIsLoading(true);
    setError(null);
    setSolution(item.solution);
    setCurrentProblem(item.problem);
    setChatSession(createChatSession(language));
    setIsHistoryOpen(false);
    setTimeout(() => setIsLoading(false), 200);
  }, [language]);
  
  const handleNewChat = useCallback(() => {
    setChatSession(createChatSession(language));
  }, [language]);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    handleClear();
  }, [clearHistory, handleClear]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex-grow text-center lg:text-start">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  {t('title')}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                  {t('madeBy')}
                </p>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 mx-auto lg:mx-0">
                  <Clock />
                  <FontSelector />
                  <ThemeToggle />
                  <button onClick={() => setIsHistoryOpen(true)} className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" aria-label={t('historyTitle')}>
                    <HistoryIcon />
                  </button>
                  <button onClick={() => setIsAboutModalOpen(true)} className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">{t('about')}</button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-sm rounded-md ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>EN</button>
                    <button onClick={() => setLanguage('ar')} className={`px-3 py-1 text-sm rounded-md ${language === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>AR</button>
                  </div>
              </div>
          </div>
           <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 text-center lg:text-start">
            {t('description')}
          </p>
          <FactOfTheDay fact={mathFact} isLoading={isInitialDataLoading} />
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col">
            <ProblemInput onSolve={handleSolve} onClear={handleClear} isLoading={isLoading || isInitialDataLoading} exampleProblems={exampleProblems}/>
            <SolutionDisplay solution={solution} problem={currentProblem} isLoading={isLoading} error={error} />
          </div>
          <div className="mt-8 lg:mt-0 h-[500px] lg:h-auto">
             <Chat chatSession={chatSession} isEnabled={true} onNewChat={handleNewChat} />
          </div>
        </main>
      </div>

      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} />}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadItem={handleLoadFromHistory}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}

export default App;