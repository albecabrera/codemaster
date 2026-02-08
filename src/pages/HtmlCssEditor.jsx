
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Play, RotateCcw, Trophy, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getChallengesByLanguage } from '@/data/challengeData';
import useProgressTracking from '@/hooks/useProgressTracking';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useLanguage } from '@/contexts/LanguageContext';
import EditorContainer from '@/components/EditorContainer';
import { motion, AnimatePresence } from 'framer-motion';

function HtmlCssEditor() {
  const [difficulty, setDifficulty] = useState('Beginner');
  const [activeTab, setActiveTab] = useState('html');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [showHints, setShowHints] = useState(false);
  
  const textareaRef = useRef(null);
  const { toast } = useToast();
  const { t, language } = useLanguage(); // Get language
  const { completeChallenge, progress } = useProgressTracking();
  
  const isHtml = activeTab === 'html';
  const setCode = isHtml ? setHtmlCode : setCssCode;
  const code = isHtml ? htmlCode : cssCode;
  
  const { editorState } = useKeyboardShortcuts(textareaRef, code, setCode);
  const challenges = getChallengesByLanguage('html-css');

  useEffect(() => {
    const challenge = challenges.find(c => c.difficulty === difficulty);
    if (challenge) {
      setCurrentChallenge(challenge);
      setHtmlCode(challenge.initialCode.html);
      setCssCode(challenge.initialCode.css);
    }
  }, [difficulty]);

  const handleReset = () => {
    if (currentChallenge) {
      setHtmlCode(currentChallenge.initialCode.html);
      setCssCode(currentChallenge.initialCode.css);
      toast({
        title: t('editor.resetTitle'),
        description: t('editor.resetDesc')
      });
    }
  };

  const handleValidate = () => {
    if (!currentChallenge) return;
    const isCompleted = progress.completedChallenges.includes(currentChallenge.id);

    if (isCompleted) {
      toast({
        title: t('editor.alreadyCompleted'),
        description: t('editor.alreadyCompletedDesc'),
        variant: 'default'
      });
      return;
    }

    const hasContent = htmlCode.trim().length > 50 && cssCode.trim().length > 20;

    if (hasContent) {
      // Pass translated achievement data
      const achievementData = currentChallenge.achievement ? {
        ...currentChallenge.achievement,
        name: currentChallenge.achievement.translations[language].name,
        description: currentChallenge.achievement.translations[language].description
      } : null;

      completeChallenge(currentChallenge.id, currentChallenge.points, achievementData);
      
      toast({
        title: t('editor.success'),
        description: t('editor.successDesc', { points: currentChallenge.points })
      });
    } else {
      toast({
        title: t('editor.error'),
        description: t('editor.errorDesc'),
        variant: 'destructive'
      });
    }
  };

  const getPreviewContent = () => `
    <!DOCTYPE html>
    <html>
      <head><style>${cssCode}</style></head>
      <body>${htmlCode}</body>
    </html>
  `;

  if (!currentChallenge) return <div className="h-screen flex items-center justify-center dark:text-white">{t('editor.loading')}</div>;

  // Get current language content
  const challengeContent = currentChallenge.translations[language] || currentChallenge.translations['en'];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
        >
          {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(d => (
            <option key={d} value={d}>{t(`editor.difficulties.${d}`)}</option>
          ))}
        </select>
        
        <div>
          <h2 className="text-xl font-bold mb-1">{challengeContent.title}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded text-xs font-medium">
              {t(`editor.difficulties.${currentChallenge.difficulty}`)}
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {currentChallenge.points} pts
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          {challengeContent.description}
        </p>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHints(!showHints)}
          className="w-full justify-between text-blue-500 hover:text-blue-600 dark:text-blue-400"
        >
          <span className="flex items-center gap-2"><Lightbulb className="w-4 h-4" /> {t('editor.hints')}</span>
          <span className="text-xs">{showHints ? t('editor.hideHints') : t('editor.showHints')}</span>
        </Button>
        
        <AnimatePresence>
          {showHints && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg overflow-hidden"
            >
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-300">
                {challengeContent.hints.map((hint, index) => <li key={index}>{hint}</li>)}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
         <Button onClick={handleValidate} className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-md">
            <Play className="w-4 h-4 mr-2" /> {t('editor.validate')}
         </Button>
         <Button onClick={handleReset} variant="outline" size="icon">
            <RotateCcw className="w-4 h-4" />
         </Button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>{t('nav.html')} - {t('common.appName')}</title></Helmet>
      
      <EditorContainer
        editorState={editorState}
        sidebarContent={<SidebarContent />}
        terminalContent={
          <iframe
            srcDoc={getPreviewContent()}
            title="Preview"
            className="w-full h-full bg-white"
            sandbox="allow-scripts"
          />
        }
      >
        <div className="flex flex-col h-full relative">
          {!editorState.presentationMode && (
             <div className="flex border-b border-gray-200 dark:border-gray-700">
               {['html', 'css'].map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                     activeTab === tab 
                       ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10'
                       : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                   }`}
                 >
                   {t(`editor.tabs.${tab}`)}
                 </button>
               ))}
             </div>
          )}
          
          <div className="flex-1 flex relative">
            {editorState.showLineNumbers && (
              <div 
                className="bg-gray-50 dark:bg-[#1e1e1e] text-gray-400 dark:text-gray-500 p-4 pt-4 text-right select-none font-mono border-r border-gray-200 dark:border-gray-700 flex-none w-12"
                style={{ fontSize: `${editorState.fontSize}px`, lineHeight: '1.5' }}
              >
                {code.split('\n').map((_, i) => (
                  <div key={i} className={editorState.highlightedLine === i ? 'text-yellow-500 font-bold' : ''}>
                    {i + 1}
                  </div>
                ))}
              </div>
            )}
            
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-mono focus:outline-none resize-none whitespace-pre"
              style={{ fontSize: `${editorState.fontSize}px`, lineHeight: '1.5' }}
              spellCheck={false}
            />
            
            {editorState.highlightedLine !== null && (
               <div 
                 className="absolute left-0 right-0 pointer-events-none bg-yellow-500/20 dark:bg-yellow-400/10 transition-opacity duration-300"
                 style={{
                   top: `${(editorState.highlightedLine * (editorState.fontSize * 1.5)) + 16}px`,
                   height: `${editorState.fontSize * 1.5}px`
                 }}
               />
            )}
          </div>
        </div>
      </EditorContainer>
    </>
  );
}

export default HtmlCssEditor;
