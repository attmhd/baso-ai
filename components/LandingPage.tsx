
import React from 'react';
import { 
  MessageSquare, 
  Languages, 
  Scale, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Cpu,
  Globe,
  Github,
  Twitter,
  Instagram,
  PenTool,
  Wand2,
  CheckCircle2,
  MoveRight,
  Heart
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-yellow-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-marawa-red to-marawa-gold rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-marawa-red/20">
              B
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Baso<span className="text-marawa-gold">.AI</span></span>
          </div>
          
          <div className="flex items-center gap-6">
             {/* Language Toggles */}
             <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
                <button 
                  onClick={() => setLanguage('id')} 
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${language === 'id' ? 'bg-white dark:bg-slate-600 shadow-sm text-marawa-red' : 'text-slate-500'}`}
                >
                  IND
                </button>
                <button 
                  onClick={() => setLanguage('en')} 
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${language === 'en' ? 'bg-white dark:bg-slate-600 shadow-sm text-marawa-red' : 'text-slate-500'}`}
                >
                  ENG
                </button>
             </div>

             <button 
                onClick={onStart}
                className="text-sm font-semibold px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:bg-marawa-red dark:hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10"
             >
                {t('start_btn')}
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-marawa-gold/10 to-transparent rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-marawa-red/5 to-transparent rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm mb-4 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-marawa-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-marawa-gold"></span>
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wide uppercase">{t('hero_tag')}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            {t('hero_title_1')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-marawa-red via-marawa-red to-marawa-gold">
              {t('hero_title_2')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button 
              onClick={onStart}
              className="group relative px-8 py-4 bg-marawa-red text-white rounded-full font-bold text-lg hover:bg-red-700 transition-all hover:scale-105 shadow-xl shadow-red-500/20 flex items-center gap-3"
            >
              {t('try_btn')}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#features" className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full font-semibold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              {t('feature_title')}
            </a>
          </div>

          {/* Stats / Trust */}
          <div className="pt-12 flex items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 text-slate-400 font-semibold">
                <Cpu size={20} /> Gemini 3 Pro
             </div>
             <div className="flex items-center gap-2 text-slate-400 font-semibold">
                <Globe size={20} /> Multi-Dialect
             </div>
             <div className="flex items-center gap-2 text-slate-400 font-semibold">
                <Sparkles size={20} /> Real-time AI
             </div>
          </div>
        </div>
      </section>

      {/* Why Section - The Mission */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-800 to-transparent opacity-50" />
         
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              {t('why_title')}
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              {t('why_desc')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-marawa-gold/50 transition-colors">
                 <div className="w-12 h-12 bg-marawa-red/20 rounded-lg flex items-center justify-center text-marawa-red mb-4">
                    <BookOpen size={24} />
                 </div>
                 <h4 className="font-bold text-lg mb-2">Preservation</h4>
                 <p className="text-sm text-slate-400">Menjaga kemurnian bahasa dari kepunahan.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-marawa-gold/50 transition-colors">
                 <div className="w-12 h-12 bg-marawa-gold/20 rounded-lg flex items-center justify-center text-marawa-gold mb-4">
                    <Sparkles size={24} />
                 </div>
                 <h4 className="font-bold text-lg mb-2">Innovation</h4>
                 <p className="text-sm text-slate-400">Menggabungkan tradisi dengan AI modern.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-marawa-red to-marawa-gold rounded-[2.5rem] blur-xl opacity-30 animate-pulse" />
            <div className="relative h-[500px] bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
               <div className="bg-slate-950 p-4 border-b border-slate-700 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
               </div>
               <div className="flex-1 p-8 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1653910729824-df4f32c60acf?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-1000">
                  <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl text-center border border-slate-600">
                      <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">BASO.AI</span>
                      <p className="text-marawa-gold mt-2 font-medium tracking-widest uppercase text-xs">The Spirit of Minangkabau</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Section - Rich Features Grid (REDESIGNED) */}
      <section id="features" className="py-24 px-6 bg-slate-50 dark:bg-slate-950 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-marawa-red font-bold tracking-wider text-sm uppercase mb-2 block">Technology Meets Tradition</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">
              {t('feature_title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-light">
              {t('feature_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <RichFeatureCard 
              icon={<MessageSquare size={28} />}
              gradient="from-yellow-400 to-yellow-600"
              shadowColor="shadow-yellow-500/25"
              tag="Communication"
              title={t('menu_chat')}
              desc={t('menu_chat_desc')}
            />
            <RichFeatureCard 
              icon={<Languages size={28} />}
              gradient="from-blue-400 to-blue-600"
              shadowColor="shadow-blue-500/25"
              tag="Translation"
              title={t('menu_translate')}
              desc={t('menu_translate_desc')}
            />
             <RichFeatureCard 
              icon={<Scale size={28} />}
              gradient="from-indigo-500 to-indigo-700"
              shadowColor="shadow-indigo-500/25"
              tag="Etiquette"
              title={t('menu_etiquette')}
              desc={t('menu_etiquette_desc')}
            />
            <RichFeatureCard 
              icon={<PenTool size={28} />}
              gradient="from-purple-400 to-purple-600"
              shadowColor="shadow-purple-500/25"
              tag="Creativity"
              title={t('menu_writer')}
              desc={t('menu_writer_desc')}
            />
             <RichFeatureCard 
              icon={<BookOpen size={28} />}
              gradient="from-green-400 to-green-600"
              shadowColor="shadow-green-500/25"
              tag="Education"
              title={t('menu_knowledge')}
              desc={t('menu_knowledge_desc')}
            />
             <RichFeatureCard 
              icon={<Wand2 size={28} />}
              gradient="from-orange-400 to-orange-600"
              shadowColor="shadow-orange-500/25"
              tag="Utility"
              title={t('menu_autocomplete')}
              desc={t('menu_autocomplete_desc')}
            />
          </div>
        </div>
      </section>

      {/* Footer - High Contrast Dark Theme */}
      <footer className="pt-24 pb-12 bg-slate-900 text-slate-300 relative overflow-hidden">
        {/* Subtle Marawa Glow */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-marawa-red via-marawa-gold to-marawa-black" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-marawa-gold opacity-5 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-marawa-red to-marawa-gold rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  B
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">Baso.AI</span>
              </div>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                {t('footer_made')}
              </p>
              <div className="flex gap-4">
                <SocialLink icon={<Twitter size={18} />} />
                <SocialLink icon={<Github size={18} />} />
                <SocialLink icon={<Instagram size={18} />} />
              </div>
            </div>

            <FooterColumn 
              title={t('footer_product')} 
              links={[t('menu_chat'), t('menu_etiquette'), t('menu_translate'), t('menu_writer')]} 
              action={onStart}
            />
            
            <FooterColumn 
              title={t('footer_resources')} 
              links={[t('footer_blog'), t('footer_community'), t('footer_about')]} 
            />

            <div className="col-span-1">
                <h4 className="font-bold text-white mb-6">{t('support_us')}</h4>
                <p className="text-sm text-slate-400 mb-4">{t('donate_desc')}</p>
                <a 
                   href="https://saweria.co/" // Replace with actual donation link
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-500/30 transition-all hover:-translate-y-1"
                >
                    <Heart size={18} fill="currentColor" />
                    {t('donate_btn')}
                </a>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Baso.AI. All rights reserved.</p>
            <div className="flex gap-6">
               <span>Padang, West Sumatra</span>
               <span>Powered by <a href='https://natta.studio'>Natta std.</a></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// IMPROVED FEATURE CARD COMPONENT
const RichFeatureCard: React.FC<{
  icon: React.ReactNode, 
  title: string, 
  desc: string, 
  tag: string,
  gradient: string,
  shadowColor: string
}> = ({ icon, title, desc, tag, gradient, shadowColor }) => (
  <div className={`group relative p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${shadowColor} overflow-hidden h-full flex flex-col`}>
    
    {/* Decorative Background Blob that appears on hover */}
    <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 rounded-full`} />
    <div className={`absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr ${gradient} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500 rounded-full`} />

    <div className="relative z-10 flex flex-col h-full">
      {/* Icon Container */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>

      {/* Tag */}
      <div className="mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800">
          {tag}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-400 transition-all">
        {title}
      </h3>
      
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-grow font-light">
        {desc}
      </p>

      {/* Action Indicator */}
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100 opacity-60 group-hover:opacity-100 transition-opacity">
        <span>Explore</span>
        <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
);

const FooterColumn: React.FC<{title: string, links: string[], action?: () => void}> = ({ title, links, action }) => (
  <div>
    <h4 className="font-bold text-white mb-6">{title}</h4>
    <ul className="space-y-4 text-sm text-slate-400">
      {links.map((link, i) => (
        <li key={i}>
          <button onClick={action} className="hover:text-marawa-gold transition-colors text-left">{link}</button>
        </li>
      ))}
    </ul>
  </div>
);

const SocialLink: React.FC<{icon: React.ReactNode}> = ({ icon }) => (
  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-marawa-red hover:text-white transition-all">
    {icon}
  </a>
);

export default LandingPage;
