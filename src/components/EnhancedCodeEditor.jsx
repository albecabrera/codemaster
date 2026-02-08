
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { expandEmmet, getEmmetSuggestions } from '@/utils/EmmetEngine';
import EmmetAutocompleteDropdown from './EmmetAutocompleteDropdown';
import { highlightHTML, highlightCSS } from '@/utils/syntaxHighlighter';
import { Copy, Maximize2, Minimize2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EnhancedCodeEditor = ({
  code,
  onChange,
  language = 'html',
  readOnly = false,
  className = ''
}) => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const textareaRef = useRef(null);
  const backdropRef = useRef(null);
  
  // Autocomplete State
  const [acVisible, setAcVisible] = useState(false);
  const [acInput, setAcInput] = useState('');
  const [acPosition, setAcPosition] = useState({ top: 0, left: 0 });
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // Sync scroll between textarea and syntax highlight backdrop
  const handleScroll = (e) => {
    if (backdropRef.current) {
      backdropRef.current.scrollTop = e.target.scrollTop;
      backdropRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const updateCursorPos = (e) => {
    const val = e.target.value;
    const sel = e.target.selectionStart;
    const lines = val.substr(0, sel).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    setCursorPos({ line, col });
  };

  const getLineData = (textarea) => {
    const val = textarea.value;
    const sel = textarea.selectionStart;
    const lines = val.split('\n');
    const lineIndex = val.substr(0, sel).split('\n').length - 1;
    return { val, sel, lines, lineIndex };
  };

  const handleKeyDown = (e) => {
    if (readOnly) return;
    
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdKey = isMac ? e.metaKey : e.ctrlKey;
    const textarea = e.target;

    // Ctrl/Cmd + Space : Trigger Autocomplete
    if (cmdKey && e.key === ' ') {
      e.preventDefault();
      triggerAutocomplete(textarea);
      return;
    }

    // Ctrl/Cmd + D : Duplicate Line
    if (cmdKey && (e.key === 'd' || e.key === 'D')) {
      e.preventDefault();
      duplicateLine(textarea);
      return;
    }

    // Ctrl/Cmd + / : Toggle Comment
    if (cmdKey && e.key === '/') {
      e.preventDefault();
      toggleComment(textarea);
      return;
    }

    // Tab : Indentation ONLY (No Emmet expansion on Tab)
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const { selectionStart, selectionEnd, value } = textarea;
      
      if (e.shiftKey) {
        // Shift+Tab: Un-indent (Simple implementation)
        // Check current line start
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        if (value.substring(lineStart, lineStart + 2) === '  ') {
           const newValue = value.substring(0, lineStart) + value.substring(lineStart + 2);
           onChange(newValue);
           setTimeout(() => {
             textarea.selectionStart = selectionStart - 2;
             textarea.selectionEnd = selectionEnd - 2;
           }, 0);
        }
        return;
      }
      
      // Regular Tab: Insert 2 spaces
      const newValue = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
      }, 0);
    }
    
    // Escape : Close AC
    if (e.key === 'Escape') {
      if (acVisible) {
        e.preventDefault();
        setAcVisible(false);
      }
    }
  };

  const duplicateLine = (textarea) => {
    const { val, sel, lines, lineIndex } = getLineData(textarea);
    const currentLine = lines[lineIndex];
    
    lines.splice(lineIndex + 1, 0, currentLine);
    const newValue = lines.join('\n');
    
    onChange(newValue);
    setTimeout(() => {
      // Move cursor to same column on new line
      const colIndex = sel - val.lastIndexOf('\n', sel - 1) - 1;
      const newSel = val.length + 1; // Approximate end for simplicity, or calc exact
      
      // Calculate exact position
      let pos = 0;
      for (let i = 0; i <= lineIndex; i++) pos += lines[i].length + 1; // +1 for newline
      // pos is now start of duplicated line
      textarea.selectionStart = textarea.selectionEnd = pos + Math.min(colIndex, currentLine.length);
    }, 0);
    
    toast({ description: "Line duplicated", duration: 1000 });
  };

  const toggleComment = (textarea) => {
    const { val, sel, lines, lineIndex } = getLineData(textarea);
    const line = lines[lineIndex];
    const spaces = line.match(/^\s*/)[0];
    const content = line.trim();
    
    if (!content) return; // Skip empty lines

    let newLine = line;
    
    if (language === 'html') {
      if (content.startsWith('<!--') && content.endsWith('-->')) {
        // Uncomment
        newLine = spaces + content.slice(4, -3).trim();
      } else {
        // Comment
        newLine = spaces + `<!-- ${content} -->`;
      }
    } else {
      // CSS / JS
      if (content.startsWith('/*') && content.endsWith('*/')) {
        newLine = spaces + content.slice(2, -2).trim();
      } else {
        newLine = spaces + `/* ${content} */`;
      }
    }

    lines[lineIndex] = newLine;
    const newValue = lines.join('\n');
    
    // Preserve relative cursor position if possible
    const cursorOffset = sel - val.lastIndexOf('\n', sel - 1) - 1;
    
    onChange(newValue);
    setTimeout(() => {
        // Recalculate position
        let newPos = 0;
        for(let i=0; i<lineIndex; i++) newPos += lines[i].length + 1;
        newPos += Math.min(cursorOffset, newLine.length) + spaces.length; // Approximate
        textarea.selectionStart = textarea.selectionEnd = newPos;
    }, 0);
  };

  const triggerAutocomplete = (textarea) => {
    const { selectionStart, value } = textarea;
    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
    const currentLinePreCursor = value.substring(lineStart, selectionStart);
    // Find last word or emmet-like string
    const match = currentLinePreCursor.match(/([a-zA-Z0-9.#>+*${}\[\]=:!-]+)$/);
    
    if (match) {
      const input = match[1];
      setAcInput(input);
      
      const rect = textarea.getBoundingClientRect();
      const lineHeight = 20; 
      const linesBefore = value.substr(0, selectionStart).split('\n').length;
      const topOffset = (linesBefore * lineHeight) - textarea.scrollTop;
      const top = Math.min(Math.max(0, topOffset), rect.height);
      
      setAcPosition({
        top: rect.top + top,
        left: rect.left + 60 // Simple offset
      });
      setAcVisible(true);
    } else {
        // If no match, maybe show all valid tags? Or just close
        setAcVisible(false);
    }
  };

  const handleAcSelect = (item) => {
    const textarea = textareaRef.current;
    const { selectionStart, value } = textarea;
    const abbr = acInput;
    
    let insertion = item.value;
    if (item.type === 'css') {
        insertion = item.value.includes(':') ? `${item.value};` : `${item.value}: ;`;
    }

    const newValue = value.substring(0, selectionStart - abbr.length) + insertion + value.substring(selectionStart);
    onChange(newValue);
    setAcVisible(false);
    
    setTimeout(() => {
       textarea.focus();
       textarea.selectionStart = textarea.selectionEnd = selectionStart - abbr.length + insertion.length;
    }, 0);
    
    toast({ description: "Emmet expanded! ⚡", duration: 1000 });
  };

  // Auto-trigger AC while typing (intelligent detection)
  const handleInput = (e) => {
    const val = e.target.value;
    onChange(val);
    updateCursorPos(e);
    
    const { selectionStart } = e.target;
    const lineStart = val.lastIndexOf('\n', selectionStart - 1) + 1;
    const currentLinePreCursor = val.substring(lineStart, selectionStart);
    const words = currentLinePreCursor.split(/\s/);
    const lastWord = words[words.length - 1];

    // Minimal trigger length to avoid noise
    if (lastWord.length > 1 && /[a-zA-Z0-9]/.test(lastWord)) {
        triggerAutocomplete(e.target);
    } else {
        setAcVisible(false);
    }
  };

  // Syntax Highlighting
  const highlightedCode = language === 'html' 
    ? highlightHTML(code, theme) 
    : highlightCSS(code, theme);

  return (
    <div className={`relative flex flex-col h-full border rounded-lg overflow-hidden bg-white dark:bg-[#1e1e1e] ${className}`}>
      {/* Editor Surface */}
      <div className="relative flex-1 font-mono text-sm leading-[20px] overflow-hidden">
        {/* Backdrop for Syntax Highlighting */}
        <div 
          ref={backdropRef}
          className="absolute inset-0 p-4 pointer-events-none whitespace-pre overflow-hidden"
          style={{ fontFamily: 'monospace' }}
          dangerouslySetInnerHTML={{ __html: highlightedCode + '<br/>' }} 
        />
        
        {/* Transparent Textarea for Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleInput}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          onClick={updateCursorPos}
          spellCheck={false}
          className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-black dark:caret-white resize-none outline-none font-mono whitespace-pre z-10 selection:bg-blue-200 dark:selection:bg-blue-900/50"
          style={{ fontFamily: 'monospace' }}
        />
        
        <EmmetAutocompleteDropdown
          input={acInput}
          visible={acVisible}
          position={acPosition}
          type={language}
          onSelect={handleAcSelect}
          onClose={() => setAcVisible(false)}
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-gray-100 dark:bg-[#2d2d2d] border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 text-[10px] text-gray-500 uppercase tracking-wider font-medium select-none">
        <div className="flex items-center gap-3">
           <span>{language}</span>
           <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
        </div>
        <div className="flex items-center gap-3">
           <span>Tab Size: 2</span>
           <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCodeEditor;
