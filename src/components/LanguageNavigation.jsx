
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllLanguages } from '@/utils/LanguageColorConfig';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles } from 'lucide-react';
import LanguageIconComponent from '@/components/LanguageIconComponent';

const LanguageNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const languages = getAllLanguages();

  const getLanguageName = (key) => {
      // Map config name to translation key
      const map = {
          'JavaScript': 'javascript',
          'HTML': 'html',
          'CSS': 'html', // CSS usually grouped with HTML in navigation
          'Python': 'python',
          'Java': 'java'
      };
      return t(`nav.${map[key] || key.toLowerCase()}`);
  };

  // Filter out duplicates (HTML and CSS map to same path usually)
  const uniqueLinks = languages.reduce((acc, lang) => {
    if (!acc.some(l => l.path === lang.path)) {
      acc.push(lang);
    }
    return acc;
  }, []);

  return (
    <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {uniqueLinks.map((lang) => {
        const isActive = location.pathname === lang.path;
        const color = lang.color;

        return (
          <Link
            key={lang.name}
            to={lang.path}
            className={`
              relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all group
              ${isActive ? 'bg-opacity-10 dark:bg-opacity-20' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}
            `}
            style={{ 
              backgroundColor: isActive ? `${color}20` : 'transparent',
              color: isActive ? color : undefined 
            }}
          >
            <LanguageIconComponent 
              language={lang.name} 
              size="sm" 
              className="transition-transform group-hover:scale-110" 
            />
            <span className="hidden sm:inline">{getLanguageName(lang.name)}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 border-2 rounded-full pointer-events-none"
                style={{ borderColor: color }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        );
      })}
      
      {/* Creative Playground Link */}
      <Link
        to="/creative"
        className={`
          relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all group
          ${location.pathname === '/creative' 
            ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}
        `}
      >
        <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
        <span className="hidden sm:inline">{t('nav.creative')}</span>
        {location.pathname === '/creative' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 border-2 border-purple-500 rounded-full pointer-events-none"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>
    </nav>
  );
};

export default LanguageNavigation;
