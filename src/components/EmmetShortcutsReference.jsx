
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = {
  HTML: [
    { code: 'div', desc: 'Generic Container', example: '<div></div>' },
    { code: 'a', desc: 'Anchor Link', example: '<a href="#"></a>' },
    { code: 'ul>li*3', desc: 'List with 3 items', example: '<ul>\n  <li></li>\n  <li></li>\n  <li></li>\n</ul>' },
    { code: '.class', desc: 'Class shorthand', example: '<div class="class"></div>' },
    { code: '#id', desc: 'ID shorthand', example: '<div id="id"></div>' },
    { code: 'input:t', desc: 'Input Text', example: '<input type="text" />' },
  ],
  CSS: [
    { code: 'm10', desc: 'Margin 10px', example: 'margin: 10px;' },
    { code: 'p20', desc: 'Padding 20px', example: 'padding: 20px;' },
    { code: 'df', desc: 'Display Flex', example: 'display: flex;' },
    { code: 'aic', desc: 'Align Items Center', example: 'align-items: center;' },
    { code: 'jcc', desc: 'Justify Content Center', example: 'justify-content: center;' },
    { code: 'w100p', desc: 'Width 100%', example: 'width: 100%;' },
    { code: 'bd+', desc: 'Border 1px solid', example: 'border: 1px solid #000;' },
  ]
};

const EmmetShortcutsReference = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSections, setOpenSections] = useState({ HTML: true, CSS: true });

  const toggleSection = (sec) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#1e1e1e] border-l border-gray-200 dark:border-gray-700 w-80">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-lg mb-2">Cheat Sheet</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search shortcuts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-[#2d2d2d] border-transparent rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {Object.entries(CATEGORIES).map(([category, items]) => {
          const filteredItems = items.filter(i => 
            i.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
            i.desc.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(category)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-[#252526] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors"
              >
                <span className="font-semibold text-sm">{category}</span>
                {openSections[category] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              <AnimatePresence>
                {openSections[category] && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {filteredItems.map((item, idx) => (
                        <div key={idx} className="p-3 bg-white dark:bg-[#1e1e1e] hover:bg-gray-50 dark:hover:bg-[#252526] group">
                          <div className="flex items-center justify-between mb-1">
                            <code className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                              {item.code}
                            </code>
                            <button 
                              onClick={() => copyToClipboard(item.code)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-opacity"
                              title="Copy"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{item.desc}</p>
                          <div className="text-[10px] text-gray-400 font-mono truncate opacity-60">
                            {item.example}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmmetShortcutsReference;
