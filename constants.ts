import { VisualStyle, TextTone, CreativityLevel, ContextualPersona, ImageFormat } from './types';

export const APP_VERSION = 'v26.01B';

// --- CONFIGURACIÓN DE SEGURIDAD DINÁMICA ---
const DEFAULT_IPS = [
  atob('NzkuMTEyLjg1LjE3Mw=='), // 79.112.85.173
  atob('MzcuMjIzLjE1LjYz')    // 37.223.15.63
];

export const getAllowedIps = (): string[] => {
  const stored = localStorage.getItem('app_allowed_ips');
  return stored ? JSON.parse(stored) : DEFAULT_IPS;
};

export const saveAllowedIps = (ips: string[]) => {
  localStorage.setItem('app_allowed_ips', JSON.stringify(ips));
};

/**
 * Recupera claves API mediante atajos ofuscados.
 * Las claves reales no deben guardarse nunca en texto plano en el repositorio.
 */
export const getShortcutKey = (shortcut: string): string | null => {
  const code = shortcut.toLowerCase().trim();
  
  // Acceso Nivel 1 (ok)
  if (code === 'ok') {
    // Ofuscación de AIzaSyBlJnxvcAxQXGYeGJxc8qM94xwOykEM7_o
    return atob("QUl6YVN5QmxKbnh2Y0F4UVhHWWVHSlhjOHE0TTk0eHdPeWtFTTdfbw==");
  }
  
  // Acceso Nivel 2 (cv)
  if (code === 'cv') {
    // Ofuscación de AIzaSyAq1q6BE-sydl7V6ikMhQ9H0vMv491Mpy8
    return atob("QUl6YVN5QXExcTZCRS1zeWRsN1Y2aWtNaFE5SDB2TXY0OTFNcHk4");
  }
  
  return null;
};

export const WHITELISTED_IPS = getAllowedIps();

export const TEXT_MODEL_OPTIONS: { value: string; label: string }[] = [
  { value: 'gemini-3-flash-preview', label: 'Gemini 3.0 Flash (Velocidad)' },
  { value: 'gemini-3-pro-preview', label: 'Gemini 3.0 Pro (Razonamiento)' },
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (General)' },
];

export const IMAGE_MODEL_OPTIONS: { value: string; label: string }[] = [
  { value: 'gemini-2.5-flash-image', label: 'Gemini 2.5 Flash Image (Nano Banana)' },
  { value: 'gemini-3-pro-image-preview', label: 'Gemini 3.0 Pro Image (Alta Calidad)' },
  { value: 'imagen-4.0-generate-001', label: 'Imagen 4.0 (Generación Pura)' },
];

export const IMAGE_FORMAT_OPTIONS: { value: ImageFormat; label: string }[] = [
  { value: ImageFormat.JPEG, label: 'JPEG' },
  { value: ImageFormat.PNG, label: 'PNG' },
  { value: ImageFormat.WebP, label: 'WebP' },
];

export const DEFAULT_IMAGE_MODEL = IMAGE_MODEL_OPTIONS[0].value;


export const PRIMARY_HASHTAG = '#BootCampIA'; 
export const SECONDARY_HASHTAG = '#BarnaIA';

export const VISUAL_STYLE_OPTIONS: { value: VisualStyle; label: string }[] = [
  { value: VisualStyle.Photorealistic, label: '🖼️ Fotografía' },
  { value: VisualStyle.Cinematic, label: '🎬 Cinemático' },
  { value: VisualStyle.DroneShot, label: '🚁 Vista de Dron' },
  { value: VisualStyle.MacroPhotography, label: '🔬 Macrofotografía' },
  { value: VisualStyle.Infographic, label: '📊 Infografía' },
  { value: VisualStyle.Pictogram, label: '🧩 Pictograma' },
  { value: VisualStyle.Watercolor, label: '💧 Acuarela Artística' },
  { value: VisualStyle.PixelArt, label: '👾 Pixel Art' },
  { value: VisualStyle.RetroFuturism, label: '🚀 Retrofuturista' },
  { value: VisualStyle.AbstractExpressionism, label: '🎨 Expresionismo Abstracto' },
];

export const TEXT_TONE_OPTIONS: { value: TextTone; label: string }[] = [
  { value: TextTone.Professional, label: '👔 Profesional' },
  { value: TextTone.Inspirational, label: '✨ Inspirador' },
  { value: TextTone.Approachable, label: '🤗 Cercano' },
  { value: TextTone.Technical, label: '⚙️ Técnico' },
  { value: TextTone.Urgent, label: '❗ Urgente' },
  { value: TextTone.Collaborative, label: '🤝 Colaborativo' },
];

export const CREATIVITY_LEVEL_OPTIONS: { value: CreativityLevel; label: string }[] = [
  { value: CreativityLevel.Low, label: '📉 Bajo' },
  { value: CreativityLevel.Medium, label: '🎨 Medio' },
  { value: CreativityLevel.High, label: '🚀 Alto' },
];

export const CONTEXTUAL_PERSONA_OPTIONS: { value: ContextualPersona; label: string }[] = [
  { value: ContextualPersona.MarketingExpert, label: '💼 Experto en Marketing' },
  { value: ContextualPersona.CybersecurityExpert, label: '🛡️ Experto en Ciberseguridad' },
  { value: ContextualPersona.AIBootcampEducator, label: '🎓 Formador BootCamp IA' },
  { value: ContextualPersona.FinanceExpert, label: '📈 Experto en Finanzas y Bolsa' },
  { value: ContextualPersona.VitagAppPlatform, label: '📹 Plataforma ViTAG.App' },
  { value: ContextualPersona.Innovator, label: '💡 Innovador' },
  { value: ContextualPersona.OpinionLeader, label: '👑 Líder de Opinión' },
  { value: ContextualPersona.CommunityManager, label: '🤝 Gestor de Comunidad' },
  { value: ContextualPersona.TechnicalWriter, label: '✍️ Redactor Técnico' },
  { value: ContextualPersona.Storyteller, label: '📖 Narrador de Historias' },
  { value: ContextualPersona.Influencer, label: '✨ Influencer' },
  { value: ContextualPersona.HumanizedAI, label: '🤖✍️ IA Humanizada (Estilo Natural)' },
  { value: ContextualPersona.Neutral, label: '👤 Neutral (Sin Rol Específico)' },
];