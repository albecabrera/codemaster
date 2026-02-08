
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEmmetSuggestions } from '@/utils/EmmetEngine';
import { Sparkles, Code2, Hash, FileCode } from 'lucide-react';

const EmmetAutocompleteDropdown = ({
  input,
  visible,
  position,
  onSelect,
  onClose,
  type = 'html'
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    if (visible && input) {
      const results = getEmmetSuggestions(input, type);
      setSuggestions(results);
      setActiveIndex(0);
    }
  }, [input, visible, type]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!visible || suggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter') {
        // Confirm selection with Enter
        e.preventDefault();
        e.stopPropagation();
        onSelect(suggestions[activeIndex]);
      } else if (e.key === 'Tab') {
        // Allow Tab to propagate to editor for indentation
        // Do NOT preventDefault here
        return;
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    // Use capture phase to handle events before the editor/textarea
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [visible, suggestions, activeIndex, onSelect, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && visible) {
      const activeEl = listRef.current.children[activeIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, visible]);

  if (!visible || suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed z-[9999] w-72 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl overflow-hidden flex flex-col font-sans"
        style={{
          left: position.left,
          top: position.top + 24
        }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3 h-3" />
          <span>Emmet Suggestions</span>
        </div>

        <div ref={listRef} className="max-h-64 overflow-y-auto p-1 bg-white dark:bg-[#1e1e1e]">
          {suggestions.map((item, index) => (
            <div
              key={index}
              onClick={() => onSelect(item)}
              className={`
                group flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors
                ${index === activeIndex 
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800' 
                  : 'hover:bg-gray-50 dark:hover:bg-[#2d2d2d] border-transparent'}
                border
              `}
            >
              <div className={`
                p-1.5 rounded-md flex-shrink-0
                ${item.type === 'tag' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                ${item.type === 'css' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                ${item.type === 'snippet' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : ''}
              `}>
                {item.type === 'tag' && <Code2 className="w-4 h-4" />}
                {item.type === 'css' && <Hash className="w-4 h-4" />}
                {item.type === 'snippet' && <FileCode className="w-4 h-4" />}
              </div>
              
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-mono text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                  {item.label}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono opacity-80">
                  {item.preview}
                </span>
              </div>
              
              {index === activeIndex && (
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider flex-shrink-0">
                  Enter
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="px-3 py-1.5 bg-gray-50 dark:bg-[#252526] border-t border-gray-200 dark:border-gray-700 flex justify-between text-[10px] text-gray-500 font-medium">
           <span>Enter to select</span>
           <span>Esc to close</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmmetAutocompleteDropdown;
