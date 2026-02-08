
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, ChevronUp, ChevronDown, Command, Option } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ShortcutsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const getKey = (key) => {
    if (key === 'Cmd') return isMac ? <Command className="w-3 h-3" /> : 'Ctrl';
    if (key === 'Opt') return isMac ? <Option className="w-3 h-3" /> : 'Alt';
    return key;
  };

  const shortcuts = [
    { keys: ['Cmd', 'B'], desc: t('editor.toggleSidebar') },
    { keys: ['Cmd', 'J'], desc: t('editor.toggleTerminal') },
    { keys: ['Opt', 'P'], desc: t('editor.presentationMode') },
    { keys: ['Cmd', '+/-'], desc: t('editor.fontSize') },
    { keys: ['Opt', 'L'], desc: t('editor.toggleLineNumbers') },
    { keys: ['Cmd', 'L'], desc: t('editor.highlightLine') },
    { keys: ['Opt', '↑/↓'], desc: t('editor.moveLine') },
    { keys: ['Shift', 'Cmd', '↑/↓'], desc: t('editor.duplicateLine') },
    { keys: ['Ctrl', 'P'], desc: t('editor.confetti') }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden w-72 sm:w-80"
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                {t('editor.shortcutsPanel')}
              </span>
            </div>
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-colors text-xs sm:text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{s.desc}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k, ki) => (
                      <kbd key={ki} className="flex items-center justify-center px-1.5 py-1 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 font-mono text-xs min-w-[20px]">
                        {getKey(k)}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
      >
        <Keyboard className="w-4 h-4" />
        <span className="hidden sm:inline">{t('editor.shortcuts')}</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default ShortcutsPanel;
