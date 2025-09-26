import { useState, useEffect, useCallback } from 'react';
import { HistoryItem, SolveInput, SolutionResponse } from '../types';

const HISTORY_STORAGE_KEY = 'math-solver-history';

export const useHistory = (): {
    history: HistoryItem[];
    addHistoryItem: (problem: SolveInput, solution: SolutionResponse) => void;
    clearHistory: () => void;
} => {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to load history from localStorage", error);
            setHistory([]);
        }
    }, []);

    const saveHistory = useCallback((newHistory: HistoryItem[]) => {
        try {
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
        } catch (error) {
            console.error("Failed to save history to localStorage", error);
        }
    }, []);

    const addHistoryItem = useCallback((problem: SolveInput, solution: SolutionResponse) => {
        const timestamp = new Date().toISOString();
        const newItem: HistoryItem = {
            id: timestamp,
            problem,
            solution,
            timestamp,
        };
        
        setHistory(prevHistory => {
            const updatedHistory = [newItem, ...prevHistory];
            saveHistory(updatedHistory);
            return updatedHistory;
        });
    }, [saveHistory]);

    const clearHistory = useCallback(() => {
        setHistory([]);
        try {
            localStorage.removeItem(HISTORY_STORAGE_KEY);
        } catch (error) {
            console.error("Failed to clear history from localStorage", error);
        }
    }, []);

    return { history, addHistoryItem, clearHistory };
};
