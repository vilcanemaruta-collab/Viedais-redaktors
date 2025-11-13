import { Settings as SettingsIcon, Check } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import type { Language, Category, Style } from '../types';

export default function Settings() {
  const { language, category, style, setLanguage, setCategory, setStyle, reset } = useSettingsStore();

  const languages: { value: Language; label: string; flag: string }[] = [
    { value: 'lv', label: 'Latviešu', flag: '🇱🇻' },
    { value: 'ru', label: 'Krievu', flag: '🇷🇺' },
    { value: 'en', label: 'Angļu', flag: '🇬🇧' },
  ];

  const categories: { value: Category; label: string; description: string }[] = [
    { value: 'news', label: 'Ziņas', description: 'Aktuālās ziņas un notikumi' },
    { value: 'sports', label: 'Sports', description: 'Sporta ziņas un rezultāti' },
    { value: 'culture', label: 'Kultūra', description: 'Kultūras notikumi un recenzijas' },
    { value: 'business', label: 'Bizness', description: 'Ekonomika un uzņēmējdarbība' },
    { value: 'opinion', label: 'Viedoklis', description: 'Komentāri un viedokļi' },
  ];

  const styles: { value: Style; label: string; description: string }[] = [
    { value: 'formal', label: 'Formāls', description: 'Oficiāls, profesionāls stils' },
    { value: 'neutral', label: 'Neitrāls', description: 'Līdzsvarots, objektīvs stils' },
    { value: 'informal', label: 'Neformāls', description: 'Draudzīgs, pieejams stils' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <SettingsIcon className="text-primary-600" />
          Teksta Iestatījumi
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Izvēlieties valodu, kategoriju un stilu teksta analīzei
        </p>
      </div>

      {/* Language Selection */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Valoda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => setLanguage(lang.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                language === lang.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{lang.flag}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {lang.label}
                  </span>
                </div>
                {language === lang.value && (
                  <Check className="text-primary-600" size={20} />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Kategorija
        </h2>
        <div className="space-y-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                category === cat.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {cat.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {cat.description}
                  </div>
                </div>
                {category === cat.value && (
                  <Check className="text-primary-600 flex-shrink-0" size={20} />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Stils
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {styles.map((s) => (
            <button
              key={s.value}
              onClick={() => setStyle(s.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                style === s.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              <div className="text-center">
                <div className="font-medium text-gray-900 dark:text-white mb-2">
                  {s.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {s.description}
                </div>
                {style === s.value && (
                  <Check className="text-primary-600 mx-auto mt-2" size={20} />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="card bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Atiestatīt uz noklusējumu
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Atgriezt visus iestatījumus uz sākotnējām vērtībām
            </p>
          </div>
          <button
            onClick={reset}
            className="btn-secondary"
          >
            Atiestatīt
          </button>
        </div>
      </div>

      {/* Current Settings Summary */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Pašreizējie iestatījumi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Valoda:</span>
            <span className="ml-2 text-blue-900 dark:text-blue-100">
              {languages.find(l => l.value === language)?.label}
            </span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Kategorija:</span>
            <span className="ml-2 text-blue-900 dark:text-blue-100">
              {categories.find(c => c.value === category)?.label}
            </span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Stils:</span>
            <span className="ml-2 text-blue-900 dark:text-blue-100">
              {styles.find(s => s.value === style)?.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

