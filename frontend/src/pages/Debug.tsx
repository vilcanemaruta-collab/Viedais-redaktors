import { useMemo, useState } from 'react';
import { Activity, AlertCircle, Bug, ClipboardCopy, Play, RefreshCw, Server, Terminal } from 'lucide-react';
import { useTextStore } from '../stores/textStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useAdminStore } from '../stores/adminStore';
import { buildAnalysisPrompt } from '../utils/promptBuilder';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';
const FALLBACK_SAMPLE =
  'Latvijas tehnoloģiju nozare 2025. gadā piedzīvo strauju izaugsmi, īpaši mākslīgā intelekta risinājumu attīstībā.';

interface DebugResponse {
  status: number;
  ok: boolean;
  headers: Record<string, string>;
  payload: {
    textLength: number;
    promptLength: number;
    language: string;
    category: string;
    style: string;
  };
  data: unknown;
  receivedAt: string;
}

export default function Debug() {
  const { text } = useTextStore();
  const settings = useSettingsStore();
  const { guidelines, knowledgeBase, getActivePrompt } = useAdminStore();

  const [debugText, setDebugText] = useState(() => text || FALLBACK_SAMPLE);
  const [response, setResponse] = useState<DebugResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const envInfo = useMemo(
    () => ({
      apiBaseUrl: API_BASE_URL,
      mode: import.meta.env.MODE,
      referrer: window.location.origin,
      version: import.meta.env.VITE_APP_VERSION ?? 'nav definēta',
      buildTime: import.meta.env.VITE_APP_BUILD_TIME ?? 'nav definēts',
    }),
    []
  );

  const handleCopy = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Clipboard error', err);
    }
  };

  const runDebug = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const activePrompt = getActivePrompt();
      if (!activePrompt) {
        throw new Error('Nav aktīvs sistēmas prompts.');
      }

      if (!debugText.trim()) {
        throw new Error('Ievadiet testēšanas tekstu.');
      }

      const prompt = buildAnalysisPrompt({
        text: debugText,
        settings,
        guidelines,
        knowledgeBase,
        promptTemplate: activePrompt.content,
      });

      const payload = {
        text: debugText,
        settings,
        prompt,
      };

      const res = await fetch(`${API_BASE_URL}/analyze?debug=1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Mode': '1',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setResponse({
        status: res.status,
        ok: res.ok,
        headers: Object.fromEntries(res.headers.entries()),
        payload: {
          textLength: debugText.length,
          promptLength: prompt.length,
          language: settings.language,
          category: settings.category,
          style: settings.style,
        },
        data,
        receivedAt: new Date().toISOString(),
      });

      if (!res.ok) {
        const message =
          (typeof data === 'object' && data && 'message' in data ? (data as Record<string, unknown>).message : null) ||
          (typeof data === 'object' && data && 'error' in data ? (data as Record<string, unknown>).error : null);
        throw new Error(typeof message === 'string' ? message : 'API atgrieza kļūdu.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nezināma kļūda';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Bug className="text-primary-600" />
            Gemini Debug Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Izpildi testu pieprasījumus ar pilnu diagnostiku un stack trace informāciju.
          </p>
        </div>
        <button
          onClick={runDebug}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
          Start Debug
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Terminal size={20} />
            <h2 className="text-xl font-semibold">Testa Teksts</h2>
          </div>
          <textarea
            value={debugText}
            onChange={(e) => setDebugText(e.target.value)}
            className="input-field h-48 font-mono text-sm"
            placeholder="Ierakstiet testēšanas tekstu..."
            spellCheck={false}
          />
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Garums: {debugText.length} rakstzīmes</span>
            <span>Iestatījumi: {settings.language.toUpperCase()} · {settings.category} · {settings.style}</span>
          </div>
        </div>

        <div className="card space-y-3">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Server size={20} />
            <h2 className="text-xl font-semibold">Vide</h2>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <span>API Base URL</span>
              <span className="font-mono text-xs">{envInfo.apiBaseUrl}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Vite Mode</span>
              <span className="font-mono text-xs">{envInfo.mode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Host</span>
              <span className="font-mono text-xs">{envInfo.referrer}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Lietotnes versija</span>
              <span className="font-mono text-xs">{envInfo.version}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Build laiks</span>
              <span className="font-mono text-xs">{envInfo.buildTime}</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">Debug kļūda</h3>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {response && (
        <div className="space-y-4">
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Activity size={20} />
                <h2 className="text-xl font-semibold">API Atbilde</h2>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span
                  className={`px-3 py-1 rounded-full ${
                    response.ok
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}
                >
                  Status {response.status}
                </span>
                <button
                  onClick={handleCopy}
                  className="btn-secondary flex items-center gap-1"
                >
                  <ClipboardCopy size={16} />
                  {copied ? 'Saglabāts' : 'Kopēt JSON'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pieprasījums</h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Teksta garums: {response.payload.textLength}</li>
                  <li>Prompt garums: {response.payload.promptLength}</li>
                  <li>Valoda: {response.payload.language}</li>
                  <li>Kategorija: {response.payload.category}</li>
                  <li>Stils: {response.payload.style}</li>
                </ul>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Atbildes galvenes</h3>
                <pre className="text-xs whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                  {JSON.stringify(response.headers, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          <div className="card bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Terminal size={18} />
              Datu izdruka
            </h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-200 font-mono overflow-x-auto">
{JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}


