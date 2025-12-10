
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Image as ImageIcon, Loader2, Bot, User, Sparkles, PenTool, BookOpen, Scroll, Feather, History, Utensils, Users, UploadCloud, GraduationCap, MessageCircle } from 'lucide-react';
import { AppMode, Message } from '../types';
import { streamResponse } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatInterfaceProps {
  mode: AppMode;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ mode }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<{data: string, mimeType: string} | undefined>(undefined);

  // Initialize messages based on mode
  useEffect(() => {
    // Clear messages when mode changes to show the specific starter UI
    setMessages([]); 
    setInput('');
    setSelectedImage(undefined);
  }, [mode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setSelectedImage({
          data: base64Data,
          mimeType: file.type
        });
        // If in Vision mode and empty, automatically focus input or even prompt user
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStarterClick = (prompt: string) => {
      setInput(prompt);
      // Optional: Auto submit? Let's just fill input for now so user can edit, 
      // EXCEPT for simple prompts where we might want immediate action.
      // Let's auto-submit for smoother UX.
      setTimeout(() => {
          submitMessage(prompt);
      }, 100);
  };

  const submitMessage = async (textInput: string, imageInput?: {data: string, mimeType: string}) => {
    if ((!textInput.trim() && !imageInput) || isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textInput,
      image: imageInput ? `data:${imageInput.mimeType};base64,${imageInput.data}` : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', content: '', isLoading: true }]);

    // Prepare history for API
    const apiHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
    }));

    try {
        const imagePart = imageInput ? { inlineData: imageInput } : undefined;
        // Do NOT clear selectedImage here if we passed it as arg, only if it was state
        if (imageInput === selectedImage) setSelectedImage(undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';

        const stream = await streamResponse(userMsg.content, mode, apiHistory, imagePart);
        
        let fullResponse = '';
        
        for await (const chunk of stream) {
            fullResponse += chunk;
            setMessages(prev => prev.map(m => 
                m.id === modelMsgId 
                ? { ...m, content: fullResponse, isLoading: false } 
                : m
            ));
        }

    } catch (error) {
        setMessages(prev => prev.map(m => 
            m.id === modelMsgId 
            ? { ...m, content: "Maaf Sanak, ado gangguan jaringan. Cubo ulang liak yo. 🙏", isLoading: false } 
            : m
        ));
    } finally {
        setIsStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(input, selectedImage);
  };

  // --- RENDER HELPERS ---

  const renderStarter = () => {
    if (messages.length > 0) return null;

    if (mode === AppMode.WRITER) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/10">
                    <Feather size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{t('chat_welcome_writer')}</h3>
                <p className="text-slate-500 text-center max-w-md mb-8">Pilih genre sastra Minangkabau di bawah ini untuk memulai.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                    {[
                        { icon: Sparkles, label: t('writer_opt_pantun'), prompt: 'Buatkan pantun Minang tentang...' },
                        { icon: BookOpen, label: t('writer_opt_cerpen'), prompt: 'Tuliskan cerpen pendek berbahasa Minang dengan tema...' },
                        { icon: Scroll, label: t('writer_opt_pidato'), prompt: 'Buatkan naskah pidato adat (Pasambahan) untuk acara...' },
                        { icon: PenTool, label: t('writer_opt_surat'), prompt: 'Buatkan surat resmi dalam bahasa Minang untuk...' }
                    ].map((item, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setInput(item.prompt)}
                            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all text-left group"
                        >
                            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg group-hover:bg-purple-50 dark:group-hover:bg-purple-900/50 transition-colors">
                                <item.icon size={20} className="text-slate-600 dark:text-slate-400 group-hover:text-purple-600" />
                            </div>
                            <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-400">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (mode === AppMode.KNOWLEDGE) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/10">
                    <BookOpen size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{t('chat_welcome_knowledge')}</h3>
                <p className="text-slate-500 text-center max-w-md mb-8">Eksplorasi kekayaan intelektual dan sejarah Minangkabau.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
                     {[
                        { icon: History, label: 'Sejarah', prompt: 'Ceritakan sejarah kerajaan Pagaruyung ringkas...' },
                        { icon: Utensils, label: 'Kuliner', prompt: 'Jelaskan filosofi di balik masakan Rendang...' },
                        { icon: Scroll, label: 'Adat', prompt: 'Jelaskan sistem matrilineal di Minangkabau...' },
                        { icon: Users, label: 'Tokoh', prompt: 'Siapa saja tokoh pahlawan nasional dari Minangkabau?' }
                    ].map((item, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleStarterClick(item.prompt)}
                            className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-500 hover:-translate-y-1 transition-all group"
                        >
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 group-hover:scale-110 transition-transform">
                                <item.icon size={24} />
                            </div>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (mode === AppMode.VISION) {
        return (
             <div className="flex flex-col items-center justify-center h-full p-6 animate-in fade-in zoom-in duration-500">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group cursor-pointer w-full max-w-xl aspect-video border-3 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-marawa-red transition-all"
                >
                    <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud size={32} className="text-marawa-red" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">{t('vision_btn_select')}</h3>
                    <p className="text-slate-500 mt-2 text-sm text-center max-w-xs">{t('vision_upload_desc')}</p>
                </div>
            </div>
        );
    }

    // Default Chat Starter - DUAL MODE (Beginner vs Native)
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-in fade-in zoom-in duration-500">
             <div className="w-20 h-20 bg-gradient-to-br from-marawa-red to-marawa-gold rounded-3xl flex items-center justify-center text-white shadow-xl shadow-red-500/20 mb-8">
                 <Bot size={40} />
             </div>
             
             <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">
                 Assalamualaikum!
             </h2>
             <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-10">
                 {t('chat_welcome')}
             </p>

             {/* DUAL MODE CARDS */}
             <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
                
                {/* BEGINNER CARD */}
                <button 
                  onClick={() => handleStarterClick("Halo Baso, saya ingin belajar Bahasa Minang dari dasar. Tolong ajarkan kata-kata sapaan sehari-hari.")}
                  className="group relative p-8 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 hover:border-marawa-gold transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 text-left flex flex-col items-start"
                >
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <GraduationCap size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-yellow-600 transition-colors">
                        {t('start_mode_beginner')}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        {t('start_desc_beginner')}
                    </p>
                    <div className="mt-6 flex items-center text-xs font-bold text-yellow-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Start Learning →
                    </div>
                </button>

                {/* NATIVE CARD */}
                <button 
                  onClick={() => handleStarterClick("Assalamualaikum Sanak! Baa kaba? Ota lamak wak lah.")}
                  className="group relative p-8 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 hover:border-marawa-red transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 text-left flex flex-col items-start"
                >
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <MessageCircle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-red-600 transition-colors">
                        {t('start_mode_native')}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        {t('start_desc_native')}
                    </p>
                    <div className="mt-6 flex items-center text-xs font-bold text-red-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Mulai Ota →
                    </div>
                </button>

             </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white to-transparent dark:from-slate-900 dark:to-transparent opacity-80" />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 relative z-10 scroll-smooth">
        {renderStarter()}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-marawa-red to-red-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-marawa-gold border border-slate-100 dark:border-slate-700'
              }`}
            >
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-6 py-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-marawa-red to-red-600 text-white rounded-tr-none shadow-red-900/10'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-slate-200/50 dark:shadow-none'
              }`}
            >
              {msg.image && (
                <div className="mb-4 rounded-xl overflow-hidden border border-white/20 shadow-sm">
                    <img 
                    src={msg.image} 
                    alt="Uploaded content" 
                    className="w-full max-h-80 object-cover"
                    />
                </div>
              )}
              
              {msg.isLoading && !msg.content ? (
                <div className="flex items-center gap-3 text-sm opacity-80 py-2">
                   <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{animationDelay: '0ms'}}/>
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{animationDelay: '150ms'}}/>
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{animationDelay: '300ms'}}/>
                   </div>
                   <span className="font-medium">Baso sadang bapikia...</span>
                </div>
              ) : (
                <div className={`prose prose-lg dark:prose-invert max-w-none leading-relaxed ${mode === AppMode.WRITER && msg.role === 'model' ? 'font-serif' : ''}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area - Floating Modern Design */}
      <div className="p-4 md:p-6 sticky bottom-0 z-20">
         <div className="max-w-4xl mx-auto">
            {selectedImage && (
                <div className="mb-3 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl w-fit shadow-lg border border-slate-100 dark:border-slate-700 animate-in slide-in-from-bottom-2">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                        <ImageIcon size={20} className="text-slate-500"/>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Image Attached</span>
                        <span className="text-[10px] text-slate-400">Ready to analyze</span>
                    </div>
                    <button 
                    onClick={() => {
                        setSelectedImage(undefined);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="ml-2 w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition-colors"
                    >
                        ×
                    </button>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700">
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                />
                
                {/* Upload Button */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 mb-1 ml-1 text-slate-400 hover:text-marawa-gold hover:bg-yellow-50 dark:hover:bg-slate-700 rounded-full transition-all duration-300"
                    title="Upload Image"
                >
                    <ImageIcon size={22} />
                </button>
                
                {/* Text Input */}
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder={t('chat_placeholder')}
                    className="flex-1 max-h-32 min-h-[50px] py-3.5 bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none resize-none text-base leading-relaxed"
                    style={{ height: '52px' }}
                />
                
                {/* Send Button */}
                <button
                    type="submit"
                    disabled={(!input.trim() && !selectedImage) || isStreaming}
                    className={`
                        p-3 mb-1 mr-1 rounded-full transition-all duration-300 shadow-lg
                        ${(!input.trim() && !selectedImage) || isStreaming
                            ? 'bg-slate-100 text-slate-300 dark:bg-slate-700 dark:text-slate-500 shadow-none cursor-not-allowed'
                            : 'bg-gradient-to-br from-marawa-red to-red-600 text-white hover:scale-105 hover:shadow-red-500/30 active:scale-95'
                        }
                    `}
                >
                    {isStreaming ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className={input.trim() ? "translate-x-0.5" : ""} />}
                </button>
            </form>
            
            <div className="text-center mt-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-300 dark:text-slate-600 font-bold">
                    Baso.AI <span className="mx-2">•</span> Gemini Powered
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChatInterface;
