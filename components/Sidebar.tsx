
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
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeMode, 
  setMode, 
  isMobileOpen, 
  toggleMobile,
  isDesktopCollapsed,
  toggleDesktop
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
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-marawa-red to-marawa-gold rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-marawa-red/20">
              B
            </div>
            
            {/* Title Text (Hidden when collapsed) */}
            <div className={`transition-opacity duration-200 ${isDesktopCollapsed ? 'lg:hidden lg:opacity-0' : 'block opacity-100'}`}>
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                Baso<span className="text-marawa-gold">.AI</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Minang Intelligence</p>
            </div>
          </div>
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
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Main Features</span>
            </div>
          )}

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMode === item.mode;
            
            return (
              <button
                key={item.mode}
                onClick={() => {
                  setMode(item.mode);
                  if (window.innerWidth < 1024) toggleMobile();
                }}
                className={`
                  group relative flex items-center rounded-xl transition-all duration-300
                  ${isDesktopCollapsed ? 'justify-center p-3' : 'px-4 py-3.5 gap-3 w-full'}
                  ${isActive 
                    ? 'bg-gradient-to-r from-marawa-red to-red-700 text-white shadow-lg shadow-red-900/30' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                  }
                `}
                title={isDesktopCollapsed ? item.label : ''}
              >
                {/* Icon */}
                <Icon 
                   size={20} 
                   className={`flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} 
                />
                
                {/* Text Label (Hidden when collapsed) */}
                <span className={`
                  whitespace-nowrap font-medium text-sm transition-all duration-300
                  ${isDesktopCollapsed ? 'lg:hidden lg:w-0 opacity-0' : 'block w-auto opacity-100'}
                `}>
                  {item.label}
                </span>

                {/* Collapsed Tooltip (Optional visual cue) */}
                {isDesktopCollapsed && (
                   <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700">
                       {item.label}
                   </div>
                )}
              </button>
            );
          })}

          {/* DONATION BUTTON */}
          <div className="pt-4 mt-2 border-t border-slate-800">
            <a 
               href="https://saweria.co/" // Replace with actual donation link
               target="_blank"
               rel="noopener noreferrer"
               className={`
                  group relative flex items-center rounded-xl transition-all duration-300 border border-slate-800 hover:border-yellow-500/50 hover:bg-yellow-900/10
                  ${isDesktopCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3 w-full'}
                `}
            >
                <Coffee size={20} className="text-yellow-500" />
                <span className={`
                  whitespace-nowrap font-medium text-sm text-yellow-500 transition-all duration-300
                  ${isDesktopCollapsed ? 'lg:hidden lg:w-0 opacity-0' : 'block w-auto opacity-100'}
                `}>
                  {t('donate_btn')}
                </span>
            </a>
          </div>

        </nav>

        {/* --- FOOTER (Lang) --- */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/50">
          
          {/* Language Switcher */}
          <div className={`flex bg-slate-900 rounded-full p-1 border border-slate-800 ${isDesktopCollapsed ? 'flex-col gap-1 rounded-xl' : ''}`}>
             <button 
               onClick={() => setLanguage('id')} 
               className={`
                 flex items-center justify-center transition-all rounded-full
                 ${isDesktopCollapsed ? 'w-full py-2 rounded-lg text-[10px]' : 'flex-1 py-1.5 text-[11px]'}
                 font-bold 
                 ${language === 'id' ? 'bg-slate-800 text-marawa-gold shadow-sm ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-300'}
               `}
               title="Bahasa Indonesia"
             >
               {isDesktopCollapsed ? 'ID' : 'IND'}
             </button>
             <button 
               onClick={() => setLanguage('en')} 
               className={`
                 flex items-center justify-center transition-all rounded-full
                 ${isDesktopCollapsed ? 'w-full py-2 rounded-lg text-[10px]' : 'flex-1 py-1.5 text-[11px]'}
                 font-bold
                 ${language === 'en' ? 'bg-slate-800 text-marawa-gold shadow-sm ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-300'}
               `}
               title="English"
             >
               {isDesktopCollapsed ? 'EN' : 'ENG'}
             </button>
          </div>
          
        </div>
      </aside>

      {/* --- MOBILE OVERLAY (Backdrop) --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-200"
          onClick={toggleMobile}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
