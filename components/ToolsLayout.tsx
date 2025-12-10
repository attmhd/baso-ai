import React, { useState, useEffect, useRef } from 'react';
import { AppMode } from '../types';
import { Check, Wand2, Loader2, Play, CheckCircle2, Copy, Keyboard, Sparkles } from 'lucide-react';
import { streamResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../contexts/LanguageContext';

interface ToolsLayoutProps {
    mode: AppMode.GRAMMAR | AppMode.AUTOCOMPLETE;
}

const ToolsLayout: React.FC<ToolsLayoutProps> = ({ mode }) => {
    const { t } = useLanguage();
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Autocomplete Specific States
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const title = mode === AppMode.GRAMMAR ? t('grammar_title') : t('auto_title');
    const placeholder = mode === AppMode.GRAMMAR 
        ? "Contoh: Ambo pai ka pasa mambali lado..." 
        : "Mulai ketik kalimat Minang, Baso akan melengkapinya otomatis...";

    const ThemeIcon = mode === AppMode.GRAMMAR ? CheckCircle2 : Wand2;
    const iconColor = mode === AppMode.GRAMMAR ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400';
    const headerBg = mode === AppMode.GRAMMAR ? 'bg-green-100 dark:bg-green-900/30' : 'bg-purple-100 dark:bg-purple-900/30';
    const btnGradient = mode === AppMode.GRAMMAR 
        ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400' 
        : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400';

    // Clear state when switching modes
    useEffect(() => {
        setInput('');
        setResult('');
        setIsLoading(false);
    }, [mode]);

    // MAGIC AUTOCOMPLETE LOGIC
    useEffect(() => {
        if (mode !== AppMode.AUTOCOMPLETE) return;

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        // Don't autocomplete if empty or just whitespace
        if (!input.trim() || input.length < 5) {
            setResult('');
            setIsLoading(false);
            return;
        }

        // Debounce API call (800ms pause)
        debounceTimeout.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const stream = await streamResponse(input, AppMode.AUTOCOMPLETE);
                let fullText = '';
                for await (const chunk of stream) {
                    fullText += chunk;
                }
                setResult(fullText); // For autocomplete, we don't stream visibly, we show result at end or stream into a buffer
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }, 800);

        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [input, mode]);

    const handleGrammarCheck = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        setResult('');
        try {
            const stream = await streamResponse(input, AppMode.GRAMMAR);
            let fullText = '';
            for await (const chunk of stream) {
                fullText += chunk;
                setResult(fullText);
            }
        } catch (e) {
            setResult("Maaf, terjadi kesalahan.");
        } finally {
            setIsLoading(false);
        }
    };

    const applySuggestion = () => {
        if (!result) return;
        
        // Intelligent Spacing Logic:
        // Always add a space if the input doesn't end with one.
        // This works for "Hello." -> "Hello. " + "New Sentence"
        // And for "Hello wor" -> "Hello wor " + "ld" (Assuming AI completes words properly, usually user types full word)
        const separator = input.endsWith(' ') ? '' : ' ';
        
        // Clean result: Remove leading/trailing dots/newlines that AI might accidentally output
        const cleanResult = result.trim().replace(/^\./, '').replace(/\.$/, '');
        
        setInput(prev => prev + separator + cleanResult);
        setResult('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Accept suggestion on TAB
        if (mode === AppMode.AUTOCOMPLETE && result && !isLoading && e.key === 'Tab') {
            e.preventDefault();
            applySuggestion();
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
            {/* Standardized Header */}
            <div className="px-6 py-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${headerBg} ${iconColor}`}>
                        <ThemeIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
                            {mode === AppMode.AUTOCOMPLETE ? "Real-time AI Completion" : "AI Utility Tool"}
                        </p>
                    </div>
                </div>
                {mode === AppMode.AUTOCOMPLETE && (
                    <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <Keyboard size={14} />
                        <span>Tekan TAB untuk terima saran</span>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    
                    {/* Main Input Area */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden group focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-slate-200 dark:focus-within:ring-slate-700 transition-all relative">
                        <div className="p-6">
                            <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                {mode === AppMode.AUTOCOMPLETE ? "Magic Editor" : "Input"}
                            </label>
                            
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                className="w-full bg-transparent resize-none outline-none text-slate-800 dark:text-slate-100 text-lg min-h-[150px] placeholder:text-slate-300 font-medium leading-relaxed"
                                spellCheck="false"
                            />

                            {/* Autocomplete Suggestion Overlay */}
                            {mode === AppMode.AUTOCOMPLETE && (result || isLoading) && (
                                <div className="mt-2 relative animate-in fade-in slide-in-from-top-2 duration-300">
                                    {isLoading ? (
                                        <div className="flex items-center gap-2 text-purple-500 text-sm font-medium">
                                            <Loader2 className="animate-spin" size={14} />
                                            <span>Baso sedang berpikir...</span>
                                        </div>
                                    ) : (
                                        <div 
                                            className="group/suggestion cursor-pointer"
                                            onClick={applySuggestion}
                                        >
                                            <div className="flex items-center gap-2 text-xs uppercase font-bold text-purple-500 mb-1">
                                                <Sparkles size={12} />
                                                <span>Saran (Tekan Tab):</span>
                                            </div>
                                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl text-lg text-purple-700 dark:text-purple-300 font-medium flex items-center justify-between hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                                                <span>{result.replace(/^\./, '')}</span>
                                                <span className="text-[10px] bg-white dark:bg-purple-900 px-2 py-1 rounded border border-purple-200 dark:border-purple-700 text-purple-400 group-hover/suggestion:text-purple-600 transition-colors">
                                                    TAB ↹
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Button ONLY for Grammar Mode */}
                        {mode === AppMode.GRAMMAR && (
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <span className="text-xs text-slate-400 hidden sm:block">Baso AI will analyze structure & context</span>
                                <button
                                    onClick={handleGrammarCheck}
                                    disabled={isLoading || !input.trim()}
                                    className={`
                                        flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-semibold transition-all shadow-lg 
                                        ${btnGradient} disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed ml-auto
                                    `}
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
                                    Check Grammar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Output Card - ONLY for Grammar Mode */}
                    {mode === AppMode.GRAMMAR && (result || isLoading) && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
                             {/* Decorative Background for result */}
                             <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                             
                             <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                     <div className="flex items-center gap-2">
                                         <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                                            <CheckCircle2 size={20} />
                                         </div>
                                         <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Analysis Result</span>
                                     </div>
                                     {result && (
                                        <button 
                                            onClick={() => navigator.clipboard.writeText(result)}
                                            className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all"
                                            title="Copy Result"
                                        >
                                            <Copy size={18} />
                                        </button>
                                     )}
                                </div>
                                
                                {isLoading ? (
                                    <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-green-400 blur-xl opacity-20 animate-pulse"></div>
                                            <Loader2 className="animate-spin text-green-500 relative z-10" size={40} />
                                        </div>
                                        <span className="text-sm font-medium animate-pulse text-slate-500">Sedang memeriksa tata bahasa...</span>
                                    </div>
                                ) : (
                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        <ReactMarkdown components={{
                                            // H1 used for Status Badge
                                            h1: ({node, ...props}) => (
                                                <div className="flex justify-center mb-8">
                                                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-full border border-slate-200 dark:border-slate-600">
                                                        <span className="text-xl font-bold text-slate-800 dark:text-white" {...props} />
                                                    </div>
                                                </div>
                                            ),
                                            // H3 used for Section Titles
                                            h3: ({node, ...props}) => (
                                                <h3 className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-widest mt-8 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2" {...props} />
                                            ),
                                            // Blockquote used for Corrected Sentence
                                            blockquote: ({node, ...props}) => (
                                                <div className="relative my-6 group">
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-20 blur transition duration-500 group-hover:opacity-30"></div>
                                                    <div className="relative bg-green-50 dark:bg-slate-900/50 border border-green-200 dark:border-green-900/30 p-6 rounded-xl">
                                                        <blockquote className="text-xl md:text-2xl text-slate-800 dark:text-green-50 font-serif italic leading-relaxed text-center m-0" {...props} />
                                                    </div>
                                                </div>
                                            ),
                                            // List Items for Analysis Points
                                            ul: ({node, ...props}) => <ul className="space-y-3 pl-1" {...props} />,
                                            li: ({node, ...props}) => (
                                                <li className="flex gap-3 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 shadow-sm">
                                                    <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    <span className="leading-relaxed" {...props} />
                                                </li>
                                            ),
                                            p: ({node, ...props}) => <span {...props} />
                                        }}>
                                            {result}
                                        </ReactMarkdown>
                                    </div>
                                )}
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToolsLayout;