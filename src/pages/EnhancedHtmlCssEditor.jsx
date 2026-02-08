
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Zap, HelpCircle, Columns, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

import EnhancedCodeEditor from '@/components/EnhancedCodeEditor';
import EmmetPreviewPanel from '@/components/EmmetPreviewPanel';
import EmmetShortcutsReference from '@/components/EmmetShortcutsReference';
import EmmetHelpModal from '@/components/EmmetHelpModal';

function EnhancedHtmlCssEditor() {
  // State
  const [htmlCode, setHtmlCode] = useState('<!-- Type div.container>h1{Hello World} and press Tab -->\n\n<div class="container">\n  <h1>Emmet Playground</h1>\n  <p>Start typing abbreviations!</p>\n</div>');
  const [cssCode, setCssCode] = useState('/* Type m0 or df and press Tab */\n\nbody {\n  font-family: sans-serif;\n  padding: 2rem;\n  background: #f4f4f9;\n}\n\n.container {\n  background: white;\n  padding: 2rem;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n  max-width: 600px;\n  margin: 0 auto;\n}');
  
  const [activeTab, setActiveTab] = useState('html'); // 'html', 'css'
  const [showSidebar, setShowSidebar] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <Helmet><title>Emmet Pro Editor - CodeMaster</title></Helmet>
      
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#0d0d0d] overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-20">
           <div className="flex items-center gap-4">
             <Link to="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
               <ArrowLeft className="w-5 h-5" />
             </Link>
             <h1 className="font-bold text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
               <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
               Emmet Pro Editor
             </h1>
           </div>
           
           <div className="flex items-center gap-2">
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowHelp(true)}
                className="text-gray-500"
             >
                <HelpCircle className="w-4 h-4 mr-2" /> Help
             </Button>
             
             <Button
                variant={showSidebar ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
             >
                {showSidebar ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
             </Button>
           </div>
        </header>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
           
           {/* Editor Column */}
           <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200 dark:border-gray-700">
             {/* Tabs */}
             <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1e1e1e]">
               <button 
                 onClick={() => setActiveTab('html')}
                 className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'html' ? 'border-orange-500 text-orange-600 bg-white dark:bg-[#1e1e1e]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               >HTML</button>
               <button 
                 onClick={() => setActiveTab('css')}
                 className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'css' ? 'border-blue-500 text-blue-600 bg-white dark:bg-[#1e1e1e]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               >CSS</button>
             </div>
             
             {/* Editor Area */}
             <div className="flex-1 relative">
               <div className={`absolute inset-0 ${activeTab === 'html' ? 'z-10' : 'z-0 invisible'}`}>
                  <EnhancedCodeEditor 
                    code={htmlCode} 
                    onChange={setHtmlCode} 
                    language="html" 
                    className="border-none rounded-none"
                  />
               </div>
               <div className={`absolute inset-0 ${activeTab === 'css' ? 'z-10' : 'z-0 invisible'}`}>
                  <EnhancedCodeEditor 
                    code={cssCode} 
                    onChange={setCssCode} 
                    language="css" 
                    className="border-none rounded-none"
                  />
               </div>
             </div>
           </div>

           {/* Preview Column */}
           <div className="flex-1 hidden lg:block bg-gray-100 dark:bg-black">
             <EmmetPreviewPanel html={htmlCode} css={cssCode} />
           </div>
           
           {/* Sidebar: Shortcuts */}
           {showSidebar && (
             <div className="w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] shadow-xl z-10 transition-all">
               <EmmetShortcutsReference />
             </div>
           )}
        </div>
      </div>
      
      <EmmetHelpModal open={showHelp} onOpenChange={setShowHelp} />
    </>
  );
}

export default EnhancedHtmlCssEditor;
