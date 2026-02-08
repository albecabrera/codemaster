
import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Sun, Moon, Globe, Zap, Book } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageNavigation from './LanguageNavigation';

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'es', label: 'Español' }
  ];

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent hidden md:inline-block">
            {t('common.appName')}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
           <LanguageNavigation />
           <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
           <Link to="/emmet-editor" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 flex items-center gap-1">
             <Zap className="w-3 h-3" /> Emmet Editor
           </Link>
           <Link to="/emmet-docs" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 flex items-center gap-1">
             <Book className="w-3 h-3" /> Emmet Docs
           </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{language}</span>
          </button>
          
          <AnimatePresence>
            {langMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-sm ${
                      language === lang.code
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default Header;
