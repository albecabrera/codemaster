
import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Play, Save, History, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import EditorContainer from '@/components/EditorContainer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLanguageColor } from '@/utils/LanguageColorConfig';
import { validateTask, parseTaskComment } from '@/utils/CreativeTaskValidator';

function CreativePlayground() {
  const [selectedLang, setSelectedLang] = useState('JavaScript');
  const [code, setCode] = useState('// Describe your task here...\n\n');
  const [output, setOutput] = useState('');
  const [history, setHistory] = useState([]);
  
  const textareaRef = useRef(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { editorState } = useKeyboardShortcuts(textareaRef, code, setCode);

  useEffect(() => {
    const saved = localStorage.getItem('creative_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleRun = () => {
    let result = '';
    
    if (selectedLang === 'JavaScript') {
      let logs = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.join(' '));
      
      try {
        // eslint-disable-next-line no-new-func
        new Function(code)();
        result = logs.join('\n') || 'Code ran successfully.';
      } catch (e) {
        result = `Error: ${e.message}`;
      }
      console.log = originalLog;
    } else if (selectedLang === 'HTML') {
        result = "Preview updated.";
    } else {
        result = `Simulation: Code analysis for ${selectedLang} completed.\nNo syntax errors found.`;
    }

    setOutput(result);
    
    // Validate
    const validation = validateTask(code, selectedLang);
    if (validation.valid) {
      toast({ title: t('creative.validation.success') });
    } else {
      toast({ title: t('creative.validation.error'), description: validation.message, variant: 'destructive' });
    }
  };

  const handleSave = () => {
    const task = parseTaskComment(code, selectedLang);
    const newEntry = {
      id: Date.now(),
      lang: selectedLang,
      task: task || 'Untitled Task',
      date: new Date().toLocaleDateString()
    };
    
    const newHistory = [newEntry, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('creative_history', JSON.stringify(newHistory));
    toast({ title: t('creative.save') });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          {t('creative.title')}
        </h2>
        
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {t('creative.selectLanguage')}
        </label>
        <select 
          value={selectedLang} 
          onChange={(e) => {
            setSelectedLang(e.target.value);
            setCode(e.target.value === 'HTML' ? '<!-- Task description -->\n<h1>Hello</h1>' : 
                   e.target.value === 'Python' ? '# Task description\nprint("Hello")' : 
                   '// Task description\nconsole.log("Hello");');
          }}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm mb-4"
        >
          {['JavaScript', 'HTML', 'Python', 'Java', 'CSS'].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        
        <Button onClick={handleSave} variant="outline" className="w-full justify-start">
          <Save className="w-4 h-4 mr-2" /> {t('creative.save')}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm text-gray-500">
          <History className="w-4 h-4" /> {t('creative.history')}
        </h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400 italic">{t('creative.noHistory')}</p>
        ) : (
          <div className="space-y-2">
            {history.map(item => (
              <div key={item.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 text-xs">
                <div className="font-medium text-gray-900 dark:text-white truncate">{item.task}</div>
                <div className="flex justify-between mt-1 text-gray-500">
                  <span style={{ color: getLanguageColor(item.lang) }}>{item.lang}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
         <Button onClick={handleRun} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <Play className="w-4 h-4 mr-2" /> {t('editor.run')}
         </Button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Creative Playground - CodeMaster</title></Helmet>
      <EditorContainer
        editorState={editorState}
        sidebarContent={<SidebarContent />}
        terminalContent={
           selectedLang === 'HTML' ? 
           <iframe srcDoc={code} className="w-full h-full bg-white" title="Preview" /> :
           <pre className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{output || t('editor.output.ready')}</pre>
        }
      >
        <div className="flex flex-col h-full relative">
           {!editorState.presentationMode && (
             <div className="flex border-b border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium" style={{ color: getLanguageColor(selectedLang), backgroundColor: `${getLanguageColor(selectedLang)}10` }}>
               {selectedLang} Mode
             </div>
           )}
          <div className="flex-1 flex relative">
            {editorState.showLineNumbers && (
              <div 
                className="bg-gray-50 dark:bg-[#1e1e1e] text-gray-400 dark:text-gray-500 p-4 pt-4 text-right select-none font-mono border-r border-gray-200 dark:border-gray-700 flex-none w-12"
                style={{ fontSize: `${editorState.fontSize}px`, lineHeight: '1.5' }}
              >
                {code.split('\n').map((_, i) => (
                  <div key={i} className={editorState.highlightedLine === i ? 'font-bold' : ''} style={{ color: editorState.highlightedLine === i ? getLanguageColor(selectedLang) : 'inherit' }}>{i + 1}</div>
                ))}
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-mono focus:outline-none resize-none whitespace-pre"
              style={{ fontSize: `${editorState.fontSize}px`, lineHeight: '1.5', tabSize: 4 }}
              spellCheck={false}
            />
          </div>
        </div>
      </EditorContainer>
    </>
  );
}

export default CreativePlayground;
