
import React from 'react';
import { 
  MessageSquare, 
  Languages, 
  PenTool, 
  Wand2, 
  CheckCircle2, 
  BookOpen, 
  Scale,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Coffee
} from 'lucide-react';
import { AppMode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  activeMode: AppMode;
  setMode: (mode: AppMode) => void;
  // Mobile Props
  isMobileOpen: boolean;
  toggleMobile: () => void;
  // Desktop Props
  isDesktopCollapsed: boolean;
  toggleDesktop: () => void;
  // Navigation
  onGoHome: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeMode, 
  setMode, 
  isMobileOpen, 
  toggleMobile,
  isDesktopCollapsed,
  toggleDesktop,
  onGoHome
}) => {
  const { t, language, setLanguage } = useLanguage();

  const menuItems = [
    { mode: AppMode.CHAT, label: t('menu_chat'), icon: MessageSquare },
    { mode: AppMode.TRANSLATE, label: t('menu_translate'), icon: Languages },
    { mode: AppMode.ETIQUETTE, label: t('menu_etiquette'), icon: Scale },
    { mode: AppMode.WRITER, label: t('menu_writer'), icon: PenTool },
    { mode: AppMode.KNOWLEDGE, label: t('menu_knowledge'), icon: BookOpen },
    { mode: AppMode.GRAMMAR, label: t('menu_grammar'), icon: CheckCircle2 },
    { mode: AppMode.AUTOCOMPLETE, label: t('menu_autocomplete'), icon: Wand2 },
  ];

  return (
    <>
      {/* --- MOBILE TOGGLE BUTTON (Visible only on < lg) --- */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleMobile}
          className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700 hover:bg-slate-800 transition-colors active:scale-95"
          aria-label="Toggle Menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- SIDEBAR CONTAINER --- */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        flex flex-col border-r border-slate-800 bg-slate-950 text-slate-300
        transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isDesktopCollapsed ? 'lg:w-20' : 'lg:w-72'}
        w-72 h-full
      `}>
        
        {/* --- HEADER --- */}
        <div className={`flex items-center h-20 px-6 ${isDesktopCollapsed ? 'lg:justify-center lg:px-0' : 'justify-between'}`}>
          <button 
            onClick={onGoHome}
            className="flex items-center gap-3 overflow-hidden whitespace-nowrap hover:opacity-80 transition-opacity text-left w-full group"
            title="Back to Home"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-marawa-red to-marawa-gold rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-marawa-red/20 group-hover:scale-105 transition-transform">
              B
            </div>
            
            {/* Title Text (Hidden when collapsed) */}
            <div className={`transition-opacity duration-200 ${isDesktopCollapsed ? 'lg:hidden lg:opacity-0' : 'block opacity-100'}`}>
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                Baso<span className="text-marawa-gold">.AI</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Minang Intelligence</p>
            </div>
          </button>
        </div>

        {/* --- DESKTOP TOGGLE BUTTON (Absolute on border) --- */}
        <button 
          onClick={toggleDesktop}
          className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white hover:bg-marawa-red hover:border-marawa-red transition-all shadow-sm z-50"
          title={isDesktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isDesktopCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* --- MENU NAVIGATION --- */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-none">
          {/* Section Label */}
          {!isDesktopCollapsed && (
            <div className="px-3 mb-2 animate-in fade-in duration-300">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                Features
              </span>
            </div>
          )}
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMode === item.mode;
            
            // Define active color based on mode for visual variety
            const activeColorClass = 
                item.mode === AppMode.CHAT ? 'from-yellow-500 to-yellow-600' :
                item.mode === AppMode.TRANSLATE ? 'from-blue-500 to-blue-600' :
                item.mode === AppMode.WRITER ? 'from-purple-500 to-purple-600' :
                item.mode === AppMode.KNOWLEDGE ? 'from-green-500 to-green-600' :
                item.mode === AppMode.GRAMMAR ? 'from-emerald-500 to-emerald-600' :
                item.mode === AppMode.AUTOCOMPLETE ? 'from-orange-500 to-orange-600' :
                'from-marawa-red to-red-600'; // Default / Vision

            return (
              <button
                key={item.mode}
                onClick={() => {
                  setMode(item.mode);
                  toggleMobile(); // Close mobile menu on select
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? `bg-gradient-to-r ${activeColorClass} text-white shadow-lg` 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }
                  ${isDesktopCollapsed ? 'justify-center px-2' : ''}
                `}
                title={isDesktopCollapsed ? item.label : undefined}
              >
                <div className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                   <Icon size={20} />
                </div>
                
                {!isDesktopCollapsed && (
                  <span className="font-medium text-sm truncate animate-in fade-in slide-in-from-left-2 duration-300">
                    {item.label}
                  </span>
                )}
                
                {/* Active Indicator Line (Left) */}
                {isActive && !isDesktopCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/30 rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* --- FOOTER --- */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          
          {/* Donation Button */}
          <a
            href="https://saweria.co/attmhd"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 border border-yellow-700/50 text-yellow-500 hover:bg-yellow-900/60 transition-all group
              ${isDesktopCollapsed ? 'justify-center' : ''}
            `}
            title={t('donate_btn')}
          >
            <Coffee size={20} className="group-hover:rotate-12 transition-transform" />
            {!isDesktopCollapsed && (
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold">{t('donate_btn')}</span>
                <span className="text-[9px] opacity-70">Support Baso</span>
              </div>
            )}
          </a>

          {/* Language Switcher (Compact) */}
          <div className="mt-4 flex bg-slate-900 rounded-lg p-1 border border-slate-800">
            <button 
              onClick={() => setLanguage('id')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${language === 'id' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              ID
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${language === 'en' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              EN
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={toggleMobile}
        />
      )}
    </>
  );
};

export default Sidebar;
