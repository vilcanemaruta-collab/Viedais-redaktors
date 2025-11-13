import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, BarChart3 } from 'lucide-react';
import { useTextStore } from '../stores/textStore';
import { useSettingsStore } from '../stores/settingsStore';
import { countWords, splitIntoSentences, splitIntoParagraphs } from '../utils/textProcessing';

export default function TextInput() {
  const navigate = useNavigate();
  const { text, setText, clearText } = useTextStore();
  const { language } = useSettingsStore();

  const wordCount = countWords(text);
  const sentenceCount = splitIntoSentences(text, language).length;
  const paragraphCount = splitIntoParagraphs(text).length;
  const charCount = text.length;

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (text) {
        localStorage.setItem('draft-text', text);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [text]);

  const handleAnalyze = () => {
    if (text.trim()) {
      navigate('/analysis');
    }
  };

  const handleClear = () => {
    if (confirm('Vai tiešām vēlaties notīrīt visu tekstu?')) {
      clearText();
      localStorage.removeItem('draft-text');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter to analyze
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FileText className="text-primary-600" />
            Teksta Ievade
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Ievietojiet vai ierakstiet tekstu, ko vēlaties analizēt
          </p>
        </div>
      </div>

      {/* Text Input Area */}
      <div className="card">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Sāciet rakstīt vai ielīmējiet tekstu šeit..."
          className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none font-mono text-sm"
          spellCheck={false}
        />

        {/* Statistics Bar */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {wordCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Vārdi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {sentenceCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Teikumi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {paragraphCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rindkopas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {charCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rakstzīmes</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={!text.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BarChart3 size={20} />
            Analizēt tekstu
            <span className="text-xs opacity-75">(Ctrl+Enter)</span>
          </button>
          <button
            onClick={handleClear}
            disabled={!text.trim()}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={20} />
            Notīrīt
          </button>
        </div>

        {/* Help Text */}
        {!text && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 Padoms
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Ielīmējiet tekstu no citiem avotiem vai rakstiet to tieši šeit</li>
              <li>• Teksts tiek automātiski saglabāts kā melnraksts</li>
              <li>• Izmantojiet Ctrl+Enter, lai ātri sāktu analīzi</li>
              <li>• Pirms analīzes pārliecinieties, ka esat iestatījis valodu un kategoriju</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

