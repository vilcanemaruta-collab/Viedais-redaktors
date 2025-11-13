import { useState } from 'react';
import { Shield, Upload, FileText, Settings, Trash2, Plus, Eye } from 'lucide-react';
import { useAdminStore } from '../stores/adminStore';
import type { Guideline, KnowledgeBaseArticle, SystemPrompt, Category, Language } from '../types';

type Tab = 'knowledge' | 'guidelines' | 'prompt';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('knowledge');
  const {
    guidelines,
    knowledgeBase,
    systemPrompts,
    activePromptId,
    addGuideline,
    deleteGuideline,
    addArticle,
    deleteArticle,
    addSystemPrompt,
    setActivePrompt,
    getActivePrompt,
  } = useAdminStore();

  const [newGuideline, setNewGuideline] = useState({ name: '', content: '', priority: 1 });
  const [newArticle, setNewArticle] = useState({ title: '', content: '', category: 'news' as Category, language: 'lv' as Language });
  const [promptContent, setPromptContent] = useState(getActivePrompt()?.content || '');
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  const handleAddGuideline = () => {
    if (!newGuideline.name || !newGuideline.content) return;

    const guideline: Guideline = {
      id: Date.now().toString(),
      ...newGuideline,
      createdAt: new Date().toISOString(),
    };

    addGuideline(guideline);
    setNewGuideline({ name: '', content: '', priority: 1 });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'guideline' | 'article') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      
      if (type === 'guideline') {
        const guideline: Guideline = {
          id: Date.now().toString(),
          name: file.name,
          content,
          priority: 1,
          createdAt: new Date().toISOString(),
        };
        addGuideline(guideline);
      } else {
        const article: KnowledgeBaseArticle = {
          id: Date.now().toString(),
          title: file.name,
          content,
          category: 'news',
          language: 'lv',
          createdAt: new Date().toISOString(),
        };
        addArticle(article);
      }
    };
    reader.readAsText(file);
  };

  const handleAddArticle = () => {
    if (!newArticle.title || !newArticle.content) return;

    const article: KnowledgeBaseArticle = {
      id: Date.now().toString(),
      ...newArticle,
      createdAt: new Date().toISOString(),
    };

    addArticle(article);
    setNewArticle({ title: '', content: '', category: 'news', language: 'lv' });
  };

  const handleSavePrompt = () => {
    const newPrompt: SystemPrompt = {
      id: Date.now().toString(),
      content: promptContent,
      version: systemPrompts.length + 1,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    addSystemPrompt(newPrompt);
    setActivePrompt(newPrompt.id);
  };

  const tabs = [
    { id: 'knowledge' as Tab, label: 'Zināšanu Bāze', icon: FileText },
    { id: 'guidelines' as Tab, label: 'Vadlīnijas', icon: Upload },
    { id: 'prompt' as Tab, label: 'Sistēmas Prompts', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Shield className="text-primary-600" />
          Administrēšana
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Pārvaldiet sistēmas iestatījumus, vadlīnijas un zināšanu bāzi
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Knowledge Base Tab */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          {/* Add Article Form */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Pievienot Rakstu
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nosaukums
                </label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="input-field"
                  placeholder="Raksta nosaukums"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategorija
                  </label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value as Category })}
                    className="input-field"
                  >
                    <option value="news">Ziņas</option>
                    <option value="sports">Sports</option>
                    <option value="culture">Kultūra</option>
                    <option value="business">Bizness</option>
                    <option value="opinion">Viedoklis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valoda
                  </label>
                  <select
                    value={newArticle.language}
                    onChange={(e) => setNewArticle({ ...newArticle, language: e.target.value as Language })}
                    className="input-field"
                  >
                    <option value="lv">Latviešu</option>
                    <option value="ru">Krievu</option>
                    <option value="en">Angļu</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Saturs
                </label>
                <textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  className="input-field h-32"
                  placeholder="Raksta saturs..."
                />
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddArticle} className="btn-primary flex items-center gap-2">
                  <Plus size={20} />
                  Pievienot
                </button>
                <label className="btn-secondary flex items-center gap-2 cursor-pointer">
                  <Upload size={20} />
                  Augšupielādēt failu
                  <input
                    type="file"
                    accept=".txt,.md"
                    onChange={(e) => handleFileUpload(e, 'article')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Articles List */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Zināšanu Bāze ({knowledgeBase.length})
            </h2>
            <div className="space-y-3">
              {knowledgeBase.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  Nav pievienotu rakstu
                </p>
              ) : (
                knowledgeBase.map((article) => (
                  <div key={article.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded">
                            {article.category}
                          </span>
                          <span>{article.language.toUpperCase()}</span>
                          <span>{new Date(article.createdAt).toLocaleDateString('lv-LV')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guidelines Tab */}
      {activeTab === 'guidelines' && (
        <div className="space-y-6">
          {/* Add Guideline Form */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Pievienot Vadlīnijas
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nosaukums
                </label>
                <input
                  type="text"
                  value={newGuideline.name}
                  onChange={(e) => setNewGuideline({ ...newGuideline, name: e.target.value })}
                  className="input-field"
                  placeholder="Vadlīniju nosaukums (piemēram, Reuters Style Guide)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prioritāte (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newGuideline.priority}
                  onChange={(e) => setNewGuideline({ ...newGuideline, priority: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Saturs
                </label>
                <textarea
                  value={newGuideline.content}
                  onChange={(e) => setNewGuideline({ ...newGuideline, content: e.target.value })}
                  className="input-field h-48"
                  placeholder="Vadlīniju saturs..."
                />
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddGuideline} className="btn-primary flex items-center gap-2">
                  <Plus size={20} />
                  Pievienot
                </button>
                <label className="btn-secondary flex items-center gap-2 cursor-pointer">
                  <Upload size={20} />
                  Augšupielādēt failu
                  <input
                    type="file"
                    accept=".txt,.md,.pdf"
                    onChange={(e) => handleFileUpload(e, 'guideline')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Guidelines List */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Vadlīnijas ({guidelines.length})
            </h2>
            <div className="space-y-3">
              {guidelines.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  Nav pievienotu vadlīniju
                </p>
              ) : (
                guidelines
                  .sort((a, b) => b.priority - a.priority)
                  .map((guideline) => (
                    <div key={guideline.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {guideline.name}
                            </h3>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm">
                              Prioritāte: {guideline.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                            {guideline.content}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 block">
                            {new Date(guideline.createdAt).toLocaleDateString('lv-LV')}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteGuideline(guideline.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* System Prompt Tab */}
      {activeTab === 'prompt' && (
        <div className="space-y-6">
          {/* Prompt Editor */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sistēmas Prompts
              </h2>
              <button
                onClick={() => setShowPromptPreview(!showPromptPreview)}
                className="btn-secondary flex items-center gap-2"
              >
                <Eye size={20} />
                {showPromptPreview ? 'Slēpt priekšskatījumu' : 'Rādīt priekšskatījumu'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prompt Template
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Pieejamie placeholders: {'{language}'}, {'{category}'}, {'{style}'}, {'{guidelines}'}, {'{text}'}
                </p>
                <textarea
                  value={promptContent}
                  onChange={(e) => setPromptContent(e.target.value)}
                  className="input-field h-96 font-mono text-sm"
                  placeholder="Ievadiet sistēmas promptu..."
                />
              </div>

              <div className="flex gap-3">
                <button onClick={handleSavePrompt} className="btn-primary">
                  Saglabāt jaunu versiju
                </button>
                <button
                  onClick={() => {
                    const defaultPrompt = getActivePrompt();
                    if (defaultPrompt) {
                      setPromptContent(defaultPrompt.content);
                    }
                  }}
                  className="btn-secondary"
                >
                  Atjaunot uz aktīvo
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          {showPromptPreview && (
            <div className="card bg-gray-50 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Priekšskatījums
              </h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">
                {promptContent}
              </pre>
            </div>
          )}

          {/* Prompt History */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Promptu Vēsture ({systemPrompts.length})
            </h2>
            <div className="space-y-3">
              {systemPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className={`p-4 rounded-lg ${
                    prompt.id === activePromptId
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Versija {prompt.version}
                        </span>
                        {prompt.id === activePromptId && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm">
                            Aktīvs
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(prompt.createdAt).toLocaleString('lv-LV')}
                      </span>
                    </div>
                    {prompt.id !== activePromptId && (
                      <button
                        onClick={() => {
                          setActivePrompt(prompt.id);
                          setPromptContent(prompt.content);
                        }}
                        className="btn-secondary text-sm"
                      >
                        Aktivizēt
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

