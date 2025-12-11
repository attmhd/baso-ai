
import React, { useState } from 'react';
import { Scale, Loader2, Sparkles, User, Users, Baby, Award, Copy, CheckCircle2 } from 'lucide-react';
import { AppMode } from '../types';
import { streamResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../contexts/LanguageContext';

const EtiquetteTool: React.FC = () => {
    const { t, language } = useLanguage();
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [audience, setAudience] = useState<string>('parents');

    const audiences = [
        { id: 'parents', label: t('audience_parents'), icon: User, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400' },
        { id: 'same_age', label: t('audience_same_age'), icon: Users, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
        { id: 'younger', label: t('audience_younger'), icon: Baby, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
        { id: 'inlaws', label: t('audience_inlaws'), icon: Award, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
    ];

    const handleCheck = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        setResult('');
        try {
            // Pass the audience ID or label as contextData
            const selectedAudience = audiences.find(a => a.id === audience)?.label || 'General';
            // Pass language
            const stream = await streamResponse(input, AppMode.ETIQUETTE, [], undefined, selectedAudience, language);
            let fullText = '';
            for await (const chunk of stream) {
                fullText += chunk;
                setResult(fullText);
            }
        } catch (e) {
            setResult(t('error_network'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
            {/* Header - Added pl-16 for mobile menu toggle space */}
            <div className="px-6 pl-16 lg:pl-6 py-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                        <Scale size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('etiq_title')}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">{t('etiq_validator_sub')}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Panel: Input & Settings */}
                    <div className="flex-1 space-y-6">
                        {/* Audience Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider block">
                                {t('etiq_audience_label')}
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {audiences.map((a) => {
                                    const Icon = a.icon;
                                    const isSelected = audience === a.id;
                                    return (
                                        <button
                                            key={a.id}
                                            onClick={() => setAudience(a.id)}
                                            className={`
                                                flex items-center gap-3 p-4 rounded-xl border transition-all text-left
                                                ${isSelected 
                                                    ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                                                }
                                            `}
                                        >
                                            <div className={`p-2 rounded-lg ${a.color}`}>
                                                <Icon size={18} />
                                            </div>
                                            <span className={`font-semibold text-sm ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {a.label}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative focus-within:ring-2 focus-within:ring-indigo-200 dark:focus-within:ring-indigo-900 transition-all">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={t('etiq_input_placeholder')}
                                className="w-full bg-transparent p-6 resize-none outline-none text-slate-800 dark:text-slate-100 text-lg min-h-[180px] placeholder:text-slate-300 font-medium leading-relaxed"
                                spellCheck="false"
                            />
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                                <button
                                    onClick={handleCheck}
                                    disabled={isLoading || !input.trim()}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-semibold transition-all shadow-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} fill="currentColor" />}
                                    {t('etiq_btn')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Analysis Result */}
                    <div className="flex-1">
                        {(result || isLoading) ? (
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative min-h-[400px]">
                                {/* Decorative BG */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                                
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <span className="text-sm font-bold uppercase tracking-wider text-slate-500">{t('tool_result_label')}</span>
                                        </div>
                                        {result && (
                                            <button 
                                                onClick={() => navigator.clipboard.writeText(result)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                                title={t('copy')}
                                            >
                                                <Copy size={18} />
                                            </button>
                                        )}
                                    </div>

                                    {isLoading ? (
                                        <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-4">
                                            <Loader2 className="animate-spin text-indigo-500" size={40} />
                                            <span className="text-sm font-medium animate-pulse text-slate-500">{t('etiq_analyzing')}</span>
                                        </div>
                                    ) : (
                                        <div className="prose prose-lg dark:prose-invert max-w-none">
                                            <ReactMarkdown components={{
                                                h1: ({node, ...props}) => (
                                                    <div className="flex justify-center mb-8">
                                                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-full border border-slate-200 dark:border-slate-600">
                                                            <span className="text-xl font-bold text-slate-800 dark:text-white" {...props} />
                                                        </div>
                                                    </div>
                                                ),
                                                h3: ({node, ...props}) => (
                                                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-400 tracking-widest mt-8 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2" {...props} />
                                                ),
                                                blockquote: ({node, ...props}) => (
                                                    <div className="relative my-6 group">
                                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 blur transition duration-500 group-hover:opacity-30"></div>
                                                        <div className="relative bg-indigo-50 dark:bg-slate-900/50 border border-indigo-200 dark:border-indigo-900/30 p-6 rounded-xl">
                                                            <blockquote className="text-xl text-slate-800 dark:text-indigo-100 font-serif italic leading-relaxed text-center m-0" {...props} />
                                                        </div>
                                                    </div>
                                                ),
                                                p: ({node, ...props}) => <span className="block mb-4 leading-relaxed text-slate-600 dark:text-slate-300" {...props} />
                                            }}>
                                                {result}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center p-8 text-slate-400 text-center">
                                <Scale size={48} className="mb-4 text-slate-200 dark:text-slate-800" />
                                <h3 className="text-lg font-bold text-slate-500 dark:text-slate-500 mb-2">{t('etiq_empty_title')}</h3>
                                <p className="text-sm max-w-xs mx-auto">{t('etiq_empty_desc')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EtiquetteTool;
