
import React from 'react';
import Header from '@/components/Header';
import ShortcutsPanel from '@/components/ShortcutsPanel';
import ConfettiCanvas from '@/components/ConfettiCanvas';
import { useLanguage } from '@/contexts/LanguageContext';
import { Terminal } from 'lucide-react';

const EditorContainer = ({ 
  children, 
  editorState, 
  sidebarContent, 
  terminalContent,
  className = ""
}) => {
  const { t } = useLanguage();

  return (
    <div className={`h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-[#1e1e1e] ${className}`}>
      {/* Confetti Overlay */}
      <ConfettiCanvas active={editorState.triggerConfetti} />

      {/* Shortcuts Panel */}
      <ShortcutsPanel />

      {/* Header - Hidden in Presentation Mode */}
      {!editorState.presentationMode && (
        <div className="flex-none z-10">
          <Header />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Bar / Controls - Hidden in Presentation Mode */}
          {!editorState.presentationMode && (
            <div className="flex-none p-4 pb-0 flex gap-4 overflow-x-auto">
               {/* Passed via children mostly, but container handles structure */}
            </div>
          )}

          <div className={`flex-1 flex gap-4 p-4 ${editorState.presentationMode ? 'p-0' : 'overflow-hidden'}`}>
             {/* Sidebar - Collapsible */}
            {!editorState.presentationMode && editorState.sidebarVisible && sidebarContent && (
              <div className="w-80 flex-none hidden lg:flex flex-col bg-white dark:bg-[#252526] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                {sidebarContent}
              </div>
            )}

            {/* Editor + Terminal Vertical Split */}
            <div className="flex-1 flex flex-col min-w-0 gap-4">
              {/* Editor Component Slot */}
              <div className="flex-1 bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm relative">
                 {children}
              </div>

              {/* Terminal Slot - Collapsible */}
              {!editorState.presentationMode && editorState.terminalVisible && (
                <div className="h-1/3 flex-none bg-white dark:bg-[#252526] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm flex flex-col">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-[#2d2d2d] border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 font-medium text-sm">
                    <Terminal className="w-4 h-4" />
                    {t('editor.console')}
                  </div>
                  <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                    {terminalContent}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorContainer;
