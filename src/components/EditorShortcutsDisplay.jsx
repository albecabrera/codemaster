
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Keyboard } from 'lucide-react';

const EditorShortcutsDisplay = ({ editorState }) => {
  const { t } = useLanguage();

  const shortcuts = [
    { keys: ['Cmd', 'B'], desc: 'Toggle Sidebar', active: !editorState.sidebarVisible },
    { keys: ['Cmd', 'J'], desc: 'Toggle Terminal', active: !editorState.terminalVisible },
    { keys: ['Opt', 'P'], desc: 'Presentation Mode', active: editorState.presentationMode },
    { keys: ['Cmd', '+/-'], desc: 'Font Size' },
    { keys: ['Opt', 'L'], desc: 'Toggle Line Numbers', active: editorState.showLineNumbers },
    { keys: ['Cmd', 'L'], desc: 'Highlight Line' },
    { keys: ['Opt', '↑/↓'], desc: 'Move Line' },
    { keys: ['Shift', 'Cmd', '↑/↓'], desc: 'Duplicate Line' },
    { keys: ['Ctrl', 'P'], desc: 'Confetti Party!' },
    { keys: ['Opt', ','], desc: 'Emmet Expand' },
  ];

  return (
    <div className={`hidden lg:block fixed bottom-4 right-4 p-4 rounded-lg backdrop-blur-md border transition-all duration-300 ${
      editorState.presentationMode 
        ? 'bg-gray-900/90 border-gray-700 text-gray-300' 
        : 'bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-lg'
    }`}>
      <div className="flex items-center gap-2 mb-3 font-semibold">
        <Keyboard className="w-4 h-4" />
        {t('editor.shortcuts')}
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
        {shortcuts.map((s, i) => (
          <div key={i} className={`flex items-center justify-between gap-4 ${s.active ? 'text-blue-500 font-medium' : ''}`}>
            <span>{s.desc}</span>
            <div className="flex gap-1">
              {s.keys.map(k => (
                <kbd key={k} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 font-mono text-[10px]">
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorShortcutsDisplay;
