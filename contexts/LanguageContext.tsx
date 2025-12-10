
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // General
  'app_name': { id: 'Baso.AI', en: 'Baso.AI' },
  'app_desc': { id: 'Educator & Sahabat Minang', en: 'Educator & Minang Companion' },
  'start_btn': { id: 'Mulai Sekarang', en: 'Get Started' },
  'try_btn': { id: 'Coba Baso Gratis', en: 'Try Baso for Free' },
  'loading': { id: 'Sedang memuat...', en: 'Loading...' },
  'footer_made': { id: 'Inovasi untuk Melestarikan Warisan Minangkabau', en: 'Innovation to Preserve Minangkabau Heritage' },

  // Auth & Support
  'auth_login': { id: 'Masuk / Daftar', en: 'Login / Sign Up' },
  'auth_logout': { id: 'Keluar', en: 'Logout' },
  'auth_welcome': { id: 'Halo,', en: 'Hi,' },
  'donate_btn': { id: 'Traktir Baso ', en: 'Treat Baso ' },
  'donate_desc': { id: 'Dukung biaya server & pengembangan.', en: 'Support server & dev costs.' },
  'support_us': { id: 'Dukung Kami', en: 'Support Us' },

  // Common UI
  'error_network': { id: 'Maaf, terjadi kesalahan jaringan.', en: 'Sorry, network error occurred.' },
  'copy': { id: 'Salin', en: 'Copy' },
  'image_attached': { id: 'Gambar Terlampir', en: 'Image Attached' },
  'ready_analyze': { id: 'Siap dianalisis', en: 'Ready to analyze' },
  'footer_tag': { id: 'Baso.AI • Ditenagai Gemini', en: 'Baso.AI • Gemini Powered' },

  // Landing Page
  'hero_tag': { id: '✨ Revolusi Pelestarian Budaya', en: '✨ Cultural Preservation Revolution' },
  'hero_title_1': { id: 'Jembatan Digital', en: 'The Digital Bridge to' },
  'hero_title_2': { id: 'Budaya Minangkabau', en: 'Minangkabau Culture' },
  'hero_subtitle': { 
    id: 'Bukan sekadar penerjemah. Baso adalah asisten AI cerdas yang memahami dialek, adat, sejarah, dan konteks budaya Minangkabau secara mendalam.',
    en: 'More than just a translator. Baso is an intelligent AI assistant that deeply understands Minangkabau dialects, customs, history, and cultural context.'
  },
  'why_title': { id: 'Mengapa Harus Baso?', en: 'Why Choose Baso?' },
  'why_desc': { 
    id: 'Di era digital, bahasa daerah sering terpinggirkan. Baso hadir menggunakan teknologi Gemini 3 Pro terbaru untuk memastikan Bahasa Minang tetap hidup, relevan, dan mudah dipelajari oleh siapa saja, kapan saja.',
    en: 'In the digital age, local languages are often marginalized. Baso uses the latest Gemini 3 Pro technology to ensure the Minang language remains alive, relevant, and accessible to everyone, anytime.'
  },
  'feature_title': { id: 'Eksplorasi Fitur', en: 'Explore Features' },
  'feature_subtitle': { id: 'Teknologi canggih untuk pengalaman budaya yang imersif.', en: 'Advanced technology for an immersive cultural experience.' },
  
  // Sidebar Menu & Feature Cards
  'menu_chat': { id: 'Chat Interaktif', en: 'Interactive Chat' },
  'menu_chat_desc': { 
    id: 'Ngobrol luwes dengan berbagai dialek (Padang, Pariaman, dll) layaknya teman akrab.', 
    en: 'Chat naturally in various dialects (Padang, Pariaman, etc) just like a close friend.' 
  },
  'menu_translate': { id: 'Smart Translator', en: 'Smart Translator' },
  'menu_translate_desc': { 
    id: 'Menerjemahkan makna & konteks, bukan sekadar kata per kata. Paham idiom lokal.', 
    en: 'Translates meaning & context, not just word-for-word. Understands local idioms.' 
  },
  'menu_writer': { id: 'Minang Writer', en: 'Minang Writer' },
  'menu_writer_desc': { 
    id: 'Buat pantun, cerpen, atau naskah pidato adat (pasambahan) secara instan.', 
    en: 'Create pantun (poems), short stories, or traditional ceremonial speeches instantly.' 
  },
  'menu_grammar': { id: 'Cek Tata Bahasa', en: 'Grammar Check' },
  'menu_grammar_desc': { 
    id: 'Koreksi struktur kalimat agar sesuai kaidah bahasa Minang yang baik.', 
    en: 'Correct sentence structure to align with proper Minang language rules.' 
  },
  'menu_autocomplete': { id: 'Magic Autocomplete', en: 'Magic Autocomplete' },
  'menu_autocomplete_desc': { 
    id: 'Buntu saat menulis? Baso memberikan saran kelanjutan kalimat yang natural.', 
    en: 'Stuck writing? Baso provides natural sentence completion suggestions.' 
  },
  'menu_knowledge': { id: 'Ensiklopedia Adat', en: 'Cultural Encyclopedia' },
  'menu_knowledge_desc': { 
    id: 'Tanya jawab seputar sejarah Pagaruyung, Tambo, hingga filosofi masakan Rendang.', 
    en: 'Q&A about Pagaruyung history, Tambo, to the philosophy of Rendang.' 
  },
  'menu_etiquette': { id: 'Cek Kato Nan Ampek', en: 'Etiquette Check' },
  'menu_etiquette_desc': { 
    id: 'Analisis kesopanan bahasa berdasarkan lawan bicara (Kato Nan Ampek).', 
    en: 'Analyze speech politeness based on social hierarchy (Kato Nan Ampek).' 
  },

  // Chat Interface
  'chat_placeholder': { id: 'Tanyoan apo sajo ka Baso... (Tanya apa saja)', en: 'Ask Baso anything...' },
  'chat_welcome': { id: 'Assalamualaikum! Ambo Baso. A nan bisa dibantu hari ko?', en: 'Assalamualaikum! I am Baso. How can I help you today?' },
  'chat_welcome_writer': { id: 'Selamat datang di Studio Sastra Minang. Kito nio mambuek karya apo?', en: 'Welcome to Minang Literature Studio. What masterpiece shall we create?' },
  'chat_welcome_knowledge': { id: 'Selamat datang di Pustaka Adat. Mari gali kearifan lokal kito.', en: 'Welcome to the Cultural Library. Let\'s explore our local wisdom.' },
  'chat_disclaimer': { id: 'Baso menggunakan AI dan bisa khilaf. Cek kembali informasi penting.', en: 'Baso uses AI and may make mistakes. Double-check important info.' },
  'chat_loading': { id: 'Baso sedang berpikir...', en: 'Baso is thinking...' },

  // New Starter Options
  'start_mode_beginner': { id: 'Saya Ingin Belajar', en: 'I Want to Learn' },
  'start_desc_beginner': { id: 'Mulai dari nol. Baso akan menjawab dengan Bahasa Indonesia/Inggris.', en: 'Start from scratch. Baso will reply in Indonesian/English.' },
  'start_mode_native': { id: 'Urang Awak (Native)', en: 'Native Speaker' },
  'start_desc_native': { id: 'Langsung ota lamak pakai Bahaso Minang. Full Immersion.', en: 'Direct deep conversation in Minang Language. Full Immersion.' },

  // Interactive Prompts (Sent to AI)
  'prompt_pantun': { id: 'Buatkan pantun Minang tentang...', en: 'Create a Minang pantun about...' },
  'prompt_cerpen': { id: 'Tuliskan cerpen pendek berbahasa Minang dengan tema...', en: 'Write a short Minang story with theme...' },
  'prompt_pidato': { id: 'Buatkan naskah pidato adat (Pasambahan) untuk acara...', en: 'Create a traditional speech (Pasambahan) for...' },
  'prompt_surat': { id: 'Buatkan surat resmi dalam bahasa Minang untuk...', en: 'Create a formal letter in Minang for...' },
  'prompt_history': { id: 'Ceritakan sejarah kerajaan Pagaruyung ringkas...', en: 'Tell the brief history of Pagaruyung Kingdom...' },
  'prompt_culinary': { id: 'Jelaskan filosofi di balik masakan Rendang...', en: 'Explain the philosophy behind Rendang...' },
  'prompt_customs': { id: 'Jelaskan sistem matrilineal di Minangkabau...', en: 'Explain the matrilineal system in Minangkabau...' },
  'prompt_figures': { id: 'Siapa saja tokoh pahlawan nasional dari Minangkabau?', en: 'Who are the national heroes from Minangkabau?' },
  'prompt_beginner': { id: 'Halo Baso, saya ingin belajar Bahasa Minang dari dasar. Tolong ajarkan kata-kata sapaan sehari-hari.', en: 'Hello Baso, I want to learn Minang Language from scratch. Please teach me daily greetings.' },
  'prompt_native': { id: 'Assalamualaikum Sanak! Baa kaba? Ota lamak wak lah.', en: 'Assalamualaikum Sanak! How are you? Let\'s have a good chat.' },

  // Writer Specific
  'writer_opt_pantun': { id: 'Pantun', en: 'Pantun (Poem)' },
  'writer_opt_cerpen': { id: 'Cerpen Minang', en: 'Short Story' },
  'writer_opt_pidato': { id: 'Pidato Adat', en: 'Traditional Speech' },
  'writer_opt_surat': { id: 'Surat Resmi', en: 'Formal Letter' },
  'writer_subtitle': { id: 'Pilih genre sastra Minangkabau di bawah ini untuk memulai.', en: 'Select a Minangkabau literature genre below to start.' },

  // Knowledge Specific
  'know_opt_history': { id: 'Sejarah & Kerajaan', en: 'History & Kingdoms' },
  'know_opt_food': { id: 'Kuliner & Filosofi', en: 'Culinary & Philosophy' },
  'know_opt_customs': { id: 'Adat Istiadat', en: 'Customs & Traditions' },
  'know_opt_figures': { id: 'Tokoh Minang', en: 'Minang Figures' },
  'know_subtitle': { id: 'Eksplorasi kekayaan intelektual dan sejarah Minangkabau.', en: 'Explore the intellectual wealth and history of Minangkabau.' },

  // Etiquette Specific
  'etiq_title': { id: 'Cek Kato Nan Ampek', en: 'Etiquette Validator' },
  'etiq_validator_sub': { id: 'Validator Kato Nan Ampek', en: 'Kato Nan Ampek Validator' },
  'etiq_input_placeholder': { id: 'Ketik kalimat yang ingin diuji kesopanannya...', en: 'Type sentence to validate politeness...' },
  'etiq_audience_label': { id: 'Siapa Lawan Bicara?', en: 'Who is the Audience?' },
  'etiq_btn': { id: 'Analisis Etika', en: 'Analyze Etiquette' },
  'etiq_analyzing': { id: 'Menganalisis Kato Nan Ampek...', en: 'Analyzing Kato Nan Ampek...' },
  'etiq_empty_title': { id: 'Belum ada analisis', en: 'No analysis yet' },
  'etiq_empty_desc': { id: 'Masukkan kalimat dan pilih lawan bicara untuk melihat apakah bahasamu sudah sesuai adat.', en: 'Enter a sentence and select an audience to see if your language adheres to custom.' },
  
  'audience_parents': { id: 'Orang Tua / Datuak / Guru', en: 'Parents / Elders / Teachers' },
  'audience_same_age': { id: 'Teman Sebaya', en: 'Same Age Friends' },
  'audience_younger': { id: 'Lebih Muda / Anak', en: 'Younger / Children' },
  'audience_inlaws': { id: 'Sumando / Ipar', en: 'In-laws / Formal Relations' },

  // Translator
  'trans_title': { id: 'Penerjemah Minang', en: 'Minang Translator' },
  'trans_desc': { id: 'Deteksi otomatis Indonesia/Inggris ke Minang', en: 'Auto-detect Indo/Eng to Minang' },
  'trans_input': { id: 'Ketik teks disini...', en: 'Type text here...' },
  'trans_result': { id: 'Hasil Terjemahan', en: 'Translation Result' },
  'trans_btn': { id: 'Terjemahkan', en: 'Translate' },
  'trans_auto': { id: 'Deteksi Otomatis', en: 'Auto-Detect' },
  'trans_minang': { id: 'Minang (Padang)', en: 'Minang (Padang)' },
  'trans_loading': { id: 'Menerjemahkan konteks...', en: 'Translating context...' },
  'trans_empty': { id: 'Hasil terjemahan akan muncul disini', en: 'Translation result will appear here' },

  // Tools (Grammar & Autocomplete)
  'grammar_title': { id: 'Koreksi Tata Bahasa', en: 'Grammar Corrector' },
  'grammar_desc': { id: 'Cek apakah kalimat Minangmu sudah benar.', en: 'Check if your Minang sentence is correct.' },
  'auto_title': { id: 'Lengkapi Kalimat', en: 'Autocomplete' },
  'auto_desc': { id: 'Cari ide kelanjutan kalimat.', en: 'Get ideas to finish your sentence.' },
  
  'placeholder_grammar': { id: 'Contoh: Ambo pai ka pasa mambali lado...', en: 'Example: Ambo pai ka pasa mambali lado...' },
  'placeholder_auto': { id: 'Mulai ketik kalimat Minang, Baso akan melengkapinya otomatis...', en: 'Start typing Minang sentence, Baso will complete it automatically...' },
  
  'tool_auto_sub': { id: 'Real-time AI Completion', en: 'Real-time AI Completion' },
  'tool_util_sub': { id: 'Alat Utilitas AI', en: 'AI Utility Tool' },
  'tool_tab_hint': { id: 'Tekan TAB untuk terima saran', en: 'Press TAB to accept suggestion' },
  'tool_input_label': { id: 'Input', en: 'Input' },
  'tool_magic_label': { id: 'Magic Editor', en: 'Magic Editor' },
  'tool_grammar_hint': { id: 'Baso akan menganalisis struktur & konteks', en: 'Baso will analyze structure & context' },
  'tool_check_btn': { id: 'Cek Tata Bahasa', en: 'Check Grammar' },
  'tool_analyzing': { id: 'Sedang menganalisis...', en: 'Analyzing...' },
  'tool_result_label': { id: 'Hasil Analisis', en: 'Analysis Result' },
  'tool_suggestion_label': { id: 'Saran (Tekan Tab)', en: 'Suggestion (Press Tab)' },
  'tool_thinking': { id: 'Baso sedang berpikir...', en: 'Baso is thinking...' },

  // Vision
  'vision_title': { id: 'Analisis Visual', en: 'Visual Analysis' },

  // Footer
  'footer_product': { id: 'Produk', en: 'Product' },
  'footer_resources': { id: 'Sumber Daya', en: 'Resources' },
  'footer_legal': { id: 'Legal', en: 'Legal' },
  'footer_about': { id: 'Tentang Kami', en: 'About Us' },
  'footer_privacy': { id: 'Kebijakan Privasi', en: 'Privacy Policy' },
  'footer_terms': { id: 'Syarat & Ketentuan', en: 'Terms & Conditions' },
  'footer_contact': { id: 'Hubungi Kami', en: 'Contact Us' },
  'footer_community': { id: 'Komunitas', en: 'Community' },
  'footer_blog': { id: 'Blog Budaya', en: 'Culture Blog' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
