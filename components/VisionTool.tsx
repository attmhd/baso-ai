import React from 'react';
import ChatInterface from './ChatInterface';
import { AppMode } from '../types';
import { ScanEye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const VisionTool: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
             {/* Standardized Header */}
             <div className="px-6 py-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="p-2.5 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-pink-600 dark:text-pink-400">
                    <ScanEye size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('vision_title')}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">Multimodal Analysis</p>
                </div>
             </div>
             <div className="flex-1 overflow-hidden relative">
                <ChatInterface mode={AppMode.VISION} />
             </div>
        </div>
    );
};

export default VisionTool;