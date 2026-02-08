
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './layouts/MainLayout';
import EditorLayout from './layouts/EditorLayout';
import HomePage from './pages/HomePage';
import HtmlCssEditor from './pages/HtmlCssEditor';
import PythonEditor from './pages/PythonEditor';
import JavaEditor from './pages/JavaEditor';
import JavaScriptEditor from './pages/JavaScriptEditor';
import CreativePlayground from './pages/CreativePlayground';
import LevelProgressDashboard from './pages/LevelProgressDashboard';
import EnhancedHtmlCssEditor from './pages/EnhancedHtmlCssEditor';
import EmmetDocumentation from './pages/EmmetDocumentation';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Main Website Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="progress" element={<LevelProgressDashboard />} />
              <Route path="emmet-docs" element={<EmmetDocumentation />} />
            </Route>

            {/* Editor Application Routes */}
            <Route element={<EditorLayout />}>
              <Route path="html-css" element={<HtmlCssEditor />} />
              <Route path="python" element={<PythonEditor />} />
              <Route path="java" element={<JavaEditor />} />
              <Route path="javascript-editor" element={<JavaScriptEditor />} />
              <Route path="creative" element={<CreativePlayground />} />
            </Route>
            
            {/* Full Screen Editor Route */}
            <Route path="/emmet-editor" element={<EnhancedHtmlCssEditor />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
