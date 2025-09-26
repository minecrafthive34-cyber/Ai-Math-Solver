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

function App() {
  const [solution, setSolution] = useState<SolutionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<AppChatSession | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [exampleProblems, setExampleProblems] = useState<ExampleProblem[]>([]);
  const [mathFact, setMathFact] = useState<string | null>(null);
  const [isInitialDataLoading, setIsInitialDataLoading] = useState<boolean>(true);

  const { t, language, setLanguage } = useLanguage();
  const { history, addHistoryItem, clearHistory } = useHistory();

  // Effect for loading screen and initial setup
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

  // Effect to fetch dynamic data and create chat session when language changes
  useEffect(() => {
    const fetchInitialData = async () => {
        setIsInitialDataLoading(true);
        const { examples, fact } = await generateInitialData(language);
        setExampleProblems(examples);
        setMathFact(fact);
        setIsInitialDataLoading(false);
    }
    fetchInitialData();
    // Create a new chat session in the selected language. This will also clear previous chat history.
    setChatSession(createChatSession(language));
  }, [language]);

  const handleSolve = useCallback(async (problem: SolveInput) => {
    setIsLoading(true);
    setError(null);
    setSolution(null);

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
    setChatSession(createChatSession(language));
    setIsLoading(false);
  }, [language]);

  const handleLoadFromHistory = useCallback((item: HistoryItem) => {
    setIsLoading(true);
    setError(null);
    setSolution(item.solution);
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex-grow text-center lg:text-start">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  {t('title')}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {t('madeBy')}
                </p>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 mx-auto lg:mx-0">
                  <Clock />
                  <FontSelector />
                  <button onClick={() => setIsHistoryOpen(true)} className="text-gray-400 hover:text-blue-400 transition-colors" aria-label={t('historyTitle')}>
                    <HistoryIcon />
                  </button>
                  <button onClick={() => setIsAboutModalOpen(true)} className="text-gray-400 hover:text-blue-400 transition-colors">{t('about')}</button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-sm rounded-md ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>EN</button>
                    <button onClick={() => setLanguage('ar')} className={`px-3 py-1 text-sm rounded-md ${language === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>AR</button>
                  </div>
              </div>
          </div>
           <p className="mt-4 text-lg text-gray-400 text-center lg:text-start">
            {t('description')}
          </p>
          <FactOfTheDay fact={mathFact} isLoading={isInitialDataLoading} />
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col">
            <ProblemInput onSolve={handleSolve} onClear={handleClear} isLoading={isLoading || isInitialDataLoading} exampleProblems={exampleProblems}/>
            <SolutionDisplay solution={solution} isLoading={isLoading} error={error} />
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