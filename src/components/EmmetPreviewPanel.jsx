
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Smartphone, Tablet, Monitor, RefreshCw, Maximize, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VIEWPORTS = {
  mobile: { width: '375px', label: 'Mobile' },
  tablet: { width: '768px', label: 'Tablet' },
  desktop: { width: '100%', label: 'Desktop' }
};

const EmmetPreviewPanel = ({ html, css, error }) => {
  const { theme } = useTheme();
  const iframeRef = useRef(null);
  const [viewport, setViewport] = useState('desktop');
  const [iframeKey, setIframeKey] = useState(0); // Force re-render

  const updatePreview = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Basic Resets */
          *, *::before, *::after { box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 16px;
            color: ${theme === 'dark' ? '#eee' : '#333'};
            background-color: ${theme === 'dark' ? '#1e1e1e' : '#ffffff'};
            transition: all 0.3s ease;
          }
          /* User CSS */
          ${css}
        </style>
      </head>
      <body>
        ${html || '<div class="empty-state">Preview Area</div>'}
      </body>
      </html>
    `);
    doc.close();
  };

  useEffect(() => {
    updatePreview();
  }, [html, css, theme, iframeKey]);

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="h-10 bg-white dark:bg-[#252526] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3">
        <div className="flex items-center gap-1">
          <Button 
            variant={viewport === 'mobile' ? 'secondary' : 'ghost'} 
            size="icon" className="h-7 w-7" 
            onClick={() => setViewport('mobile')}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
          <Button 
            variant={viewport === 'tablet' ? 'secondary' : 'ghost'} 
            size="icon" className="h-7 w-7" 
            onClick={() => setViewport('tablet')}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button 
            variant={viewport === 'desktop' ? 'secondary' : 'ghost'} 
            size="icon" className="h-7 w-7" 
            onClick={() => setViewport('desktop')}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIframeKey(k => k + 1)}>
             <RefreshCw className="w-3 h-3" />
           </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4 bg-gray-100 dark:bg-[#1e1e1e]">
         <div 
           className={`bg-white dark:bg-[#2d2d2d] shadow-2xl transition-all duration-300 overflow-hidden ${viewport !== 'desktop' ? 'border-8 border-gray-800 rounded-3xl' : 'w-full h-full'}`}
           style={{ 
             width: viewport === 'desktop' ? '100%' : VIEWPORTS[viewport].width,
             height: viewport === 'desktop' ? '100%' : '90%'
           }}
         >
           <iframe
             key={iframeKey}
             ref={iframeRef}
             className="w-full h-full border-none bg-white dark:bg-[#1e1e1e]"
             title="Emmet Live Preview"
             sandbox="allow-scripts"
           />
         </div>
         
         {/* Error Toast / Overlay inside preview if needed */}
         {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
            </div>
         )}
      </div>
    </div>
  );
};

export default EmmetPreviewPanel;
