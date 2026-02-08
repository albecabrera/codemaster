
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EditorContainer from '@/components/EditorContainer';
import CodeEditor from '@/components/CodeEditor';
import JavaScriptTerminal from '@/components/JavaScriptTerminal';
import LanguageIconComponent from '@/components/LanguageIconComponent';

const JavaScriptEditorLayout = ({
  code,
  setCode,
  logs,
  onClearLogs,
  sidebarContent,
  editorState,
  textareaRef
}) => {
  return (
    <EditorContainer
      editorState={editorState}
      sidebarContent={sidebarContent}
      terminalContent={null} // We manage terminal manually in this layout
    >
      <div className="flex flex-col h-full relative">
        {/* File Tab */}
        {!editorState.presentationMode && (
          <div className="flex-none border-b border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50/50 dark:bg-[#252526] flex items-center gap-2">
            <LanguageIconComponent language="JavaScript" size="sm" />
            <span>script.js</span>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 min-h-0 relative">
          <CodeEditor
            ref={textareaRef}
            code={code}
            onChange={setCode}
            language="javascript"
            editorState={editorState}
          />
        </div>

        {/* Terminal Area - Integrated at bottom */}
        {!editorState.presentationMode && editorState.terminalVisible && (
          <div className="h-1/3 flex-none border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
            <JavaScriptTerminal 
              logs={logs} 
              onClear={onClearLogs} 
            />
          </div>
        )}
      </div>
    </EditorContainer>
  );
};

export default JavaScriptEditorLayout;
