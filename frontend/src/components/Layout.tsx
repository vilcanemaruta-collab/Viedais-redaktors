import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Settings, BarChart3, Shield, Menu, X, Moon, Sun, RefreshCw } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const location = useLocation();

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const clearCache = () => {
    if (confirm('Vai tiešām vēlaties iztīrīt cache un pārlādēt lapu?')) {
      // Clear localStorage
      const darkMode = localStorage.getItem('darkMode');
      localStorage.clear();
      if (darkMode) {
        localStorage.setItem('darkMode', darkMode);
      }
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Hard reload
      window.location.reload();
    }
  };

  const navItems = [
    { path: '/', icon: FileText, label: 'Teksta Ievade' },
    { path: '/settings', icon: Settings, label: 'Iestatījumi' },
    { path: '/analysis', icon: BarChart3, label: 'Analīze' },
    { path: '/admin', icon: Shield, label: 'Administrēšana' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            {isSidebarOpen && (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Viedais Redaktors
              </h1>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <Icon size={20} />
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {/* Clear Cache Button */}
            <button
              onClick={clearCache}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400 transition-colors"
              title={!isSidebarOpen ? 'Iztīrīt cache' : undefined}
            >
              <RefreshCw size={20} />
              {isSidebarOpen && (
                <span className="font-medium">Iztīrīt cache</span>
              )}
            </button>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              title={!isSidebarOpen ? (isDarkMode ? 'Gaišais režīms' : 'Tumšais režīms') : undefined}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              {isSidebarOpen && (
                <span className="font-medium">
                  {isDarkMode ? 'Gaišais režīms' : 'Tumšais režīms'}
                </span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

