import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, AlertCircle, CheckCircle, Download, Loader2, ArrowLeft } from 'lucide-react';
import { useTextStore } from '../stores/textStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useAdminStore } from '../stores/adminStore';
import { analyzeText } from '../services/api';
import { calculateTextMetrics, getReadabilityLevel } from '../utils/analysisMetrics';
import { buildAnalysisPrompt } from '../utils/promptBuilder';

export default function Analysis() {
  const navigate = useNavigate();
  const { text, analysisResult, setAnalysisResult, isAnalyzing, setIsAnalyzing } = useTextStore();
  const settings = useSettingsStore();
  const { guidelines, knowledgeBase, getActivePrompt } = useAdminStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!text.trim()) {
      navigate('/');
      return;
    }

    if (!analysisResult && !isAnalyzing) {
      performAnalysis();
    }
  }, []);

  const performAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('🔍 Starting analysis...');
      console.log('📝 Text length:', text.length);
      console.log('⚙️ Settings:', settings);
      
      // Calculate local metrics
      const metrics = calculateTextMetrics(text, settings.language);
      console.log('📊 Local metrics:', metrics);

      // Build prompt for AI analysis
      const activePrompt = getActivePrompt();
      if (!activePrompt) {
        throw new Error('Nav aktīvs sistēmas prompts');
      }
      console.log('💬 Active prompt ID:', activePrompt.id, 'Version:', activePrompt.version);

      const prompt = buildAnalysisPrompt({
        text,
        settings,
        guidelines,
        knowledgeBase,
        promptTemplate: activePrompt.content,
      });
      console.log('📤 Sending to API...');
      console.log('🔗 API URL:', import.meta.env.VITE_API_URL || '/.netlify/functions');

      // Call API for AI analysis
      const result = await analyzeText({
        text,
        settings,
        prompt,
      });
      console.log('✅ API Response:', result);

      // Merge local and AI metrics
      const apiReadabilityScore =
        result.readabilityScore ?? result.readability_score ?? result.metrics?.readabilityScore;

      const mergedReadability = apiReadabilityScore ?? metrics.readabilityScore;

      const finalResult = {
        ...result,
        readabilityScore: mergedReadability,
        metrics: {
          ...metrics,
          ...result.metrics,
          readabilityScore: mergedReadability,
        },
      };

      setAnalysisResult(finalResult);
    } catch (err) {
      console.error('❌ Analysis error:', err);
      console.error('❌ Error details:', {
        message: err instanceof Error ? err.message : 'Unknown',
        stack: err instanceof Error ? err.stack : undefined,
        error: err,
      });
      
      setError(err instanceof Error ? err.message : 'Nezināma kļūda');
      
      // Fallback to local analysis only
      console.log('⚠️ Falling back to local analysis only');
      const metrics = calculateTextMetrics(text, settings.language);
      setAnalysisResult({
        metrics,
        issues: [],
        summary: 'Kopsavilkums nav pieejams (API kļūda)',
        readabilityScore: metrics.readabilityScore,
      });
    } finally {
      setIsAnalyzing(false);
      console.log('✅ Analysis complete');
    }
  };

  const handleExport = () => {
    if (!analysisResult) return;

    const exportData = {
      text,
      settings,
      analysis: analysisResult,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analīze-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analizē tekstu...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Lūdzu, uzgaidiet, kamēr sistēma analizē jūsu tekstu
          </p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return null;
  }

  const readabilityInfo = getReadabilityLevel(analysisResult.readabilityScore);
  const { metrics, issues, summary } = analysisResult;

  const issuesBySeverity = {
    high: issues.filter(i => i.severity === 'high'),
    medium: issues.filter(i => i.severity === 'medium'),
    low: issues.filter(i => i.severity === 'low'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2"
          >
            <ArrowLeft size={20} />
            Atpakaļ uz teksta ievadi
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="text-primary-600" />
            Analīzes Rezultāti
          </h1>
        </div>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
          <Download size={20} />
          Eksportēt
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">Brīdinājums</h3>
              <p className="text-red-800 dark:text-red-200 mt-1">{error}</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                Tika izmantota tikai lokālā analīze bez AI ieteikumiem.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Readability Score */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Lasāmības Rādītājs
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - analysisResult.readabilityScore / 100)}`}
                className={readabilityInfo.color}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {analysisResult.readabilityScore}
              </span>
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${readabilityInfo.color}`}>
              {readabilityInfo.level}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {readabilityInfo.description}
            </p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>
            Skala 0–100 rāda, cik viegli tekstu uztvert (balstīta uz Flesch lasāmības rādītāja latvisko adaptāciju).
          </p>
          <p>
            90+ – ļoti viegli, 70–89 – viegli, 60–69 – vidējs līmenis, 30–59 – grūtāk, zem 30 – ļoti grūti.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Vārdi', value: metrics.wordCount },
          { label: 'Teikumi', value: metrics.sentenceCount },
          { label: 'Rindkopas', value: metrics.paragraphCount },
          { label: 'Vārdi/teikums', value: metrics.avgWordsPerSentence.toFixed(1) },
          { label: 'Sarežģīti teikumi', value: metrics.complexSentences },
          { label: 'Problēmas', value: issues.length },
        ].map((metric, index) => (
          <div key={index} className="card text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {metric.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {metric.label}
            </div>
          </div>
        ))}
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Atrastās Problēmas ({issues.length})
          </h2>
          
          <div className="space-y-4">
            {['high', 'medium', 'low'].map((severity) => {
              const severityIssues = issuesBySeverity[severity as keyof typeof issuesBySeverity];
              if (severityIssues.length === 0) return null;

              const severityConfig = {
                high: { label: 'Augsta', color: 'red', icon: AlertCircle },
                medium: { label: 'Vidēja', color: 'yellow', icon: AlertCircle },
                low: { label: 'Zema', color: 'blue', icon: CheckCircle },
              };

              const config = severityConfig[severity as keyof typeof severityConfig];
              const Icon = config.icon;

              return (
                <div key={severity}>
                  <h3 className={`font-semibold text-${config.color}-900 dark:text-${config.color}-100 mb-3 flex items-center gap-2`}>
                    <Icon size={20} className={`text-${config.color}-600`} />
                    {config.label} prioritāte ({severityIssues.length})
                  </h3>
                  <div className="space-y-3">
                    {severityIssues.map((issue, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 border-${config.color}-500 bg-${config.color}-50 dark:bg-${config.color}-900/20`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white mb-1">
                              {issue.type === 'readability' && 'Lasāmība'}
                              {issue.type === 'grammar' && 'Gramatika'}
                              {issue.type === 'style' && 'Stils'}
                              {issue.type === 'complexity' && 'Sarežģītība'}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                              "{issue.sentence}"
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              💡 <strong>Ieteikums:</strong> {issue.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Kopsavilkums
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
            {summary}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            setAnalysisResult(null);
            navigate('/');
          }}
          className="btn-primary"
        >
          Jauna analīze
        </button>
        <button
          onClick={performAnalysis}
          className="btn-secondary"
        >
          Analizēt vēlreiz
        </button>
      </div>
    </div>
  );
}

