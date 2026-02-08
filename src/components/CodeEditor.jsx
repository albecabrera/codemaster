
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CodeEditor = React.forwardRef(({ 
  code, 
  onChange, 
  language = 'javascript', 
  editorState, 
  className = '' 
}, ref) => {
  const { showLineNumbers, fontSize, highlightedLine } = editorState;
  
  // Determine accent color based on language
  const getAccentColor = () => {
    switch(language.toLowerCase()) {
      case 'html': return 'text-orange-600 dark:text-orange-400';
      case 'css': return 'text-blue-600 dark:text-blue-400';
      case 'javascript': return 'text-yellow-600 dark:text-yellow-400';
      case 'python': return 'text-blue-500 dark:text-blue-300';
      case 'java': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const accentColorClass = getAccentColor();

  return (
    <div className={`flex h-full relative font-mono text-sm ${className}`}>
      {showLineNumbers && (
        <div 
          className="bg-gray-50 dark:bg-[#1e1e1e] text-gray-400 dark:text-gray-600 p-4 pt-4 text-right select-none border-r border-gray-200 dark:border-gray-700 flex-none w-12 overflow-hidden"
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
        >
          {code.split('\n').map((_, i) => (
            <div 
              key={i} 
              className={`${highlightedLine === i ? accentColorClass + ' font-bold' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex-1 relative">
         <textarea
          ref={ref}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-4 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 focus:outline-none resize-none whitespace-pre"
          style={{ 
            fontSize: `${fontSize}px`, 
            lineHeight: '1.5', 
            tabSize: 2 
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
        
        {highlightedLine !== null && (
           <div 
             className="absolute left-0 right-0 pointer-events-none bg-yellow-500/10 dark:bg-yellow-400/10 transition-opacity duration-300"
             style={{ 
               top: `${(highlightedLine * (fontSize * 1.5)) + 16}px`, 
               height: `${fontSize * 1.5}px` 
             }}
           />
        )}
      </div>
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;
