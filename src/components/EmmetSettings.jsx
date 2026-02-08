
import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

const DEFAULT_SETTINGS = {
  fontSize: 14,
  tabSize: 2,
  autoExpand: true,
  showDocs: true
};

const EmmetSettings = ({ onUpdate }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const saved = localStorage.getItem('emmet_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      onUpdate(parsed);
    }
  }, [onUpdate]);

  const handleSave = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('emmet_settings', JSON.stringify(updated));
    onUpdate(updated);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('emmet_settings', JSON.stringify(DEFAULT_SETTINGS));
    onUpdate(DEFAULT_SETTINGS);
    toast({ description: "Settings reset to defaults" });
  };

  if (!isOpen) {
    return (
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Settings className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="absolute top-12 right-4 z-50 w-72 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Emmet Settings</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>X</Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Theme</label>
          <div className="flex gap-2">
            <Button 
                variant={theme === 'light' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1"
                onClick={() => theme === 'dark' && toggleTheme()}
            >Light</Button>
            <Button 
                variant={theme === 'dark' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1"
                onClick={() => theme === 'light' && toggleTheme()}
            >Dark</Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Font Size: {settings.fontSize}px</label>
          <input 
            type="range" 
            min="12" 
            max="24" 
            value={settings.fontSize} 
            onChange={(e) => handleSave({ fontSize: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tab Size</label>
          <select 
            value={settings.tabSize}
            onChange={(e) => handleSave({ tabSize: parseInt(e.target.value) })}
            className="w-full p-2 rounded border dark:bg-[#2d2d2d] dark:border-gray-700"
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="8">8 Spaces</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Auto-Expand on Tab</label>
          <input 
            type="checkbox" 
            checked={settings.autoExpand}
            onChange={(e) => handleSave({ autoExpand: e.target.checked })}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-500">
           <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
        <Button size="sm" onClick={() => setIsOpen(false)} className="bg-green-600 hover:bg-green-700 text-white">
           <Save className="w-3 h-3 mr-1" /> Done
        </Button>
      </div>
    </div>
  );
};

export default EmmetSettings;
