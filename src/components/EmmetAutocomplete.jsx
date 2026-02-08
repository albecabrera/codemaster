
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEmmetSuggestions } from '@/utils/EmmetAbbreviationParser';
import { Sparkles } from 'lucide-react';

const EmmetAutocomplete = ({ 
  input, 
  isVisible, 
  position, 
  onSelect, 
  onClose,
  type = 'html' 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (input && isVisible) {
      const results = getEmmetSuggestions(input, type);
      setSuggestions(results);
      setSelectedIndex(0);
    }
  }, [input, isVisible, type]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isVisible || suggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(suggestions[selectedIndex]);
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab') {
          // Tab also selects
          e.preventDefault();
          onSelect(suggestions[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, suggestions, selectedIndex, onSelect, onClose]);

  if (!isVisible || suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="fixed z-50 bg-white dark:bg-[#2d2d2d] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden min-w-[200px]"
        style={{ 
            left: position.left, 
            top: position.top + 20 
        }}
      >
        <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Emmet Abbreviation
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className={`px-3 py-2 text-sm cursor-pointer flex flex-col ${
                index === selectedIndex 
                  ? 'bg-blue-50 dark:bg-blue-900/30' 
                  : 'hover:bg-gray-50 dark:hover:bg-[#353535]'
              }`}
              onClick={() => onSelect(item)}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                    {item.abbr}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider scale-75 origin-right">
                    {item.type}
                </span>
              </div>
              <span className="font-mono text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {item.expansion}
              </span>
            </div>
          ))}
        </div>
        <div className="px-2 py-1 bg-gray-50 dark:bg-[#252526] border-t border-gray-200 dark:border-gray-700 text-[10px] text-gray-400 flex justify-between">
            <span>Tab to expand</span>
            <span>Esc to close</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmmetAutocomplete;
