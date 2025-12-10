import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AppMode, BASO_SYSTEM_PROMPT } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to get the correct model based on complexity and task.
 */
const getModelForMode = (mode: AppMode): string => {
  switch (mode) {
    case AppMode.CHAT:
    case AppMode.KNOWLEDGE:
    case AppMode.WRITER:
      // Using Pro for high reasoning and creative tasks
      return 'gemini-3-pro-preview'; 
    case AppMode.VISION:
      // Using Pro Image for high quality visual analysis
      return 'gemini-3-pro-image-preview'; 
    case AppMode.TRANSLATE:
    case AppMode.GRAMMAR:
    case AppMode.AUTOCOMPLETE:
      // Flash is sufficient and faster for strict utility tasks
      return 'gemini-2.5-flash';
    default:
      return 'gemini-2.5-flash';
  }
};

/**
 * Helper to construct the specific prompt based on mode
 */
const getSpecificInstruction = (mode: AppMode): string => {
  switch (mode) {
    case AppMode.TRANSLATE:
      return "MODE: TRANSLATOR. Tugasmu hanya menerjemahkan. Output HANYA teks hasil terjemahan final. Jangan pakai label 'Terjemahan:' atau 'Artinya:'. Jangan pakai tanda kutip. Jika ada ambiguitas dialek, pilih dialek Padang umum.";
    case AppMode.GRAMMAR:
      return `MODE: GRAMMAR CORRECTOR. Analisis tata bahasa Minangkabau dari input user.
      Output WAJIB dalam format Markdown berikut:
      
      # [EMOJI] [STATUS SINGKAT: "Tata Bahasa Valid" atau "Perlu Koreksi"]
      
      ### ✅ Saran Perbaikan
      > [Tulis ulang kalimat yang sudah benar/dikoreksi disini]
      
      ### 🧐 Analisis Linguistik
      * [Poin penjelasan 1 - Fokus ke struktur kalimat]
      * [Poin penjelasan 2 - Fokus ke pemilihan kata/diksi]`;
    case AppMode.AUTOCOMPLETE:
      return "MODE: MAGIC AUTOCOMPLETE. \nATURAN LOGIKA:\n1. Analisis karakter terakhir input user.\n2. Jika input berakhir TITIK (.), TANYA (?), SERU (!): Outputkan KALIMAT BARU yang relevan. WAJIB diawali Huruf KAPITAL.\n3. Jika input TIDAK berakhir tanda baca (menggantung): Outputkan SAMBUNGAN kalimat (suffix). WAJIB diawali huruf kecil.\n4. Output HANYA teks saran. JANGAN mengulang input. JANGAN pakai tanda kutip. JANGAN akhiri dengan titik.";
    case AppMode.WRITER:
      return "MODE: SASTRAWAN MINANG (WRITER). Kamu adalah sastrawan Minang ulung. Output harus memiliki nilai seni tinggi, diksi yang indah, dan 'nyastro'. Jika diminta Pantun, pastikan rima a-b-a-b sempurna dan sampiran relevan. Jika cerpen, gunakan alur yang menyentuh hati.";
    case AppMode.KNOWLEDGE:
      return "MODE: ENSIKLOPEDIA ADAT (KNOWLEDGE). Kamu adalah pakar budaya, sejarawan, dan ahli adat Minang. Jawaban harus terstruktur, edukatif, dan akurat secara historis. Gunakan referensi Tambo Alam Minangkabau jika relevan. Gaya bahasa: Intelek namun mudah dipahami.";
    case AppMode.VISION:
      return "MODE: VISION LENS. Analisis gambar ini secara mendalam. Identifikasi objek dan hubungkan dengan budaya, sejarah, atau filosofi Minangkabau. Jelaskan makna tersiratnya.";
    default:
      return "MODE: INTERACTIVE CHAT. Berinteraksi secara natural, ramah, dan seperti teman (Sanak).";
  }
};

export const streamResponse = async (
  prompt: string,
  mode: AppMode,
  history: { role: string; parts: { text: string }[] }[] = [],
  imagePart?: { inlineData: { data: string; mimeType: string } }
): Promise<AsyncIterable<string>> => {
  const modelName = getModelForMode(mode);
  
  // Configure Thinking Budget for complex reasoning tasks if using Pro model
  const isPro = modelName.includes('gemini-3-pro');
  const thinkingConfig = isPro && (mode === AppMode.KNOWLEDGE || mode === AppMode.WRITER) 
    ? { thinkingBudget: 2048 } 
    : undefined;

  const systemInstruction = `${BASO_SYSTEM_PROMPT}\n\n${getSpecificInstruction(mode)}`;

  try {
    // If image is present, we must use generateContentStream (non-chat) or specialized setup
    if (imagePart) {
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents: {
          parts: [imagePart, { text: prompt }]
        },
        config: {
          systemInstruction,
          thinkingConfig
        }
      });
      
      // Create an async generator to yield text chunks
      async function* generator() {
        for await (const chunk of responseStream) {
            yield chunk.text || "";
        }
      }
      return generator();

    } else {
      // Text-only interaction
      
      if (mode === AppMode.CHAT || mode === AppMode.WRITER || mode === AppMode.KNOWLEDGE || mode === AppMode.VISION) {
         // Create a chat session
         const chat = ai.chats.create({
           model: modelName,
           history: history,
           config: {
             systemInstruction,
             thinkingConfig
           }
         });

         const result = await chat.sendMessageStream({ message: prompt });
         
         async function* generator() {
            for await (const chunk of result) {
                yield (chunk as GenerateContentResponse).text || "";
            }
         }
         return generator();

      } else {
        // Single turn utilities
        const result = await ai.models.generateContentStream({
            model: modelName,
            contents: prompt,
            config: {
                systemInstruction,
                thinkingConfig
            }
        });

        async function* generator() {
            for await (const chunk of result) {
                yield chunk.text || "";
            }
         }
         return generator();
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};