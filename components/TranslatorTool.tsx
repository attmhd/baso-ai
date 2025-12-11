
import React, { useState } from 'react';
import { ArrowRightLeft, Copy, Loader2, Sparkles, X, Languages, MoveRight } from 'lucide-react';
import { AppMode } from '../types';
import { streamResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../contexts/LanguageContext';

const TranslatorTool: React.FC = () => {
  const { t, language } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setOutputText('');
    
    try {
      // Pass empty history, no image, no context, and CURRENT LANGUAGE
      const stream = await streamResponse(
        inputText, 
        AppMode.TRANSLATE, 
        [], 
        undefined, 
        undefined, 
        language
      );
      
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setOutputText(fullText);
      }
    } catch (error) {
      setOutputText(t('error_network'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
        {/* Header Section - Added pl-16 for mobile menu toggle space */}
        <div className="px-6 pl-16 lg:pl-6 py-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                     <Languages size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('trans_title')}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">Smart Context Engine</p>
                </div>
            </div>
            {/* Translate Button (Desktop) */}
            <button 
                onClick={handleTranslate}
                disabled={isLoading || !inputText.trim()}
                className="hidden md:flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full font-semibold hover:bg-marawa-red dark:hover:bg-slate-200 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                <span>{t('trans_btn')}</span>
            </button>
        </div>

        {/* Main Content - Split View */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden p-0 lg:p-6">
            <div className="max-w-6xl mx-auto h-full flex flex-col lg:flex-row gap-0 lg:gap-6 bg-white dark:bg-slate-800 lg:rounded-3xl lg:shadow-xl lg:border border-slate-200 dark:border-slate-700 overflow-hidden">
                
                {/* Input Section */}
                <div className="flex-1 flex flex-col p-6 bg-white dark:bg-slate-800 relative group">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">{t('trans_auto')}</span>
                        {inputText && (
                            <button onClick={handleClear} className="text-slate-300 hover:text-red-500 transition-colors">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t('trans_input')}
                        className="flex-1 w-full bg-transparent resize-none outline-none text-xl md:text-2xl text-slate-800 dark:text-slate-200 placeholder:text-slate-300 font-medium leading-relaxed"
                        spellCheck="false"
                    />
                    <div className="mt-4 h-1 w-12 bg-slate-200 dark:bg-slate-700 rounded-full group-focus-within:bg-blue-500 group-focus-within:w-full transition-all duration-500"></div>
                </div>

                {/* Divider / Mobile Action */}
                <div className="h-px w-full lg:w-px lg:h-full bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center">
                     <div className="absolute p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-400">
                        <ArrowRightLeft size={16} className="lg:rotate-90" />
                     </div>
                </div>

                {/* Output Section */}
                <div className="flex-1 flex flex-col p-6 bg-yellow-50/50 dark:bg-slate-900/50 relative min-h-[300px] lg:min-h-auto">
                    <div className="flex justify-between items-center mb-4">
                         <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-widest px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded">{t('trans_minang')}</span>
                         {outputText && (
                            <button 
                                onClick={() => navigator.clipboard.writeText(outputText)}
                                className="text-slate-400 hover:text-yellow-600 transition-colors flex items-center gap-1 text-xs font-medium"
                            >
                                <Copy size={16} /> {t('copy')}
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                                <Loader2 className="animate-spin text-yellow-500" size={32} />
                                <span className="text-sm font-medium animate-pulse">{t('trans_loading')}</span>
                            </div>
                        ) : outputText ? (
                            <div className="prose prose-xl dark:prose-invert max-w-none">
                                {/* Applied text-justify here for neat alignment */}
                                <p className="text-xl md:text-2xl text-slate-800 dark:text-slate-100 leading-relaxed font-medium text-justify font-sans">
                                    <ReactMarkdown components={{
                                        p: ({node, ...props}) => <span {...props} />
                                    }}>
                                        {outputText}
                                    </ReactMarkdown>
                                </p>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center opacity-30">
                                <div className="text-center">
                                    <Sparkles size={48} className="mx-auto mb-2 text-slate-400" />
                                    <p className="text-slate-400 font-medium">{t('trans_empty')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Mobile Floating Button */}
            <div className="lg:hidden fixed bottom-6 right-6 left-6 z-20">
                <button 
                    onClick={handleTranslate}
                    disabled={isLoading || !inputText.trim()}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    {t('trans_btn')}
                </button>
            </div>
        </div>
    </div>
  );
};

export default TranslatorTool;
