
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import TranslatorTool from './components/TranslatorTool';
import ToolsLayout from './components/ToolsLayout';
import EtiquetteTool from './components/EtiquetteTool';
import LandingPage from './components/LandingPage';
import { AppMode } from './types';
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.CHAT);
  
  // State for Mobile Drawer
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // State for Desktop Collapsible Sidebar
  const [isDesktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeMode) {
      case AppMode.CHAT:
      case AppMode.WRITER:
      case AppMode.KNOWLEDGE:
        return <ChatInterface key={activeMode} mode={activeMode} />;
      case AppMode.TRANSLATE:
        return <TranslatorTool />;
      case AppMode.GRAMMAR:
      case AppMode.AUTOCOMPLETE:
        return <ToolsLayout key={activeMode} mode={activeMode} />;
      case AppMode.ETIQUETTE:
        return <EtiquetteTool />;
      default:
        return <ChatInterface mode={AppMode.CHAT} />;
    }
  };

  if (!hasStarted) {
    return <LandingPage onStart={() => setHasStarted(true)} />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans text-slate-900 dark:text-slate-100">
      <Sidebar 
        activeMode={activeMode} 
        setMode={setActiveMode} 
        isMobileOpen={isMobileSidebarOpen}
        toggleMobile={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        toggleDesktop={() => setDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative w-full overflow-hidden transition-all duration-300">
        {renderContent()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
