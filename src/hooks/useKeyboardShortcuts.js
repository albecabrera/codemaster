
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useKeyboardShortcuts = (textareaRef, code, setCode) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [editorState, setEditorState] = useState({
    sidebarVisible: true,
    terminalVisible: true,
    presentationMode: false,
    fontSize: 16,
    showLineNumbers: true,
    highlightedLine: null,
    triggerConfetti: false
  });

  const triggerConfetti = () => {
    setEditorState(prev => ({ ...prev, triggerConfetti: true }));
    toast({ description: t('toasts.confetti'), duration: 2000 });
    setTimeout(() => {
      setEditorState(prev => ({ ...prev, triggerConfetti: false }));
    }, 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for modifier keys
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;
      const altKey = e.altKey; 
      const shiftKey = e.shiftKey;

      // Prevent default helper
      const prevent = () => {
        e.preventDefault();
        e.stopPropagation();
      };

      // Toggle Sidebar: Cmd/Ctrl + B
      if (cmdKey && (e.code === 'KeyB' || e.key === 'b')) {
        prevent();
        setEditorState(prev => ({ ...prev, sidebarVisible: !prev.sidebarVisible }));
        toast({ description: t('toasts.sidebarToggled') });
      }

      // Toggle Terminal: Cmd/Ctrl + J
      if (cmdKey && (e.code === 'KeyJ' || e.key === 'j')) {
        prevent();
        setEditorState(prev => ({ ...prev, terminalVisible: !prev.terminalVisible }));
        toast({ description: t('toasts.terminalToggled') });
      }

      // Presentation Mode: Alt + P
      if (altKey && (e.code === 'KeyP' || e.key === 'p')) {
        prevent();
        setEditorState(prev => ({ ...prev, presentationMode: !prev.presentationMode }));
        toast({ description: t('toasts.presentationMode') });
      }

      // Zoom In: Cmd/Ctrl + +
      if (cmdKey && (e.key === '=' || e.key === '+')) {
        prevent();
        setEditorState(prev => ({ ...prev, fontSize: Math.min(32, prev.fontSize + 2) }));
        toast({ description: t('toasts.fontSizeIncreased') });
      }

      // Zoom Out: Cmd/Ctrl + -
      if (cmdKey && e.key === '-') {
        prevent();
        setEditorState(prev => ({ ...prev, fontSize: Math.max(10, prev.fontSize - 2) }));
        toast({ description: t('toasts.fontSizeDecreased') });
      }

      // Toggle Line Numbers: Alt + L
      if (altKey && (e.code === 'KeyL' || e.key === 'l')) {
        prevent();
        setEditorState(prev => ({ ...prev, showLineNumbers: !prev.showLineNumbers }));
        toast({ description: t('toasts.lineNumbersToggled') });
      }

      // Confetti: Ctrl + P (Explicitly Ctrl on all platforms per requirement)
      if (e.ctrlKey && (e.code === 'KeyP' || e.key === 'p')) {
        prevent();
        triggerConfetti();
      }

      // Text Manipulation - Requires textarea focus
      if (document.activeElement === textareaRef?.current && textareaRef?.current) {
        const ta = textareaRef.current;
        const val = ta.value;
        const pos = ta.selectionStart;
        const lines = val.split('\n');
        const lineIndex = val.substring(0, pos).split('\n').length - 1;
        const colIndex = pos - val.substring(0, pos).lastIndexOf('\n') - 1;

        const updateCodeAndCursor = (newLines, newLineIndex) => {
           const newCode = newLines.join('\n');
           setCode(newCode);
           
           let newPos = 0;
           for(let i=0; i<newLineIndex; i++) newPos += newLines[i].length + 1;
           newPos += Math.min(colIndex, newLines[newLineIndex].length);
           
           setTimeout(() => {
             ta.setSelectionRange(newPos, newPos);
             ta.focus();
           }, 0);
        };

        // Tab: Insert Indentation (2 spaces)
        if (e.key === 'Tab' && !shiftKey && !altKey && !cmdKey) {
            prevent();
            const newValue = val.substring(0, pos) + '  ' + val.substring(ta.selectionEnd);
            setCode(newValue);
            setTimeout(() => {
                ta.setSelectionRange(pos + 2, pos + 2);
            }, 0);
        }

        // Cmd/Ctrl + D: Duplicate Line
        if (cmdKey && (e.key === 'd' || e.key === 'D')) {
            prevent();
            const newLines = [...lines];
            newLines.splice(lineIndex + 1, 0, newLines[lineIndex]);
            updateCodeAndCursor(newLines, lineIndex + 1);
            toast({ description: t('toasts.lineDuplicatedDown') });
        }

        // Cmd/Ctrl + /: Toggle Comment (Simple Wrapper)
        if (cmdKey && e.key === '/') {
            prevent();
            const line = lines[lineIndex];
            // Simple generic toggle (detects // or # depending on context - naive here)
            // Assuming this hook is used for JS/Python mostly
            let newLine = line;
            if (line.trim().startsWith('//')) {
                newLine = line.replace('// ', '').replace('//', '');
            } else {
                newLine = `// ${line}`;
            }
            const newLines = [...lines];
            newLines[lineIndex] = newLine;
            updateCodeAndCursor(newLines, lineIndex);
        }

        // Move Line Up: Alt + Up
        if (altKey && e.key === 'ArrowUp') {
            prevent();
            if (lineIndex > 0) {
                const newLines = [...lines];
                [newLines[lineIndex], newLines[lineIndex - 1]] = [newLines[lineIndex - 1], newLines[lineIndex]];
                updateCodeAndCursor(newLines, lineIndex - 1);
            }
        }

        // Move Line Down: Alt + Down
        if (altKey && e.key === 'ArrowDown') {
            prevent();
            if (lineIndex < lines.length - 1) {
                const newLines = [...lines];
                [newLines[lineIndex], newLines[lineIndex + 1]] = [newLines[lineIndex + 1], newLines[lineIndex]];
                updateCodeAndCursor(newLines, lineIndex + 1);
            }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, setCode, textareaRef, t, toast]);

  return { editorState, setEditorState };
};
