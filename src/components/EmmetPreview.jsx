
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const EmmetPreview = ({ html, css, className = "" }) => {
  const iframeRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                margin: 0;
                padding: 16px;
                color: ${theme === 'dark' ? '#eee' : '#333'};
                background-color: ${theme === 'dark' ? '#1e1e1e' : '#ffffff'};
                transition: background-color 0.3s, color 0.3s;
              }
              ${css}
            </style>
          </head>
          <body>
            ${html || '<div style="color: #888; font-style: italic;">HTML Output Preview</div>'}
          </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [html, css, theme]);

  return (
    <div className={`w-full h-full bg-white dark:bg-[#1e1e1e] border-l border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="px-3 py-1 bg-gray-100 dark:bg-[#252526] border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 uppercase font-semibold">
        Live Preview
      </div>
      <iframe
        ref={iframeRef}
        title="Live Emmet Preview"
        className="w-full h-[calc(100%-24px)] border-none"
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default EmmetPreview;
