
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Copy, ExternalLink, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const DOCS_DATA = [
  {
    category: "Basics",
    items: [
      { abbr: "div", desc: "Tag Name", result: "<div></div>" },
      { abbr: "div.class", desc: "Class", result: '<div class="class"></div>' },
      { abbr: "div#id", desc: "ID", result: '<div id="id"></div>' },
      { abbr: "div{text}", desc: "Text Content", result: "<div>text</div>" },
    ]
  },
  {
    category: "Nesting",
    items: [
      { abbr: "div>ul>li", desc: "Child", result: "<div><ul><li></li></ul></div>" },
      { abbr: "div+p", desc: "Sibling", result: "<div></div><p></p>" },
      { abbr: "ul>li*3", desc: "Multiplication", result: "<ul><li></li><li></li><li></li></ul>" },
    ]
  },
  {
    category: "CSS Properties",
    items: [
      { abbr: "m10", desc: "Margin", result: "margin: 10px;" },
      { abbr: "p20", desc: "Padding", result: "padding: 20px;" },
      { abbr: "df", desc: "Display Flex", result: "display: flex;" },
      { abbr: "jcc", desc: "Justify Center", result: "justify-content: center;" },
      { abbr: "aic", desc: "Align Center", result: "align-items: center;" },
      { abbr: "bg#f00", desc: "Background Color", result: "background: #f00;" },
    ]
  }
];

function EmmetDocumentation() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = DOCS_DATA.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.abbr.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <>
      <Helmet>
        <title>Emmet Documentation - CodeMaster</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-4">
              Emmet Quick Reference
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Boost your coding speed with these essential abbreviations.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-12 max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search abbreviations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-sm"
            />
          </div>

          {/* Docs Grid */}
          <div className="space-y-8">
            {filteredDocs.map((category, idx) => (
              <motion.div 
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-green-500" />
                    {category.category}
                  </h2>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {category.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                      <div className="md:col-span-3 font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center">
                        {item.abbr}
                      </div>
                      <div className="md:col-span-3 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        {item.desc}
                      </div>
                      <div className="md:col-span-6 font-mono text-sm bg-gray-100 dark:bg-gray-950 p-2 rounded text-green-700 dark:text-green-400 overflow-x-auto whitespace-nowrap flex items-center justify-between">
                         <span>{item.result}</span>
                         <button 
                           onClick={() => navigator.clipboard.writeText(item.abbr)}
                           className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-all"
                           title="Copy Abbreviation"
                         >
                           <Copy className="w-3 h-3 text-gray-500" />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
             <a 
               href="https://docs.emmet.io/cheat-sheet/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium transition-colors"
             >
               View Official Emmet Documentation <ExternalLink className="w-4 h-4" />
             </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmmetDocumentation;
