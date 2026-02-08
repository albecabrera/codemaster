
import React from 'react';
import { Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const SHORTCUTS = [
  { keys: ['Tab'], desc: 'Expand Abbreviation' },
  { keys: ['Ctrl', 'Space'], desc: 'Trigger Autocomplete' },
  { keys: ['Esc'], desc: 'Close Autocomplete' },
  { keys: ['Ctrl', '/'], desc: 'Toggle Comment (Coming Soon)' },
  { keys: ['Ctrl', 'D'], desc: 'Duplicate Line (Coming Soon)' },
];

const EmmetHelpModal = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Keyboard className="w-5 h-5 text-purple-500" />
            Editor Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Keyboard Shortcuts</h4>
            <div className="space-y-3">
              {SHORTCUTS.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{s.desc}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k, j) => (
                      <kbd key={j} className="px-2 py-1 bg-gray-100 dark:bg-[#2d2d2d] border border-gray-200 dark:border-gray-700 rounded text-xs font-mono font-bold text-gray-600 dark:text-gray-400">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Quick Tips</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-4">
              <li>Type <code>div.box</code> and press <strong>Tab</strong> to get <code>&lt;div class="box"&gt;&lt;/div&gt;</code></li>
              <li>Use <code>&gt;</code> for nesting: <code>ul&gt;li</code></li>
              <li>Use <code>*</code> for multiplication: <code>li*3</code></li>
              <li>For CSS, type <code>m10</code> for <code>margin: 10px;</code></li>
              <li>Use <code>+</code> for siblings: <code>div+p</code></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
           <Button onClick={() => onOpenChange(false)}>Got it</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmmetHelpModal;
