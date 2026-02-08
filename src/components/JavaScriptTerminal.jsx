
import React, { useEffect, useRef } from 'react';
import { Trash2, Terminal, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const JavaScriptTerminal = ({ logs, onClear }) => {
  const endRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogStyle = (type) => {
    switch (type) {
      case 'error': return 'text-red-500 bg-red-50 dark:bg-red-900/10 border-l-2 border-red-500';
      case 'warn': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10 border-l-2 border-yellow-500';
      case 'result': return 'text-green-600 bg-green-50 dark:bg-green-900/10 border-l-2 border-green-500';
      default: return 'text-gray-800 dark:text-gray-200 border-l-2 border-transparent';
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />;
      case 'warn': return <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />;
      default: return <span className="w-3 h-3 block flex-shrink-0" />; // Spacer
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#252526] text-sm font-mono border-t border-gray-200 dark:border-gray-700">
      {/* Terminal Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-[#2d2d2d] border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium">
          <Terminal className="w-4 h-4" />
          <span>{t('editor.console')}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="h-6 px-2 text-gray-500 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {logs.length === 0 ? (
          <div className="text-gray-400 dark:text-gray-600 italic p-2 text-center mt-4">
            {t('editor.output.ready')}
          </div>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index} 
              className={`p-2 rounded flex gap-2 font-mono text-sm leading-relaxed break-all ${getLogStyle(log.type)}`}
            >
              {getLogIcon(log.type)}
              <div className="flex-1">
                 <div className="whitespace-pre-wrap">{log.content}</div>
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-600 select-none flex-shrink-0 self-start">
                {log.timestamp}
              </span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default JavaScriptTerminal;
