
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Play, RotateCcw, Trophy, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getChallengesByLanguage } from '@/data/challengeData';
import useProgressTracking from '@/hooks/useProgressTracking';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useLanguage } from '@/contexts/LanguageContext';
import { executeCode } from '@/utils/SafeCodeExecutor';
import { validateOutput } from '@/utils/JavaScriptValidator';
import JavaScriptEditorLayout from '@/components/JavaScriptEditorLayout';
import { motion, AnimatePresence } from 'framer-motion';

function JavaScriptEditor() {
  const [difficulty, setDifficulty] = useState('Beginner');
  const [code, setCode] = useState('');
  const [logs, setLogs] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [showHints, setShowHints] = useState(false);
  
  const textareaRef = useRef(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { completeChallenge, progress } = useProgressTracking();
  const { editorState } = useKeyboardShortcuts(textareaRef, code, setCode);
  const challenges = getChallengesByLanguage('javascript');

  useEffect(() => {
    const challenge = challenges.find(c => c.difficulty === difficulty);
    if (challenge) {
      setCurrentChallenge(challenge);
      setCode(challenge.initialCode);
      setLogs([]);
    }
  }, [difficulty]);

  const handleReset = () => {
    if (currentChallenge) {
      setCode(currentChallenge.initialCode);
      setLogs([]);
      toast({ title: t('editor.resetTitle'), description: t('editor.resetDesc') });
    }
  };

  const handleRun = async () => {
    if (!currentChallenge) return;

    setLogs([{ type: 'info', content: t('editor.output.running'), timestamp: new Date().toLocaleTimeString() }]);

    // Execute user code
    const execution = await executeCode(code);
    
    // Update logs
    setLogs(execution.logs);

    if (execution.error) {
        toast({ title: t('editor.error'), description: 'Runtime error occurred', variant: 'destructive' });
        return;
    }

    // Validate result
    const validation = validateOutput(execution.logs, currentChallenge.expectedOutput, difficulty);
    const isCompleted = progress.completedChallenges.includes(currentChallenge.id);

    if (validation.isValid) {
        if (isCompleted) {
            toast({ title: t('editor.alreadyCompleted') });
        } else {
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
        }
    } else {
        toast({ 
            title: t('editor.error'), 
            description: t('editor.errorDesc'), 
            variant: 'destructive' 
        });
    }
  };

  if (!currentChallenge) return <div className="h-screen flex items-center justify-center dark:text-white">{t('editor.loading')}</div>;

  const challengeContent = currentChallenge.translations[language] || currentChallenge.translations['en'];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
          {['Beginner', 'Intermediate', 'Expert'].map(d => <option key={d} value={d}>{t(`editor.difficulties.${d}`)}</option>)}
        </select>
        <div>
          <h2 className="text-xl font-bold mb-1">{challengeContent.title}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded text-xs font-medium">{t(`editor.difficulties.${currentChallenge.difficulty}`)}</span>
            <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />{currentChallenge.points} pts</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{challengeContent.description}</p>
        
        <div className="mb-4">
            <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Expected Output</h4>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">
                {currentChallenge.expectedOutput}
            </div>
        </div>

        <Button variant="ghost" size="sm" onClick={() => setShowHints(!showHints)} className="w-full justify-between text-yellow-600 hover:text-yellow-700 dark:text-yellow-400">
          <span className="flex items-center gap-2"><Lightbulb className="w-4 h-4" /> {t('editor.hints')}</span>
          <span className="text-xs">{showHints ? t('editor.hideHints') : t('editor.showHints')}</span>
        </Button>
        <AnimatePresence>
          {showHints && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg overflow-hidden">
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-300">
                {challengeContent.hints.map((hint, index) => <li key={index}>{hint}</li>)}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
         <Button onClick={handleRun} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-md">
            <Play className="w-4 h-4 mr-2" /> {t('editor.run')}
         </Button>
         <Button onClick={handleReset} variant="outline" size="icon"><RotateCcw className="w-4 h-4" /></Button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>JavaScript - CodeMaster</title></Helmet>
      <JavaScriptEditorLayout
        code={code}
        setCode={setCode}
        logs={logs}
        onClearLogs={() => setLogs([])}
        sidebarContent={<SidebarContent />}
        editorState={editorState}
        textareaRef={textareaRef}
      />
    </>
  );
}

export default JavaScriptEditor;
