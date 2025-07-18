
import React, { useState, useCallback } from 'react';
import { getSymptomAnalysis } from '../services/openaiService';
import { marked } from 'marked';

const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = useCallback(async () => {
    if (!symptoms.trim()) {
      setError('Please describe your symptoms before getting an analysis.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis('');

    try {
      const result = await getSymptomAnalysis(symptoms);
      setAnalysis(result);
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  }, [symptoms]);

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">AI Symptom Checker</h3>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Describe your symptoms to get instant, AI-powered insights.</p>
      
      <div className="mt-6">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., 'I have a persistent cough and mild fever for two days...'"
          className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
          disabled={isLoading}
        />
      </div>

      <div className="mt-4">
        <button
          onClick={handleAnalysis}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </div>
          ) : 'Get AI Analysis'}
        </button>
      </div>

      {error && <p className="mt-4 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</p>}
      
      {analysis && (
        <div className="mt-6 prose prose-slate dark:prose-invert max-w-none prose-h3:text-primary dark:prose-h3:text-cyan-400 prose-h3:font-semibold prose-strong:text-slate-700 dark:prose-strong:text-slate-200 prose-ul:list-disc prose-li:my-1">
            <div dangerouslySetInnerHTML={{ __html: marked.parse(analysis) }} />
        </div>
      )}
    </div>
  );
};


export default SymptomChecker;
