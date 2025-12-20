import { GoogleGenAI, GenerateContentResponse, Candidate, Modality } from "@google/genai";
import { 
    FetchedNews, 
    VisualStyle, 
    TextTone, 
    CreativityLevel, 
    GroundingChunk, 
    ContextualPersona, 
    TextGenerationResult,
    NewsFetchResult,
    ImageGenerationResult,
    SocialPlatform,
    AdvancedAISettings,
    ImageFormat
} from '../types';
import { PRIMARY_HASHTAG, SECONDARY_HASHTAG } from '../constants';
import { NORMAL_TO_BOLD, NORMAL_TO_ITALIC, convertToUnicodeStyled } from '../utils/unicodeMaps';

const getApiKey = (): string => {
  // 1. Intentar obtener desde variable de entorno (prioridad alta)
  const envKey = process.env.API_KEY;
  if (envKey && envKey.trim() !== '') {
    return envKey;
  }

  // 2. Intentar obtener desde localStorage (configuración usuario)
  const localKey = window.localStorage.getItem('redactor_api_key');
  if (localKey && localKey.trim() !== '') {
    return localKey;
  }

  // 3. Si no hay key, lanzar error específico para que la UI lo capture
  throw new Error("CUSTOM_API_KEY_MISSING");
};

export const fetchDynamicModels = async (): Promise<{ textModels: {value: string, label: string}[], imageModels: {value: string, label: string}[] }> => {
    let apiKey: string;
    try {
        apiKey = getApiKey();
    } catch (e) {
        // Si no hay API Key, devolvemos arrays vacíos para que la app use los defaults
        return { textModels: [], imageModels: [] };
    }

    try {
        // Usamos fetch directo a la API REST para listar modelos, ya que es más estable para metadatos
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) throw new Error("Failed to fetch models");
        
        const data = await response.json();
        const models = data.models || [];

        const textModels: {value: string, label: string}[] = [];
        const imageModels: {value: string, label: string}[] = [];

        models.forEach((model: any) => {
            const name = model.name.replace('models/', '');
            const displayName = model.displayName || name;
            
            // Lógica de filtrado
            const isImage = name.includes('image') || name.includes('imagen');
            const isGemini = name.includes('gemini');
            const isPro = name.includes('pro');
            const isFlash = name.includes('flash');
            
            // Construir etiqueta amigable
            let label = displayName;
            if (isGemini) {
                if (isPro) label = `${displayName} (Potente)`;
                else if (isFlash) label = `${displayName} (Rápido)`;
            }

            if (isImage) {
                 // Filtrar solo modelos que sepamos que generan imágenes
                 if (model.supportedGenerationMethods?.includes('generateContent') || model.supportedGenerationMethods?.includes('generateImages') || name.includes('imagen')) {
                    imageModels.push({ value: name, label: label });
                 }
            } else if (isGemini) {
                // Asumimos que los modelos gemini no-imagen son de texto/multimodal
                // Excluimos versiones legacy si es necesario, o mantenemos todo lo que soporte generateContent
                if (model.supportedGenerationMethods?.includes('generateContent')) {
                    textModels.push({ value: name, label: label });
                }
            }
        });

        // Ordenar: Pro primero, luego Flash, luego otros
        const sortModels = (a: any, b: any) => {
            const scoreA = (a.value.includes('pro') ? 2 : 0) + (a.value.includes('latest') ? 1 : 0);
            const scoreB = (b.value.includes('pro') ? 2 : 0) + (b.value.includes('latest') ? 1 : 0);
            return scoreB - scoreA;
        };

        return {
            textModels: textModels.sort(sortModels),
            imageModels: imageModels.sort(sortModels)
        };

    } catch (error) {
        console.warn("Could not fetch dynamic models list:", error);
        return { textModels: [], imageModels: [] };
    }
};

const cleanJsonString = (jsonStr: string): string => {
  let textToParse = jsonStr.trim();

  const fenceRegex = /```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/;
  const fenceMatch = textToParse.match(fenceRegex);

  if (fenceMatch && fenceMatch[1]) {
    textToParse = fenceMatch[1].trim();
  } else {
    const firstBrace = textToParse.indexOf('{');
    const firstBracket = textToParse.indexOf('[');
    let startIndex = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIndex = firstBrace;
    } else if (firstBracket !== -1) {
      startIndex = firstBracket;
    }

    if (startIndex !== -1) {
      const openChar = textToParse[startIndex];
      const closeChar = openChar === '{' ? '}' : ']';
      let balance = 0;
      let endIndex = -1;

      for (let i = startIndex; i < textToParse.length; i++) {
        if (textToParse[i] === openChar) {
          balance++;
        } else if (textToParse[i] === closeChar) {
          balance--;
        }
        if (balance === 0 && i >= startIndex) { 
          endIndex = i;
          break;
        }
      }
      
      if (endIndex !== -1) {
        textToParse = textToParse.substring(startIndex, endIndex + 1);
      }
    }
  }
  return textToParse.trim(); 
};

const handleApiError = (error: unknown, context: string): Error => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error ${context}:`, error);

    if (errorMessage === "CUSTOM_API_KEY_MISSING") {
        return new Error("CUSTOM_API_KEY_MISSING");
    }

    if (errorMessage.includes("API key not valid")) {
        return new Error("Clave API de Gemini inválida. Por favor, verifica tu configuración en el panel avanzado.");
    }
    if (errorMessage.includes("429") || errorMessage.toUpperCase().includes("RESOURCE_EXHAUSTED")) {
        return new Error(`Límite de cuota excedido al ${context}. Has realizado demasiadas solicitudes en un corto período de tiempo.`);
    }
    if (errorMessage.includes("404") || errorMessage.toUpperCase().includes("NOT_FOUND")) {
        return new Error(`El modelo de IA seleccionado no se encontró (${context}). Puede que el modelo esté obsoleto o mal configurado.`);
    }
    if (errorMessage.toLowerCase().includes("safety") || errorMessage.toLowerCase().includes("blocked")) {
         return new Error(`La solicitud fue bloqueada por los filtros de seguridad de la IA (${context}). Intenta reformular tu tema.`);
    }
    return new Error(`Error inesperado al ${context}: ${errorMessage}`);
};


const getPersonaPromptInstruction = (personas: ContextualPersona[]): string => {
    if (!personas.length || (personas.length === 1 && personas[0] === ContextualPersona.Neutral)) {
        return "";
    }

    const instructions = personas
        .filter(p => p !== ContextualPersona.Neutral)
        .map(persona => {
            switch (persona) {
                case ContextualPersona.CybersecurityExpert:
                    return "un experto en ciberseguridad con profundo conocimiento técnico y un enfoque en la protección de datos";
                case ContextualPersona.VitagAppPlatform:
                    return "la plataforma de video análisis Vitag.app, destacando la IA en video";
                case ContextualPersona.AIBootcampEducator:
                    return "un divulgador y formador de un Bootcamp de IA, explicando el tema de forma clara y educativa";
                case ContextualPersona.FinanceExpert:
                    return "un experto en finanzas y mercados bursátiles, ofreciendo análisis riguroso";
                case ContextualPersona.Innovator:
                    return "una perspectiva innovadora y visionaria, explorando el futuro";
                case ContextualPersona.Influencer:
                    return "un influencer carismático y cercano, usando lenguaje moderno";
                case ContextualPersona.MarketingExpert:
                    return "un experto en marketing digital orientado a resultados";
                case ContextualPersona.OpinionLeader:
                    return "un líder de opinión influyente con visión crítica";
                case ContextualPersona.CommunityManager:
                    return "un gestor de comunidad empático y colaborativo";
                case ContextualPersona.TechnicalWriter:
                    return "un redactor técnico preciso y estructurado";
                case ContextualPersona.Storyteller:
                    return "un narrador de historias que conecta emocionalmente";
                case ContextualPersona.HumanizedAI:
                    return "un estilo ultra-natural y humano, evitando patrones robóticos";
                default:
                    return "";
            }
        });

    if (instructions.length === 1) {
        return `Adopta la perspectiva de ${instructions[0]}.`;
    } else if (instructions.length > 1) {
        return `Combina las perspectivas de: ${instructions.join(', ')}.`;
    }
    return "";
};

const getConditionalHashtags = (personas: ContextualPersona[]): string[] => {
    const hashtags = new Set<string>();
    personas.forEach(persona => {
        switch (persona) {
            case ContextualPersona.VitagAppPlatform:
                hashtags.add('#ILoveVideo');
                break;
            case ContextualPersona.AIBootcampEducator:
            case ContextualPersona.CybersecurityExpert:
                hashtags.add('#IACompliance');
                break;
        }
    });
    return Array.from(hashtags);
};

const CONTEXTUAL_PERSONA_TRANSLATIONS: Record<ContextualPersona, string> = {
    [ContextualPersona.Neutral]: "Neutral",
    [ContextualPersona.CybersecurityExpert]: "Experto en Ciberseguridad",
    [ContextualPersona.VitagAppPlatform]: "Plataforma Vitag.app",
    [ContextualPersona.AIBootcampEducator]: "Formador Bootcamp IA",
    [ContextualPersona.Innovator]: "Innovador",
    [ContextualPersona.Influencer]: "Influencer",
    [ContextualPersona.MarketingExpert]: "Experto en Marketing",
    [ContextualPersona.OpinionLeader]: "Líder de Opinión",
    [ContextualPersona.CommunityManager]: "Gestor de Comunidad",
    [ContextualPersona.TechnicalWriter]: "Redactor Técnico",
    [ContextualPersona.Storyteller]: "Narrador de Historias",
    [ContextualPersona.HumanizedAI]: "IA Humanizada",
    [ContextualPersona.FinanceExpert]: "Experto en Finanzas",
};


export const fetchNewsOfTheDay = async (textModel: string, contextualPersonas: ContextualPersona[], currentTopic?: string): Promise<NewsFetchResult> => {
  let apiKey: string;
  try {
     apiKey = getApiKey();
  } catch (e) {
      throw handleApiError(e, 'al buscar noticias');
  }
  
  const ai = new GoogleGenAI({ apiKey });

  let prompt: string;
  let personaInfluenceInstruction = "";
  
  const relevantPersonas = contextualPersonas.filter(p => p !== ContextualPersona.Neutral);
  if (relevantPersonas.length > 0) {
    const personaNames = relevantPersonas.map(p => CONTEXTUAL_PERSONA_TRANSLATIONS[p]).join(', ');
    personaInfluenceInstruction = `\nConsidera que la noticia debe ser particularmente relevante para: "${personaNames}".`;
  }

  if (currentTopic && currentTopic.trim() !== "") {
    prompt = `Busca el artículo de noticias más impactante y reciente (últimas 24-48h) EN ESPAÑOL relacionado con: "${currentTopic.trim()}".${personaInfluenceInstruction} 
Devuelve JSON: {"title": "Titular conciso ESPAÑOL", "summary": "Resumen 2-3 frases ESPAÑOL", "url": "URL", "publicationDate": "Fecha legible"}.
Si no hay noticias, devuelve {"title": "No se encontró noticia relevante", ...}. Solo JSON.`;
  } else {
    prompt = `Busca el artículo de noticias más impactante y reciente (últimas 24-48h) en IA, Tecnología o Ciberseguridad EN ESPAÑOL.${personaInfluenceInstruction}
Devuelve JSON: {"title": "Titular conciso ESPAÑOL", "summary": "Resumen 2-3 frases ESPAÑOL", "url": "URL", "publicationDate": "Fecha legible"}. Solo JSON.`;
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        systemInstruction: "Eres un asistente de noticias JSON.",
        tools: [{ googleSearch: {} }],
      },
    });

    const responseText = response.text; 
    const tokenCount = response.usageMetadata?.totalTokenCount ?? null;

    if (typeof responseText !== 'string' || responseText.trim() === '') {
      throw new Error(`No se pudo obtener el contenido de la noticia.`);
    }
    
    let jsonString = cleanJsonString(responseText);
    let parsedData;
    try {
        parsedData = JSON.parse(jsonString);
    } catch (parseError) {
        throw new Error(`La IA devolvió una respuesta con formato inválido.`);
    }

    if (Array.isArray(parsedData) && parsedData.length > 0) {
        parsedData = parsedData[0];
    }

    if (parsedData && typeof parsedData.title === 'string') {
      return {
        news: {
            title: parsedData.title,
            summary: parsedData.summary,
            url: parsedData.url,
            publicationDate: typeof parsedData.publicationDate === 'string' ? parsedData.publicationDate : undefined, 
        } as FetchedNews,
        tokenCount: tokenCount,
      };
    } else {
      throw new Error("Formato de noticia inesperado.");
    }
  } catch (error) {
    throw handleApiError(error, 'al buscar noticias');
  }
};

const applyUnicodeStyling = (text: string): string => {
  let styledText = text;
  styledText = styledText.replace(/\*\*(.+?)\*\*/gs, (match, content) => {
    return convertToUnicodeStyled(content, 'bold');
  });
  styledText = styledText.replace(/\*(.+?)\*/gs, (match, content) => {
    if (content.startsWith(' ') || content.endsWith(' ') || content.includes('\n')) {
        if (/^[\-\*\+] /.test(match)) return match;
    }
    return convertToUnicodeStyled(content, 'italic');
  });
  return styledText;
};

const generateTextWithTokens = async (
  textModel: string,
  prompt: string,
  advancedSettings: AdvancedAISettings
): Promise<TextGenerationResult> => {
  let apiKey: string;
  try {
     apiKey = getApiKey();
  } catch (e) {
      throw handleApiError(e, 'generar texto');
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        temperature: advancedSettings.temperature,
        topP: advancedSettings.topP,
        topK: advancedSettings.topK,
      }
    });
    const tokenCount = response.usageMetadata?.totalTokenCount ?? null;
    
    if (typeof response.text !== 'string') {
      throw new Error('La respuesta de la API no fue un texto válido.');
    }
    
    let cleanedText = response.text.trim();
    cleanedText = applyUnicodeStyling(cleanedText);
    cleanedText = cleanedText.replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n').replace(/ {2,}/g, ' ').trim();

    return { text: cleanedText, tokenCount };
  } catch (error) {
    throw handleApiError(error, 'generar texto');
  }
};

const commonTextPromptInstructions = (topic: string, textTone: TextTone, creativityLevel: CreativityLevel): string => {
  return `
  Tema: "${topic}".
  Tono: ${textTone}.
  Creatividad: ${creativityLevel}.
  Idioma: Español de España.
  Estilo: Humano, natural, variado. Evita patrones robóticos.
  Formato:
  - Markdown SOLO para negritas (\`**\`) y cursivas (\`*\`) en palabras clave. No uses encabezados (#).
  - Párrafos cortos separados por un salto de línea.
  - Usa emojis relevantes de forma natural.
  - Sin preámbulos.
  `;
}

export const generateLinkedInPost = async (
  textModel: string,
  topic: string,
  textTone: TextTone,
  creativityLevel: CreativityLevel,
  contextualPersonas: ContextualPersona[],
  advancedSettings: AdvancedAISettings
): Promise<TextGenerationResult> => {
  const personaInstruction = getPersonaPromptInstruction(contextualPersonas);
  const conditionalHashtags = getConditionalHashtags(contextualPersonas);
  
  const prompt = `
  ${personaInstruction}
  ${commonTextPromptInstructions(topic, textTone, creativityLevel)}
  Objetivo: Post LinkedIn profesional pero cercano.
  Estructura:
  - Gancho inicial impactante.
  - 2-4 párrafos significativos.
  - Pregunta abierta o llamada a la acción.
  Hashtags (separados por salto de línea al final):
  - ${PRIMARY_HASHTAG}
  - 3-5 relevantes.
  - ${SECONDARY_HASHTAG}
  ${conditionalHashtags.length > 0 ? `- Añade: "${conditionalHashtags.join(' ')}"` : ''}
  `;
  return generateTextWithTokens(textModel, prompt, advancedSettings);
};

export const generateTwitterPost = async (
  textModel: string,
  topic: string,
  textTone: TextTone,
  creativityLevel: CreativityLevel,
  contextualPersonas: ContextualPersona[],
  advancedSettings: AdvancedAISettings
): Promise<TextGenerationResult> => {
  const personaInstruction = getPersonaPromptInstruction(contextualPersonas);
  const conditionalHashtags = getConditionalHashtags(contextualPersonas);

  const prompt = `
  ${personaInstruction}
  ${commonTextPromptInstructions(topic, textTone, creativityLevel)}
  Objetivo: Tweet impactante (< 280 caracteres).
  Estructura:
  - Gancho + Idea clave + Call to action breve.
  Hashtags:
  - ${PRIMARY_HASHTAG}
  - 2-3 relevantes.
  - ${SECONDARY_HASHTAG}
  ${conditionalHashtags.length > 0 ? `- Añade: "${conditionalHashtags.join(' ')}"` : ''}
  `;
  return generateTextWithTokens(textModel, prompt, advancedSettings);
};

export const generateInstagramCaption = async (
  textModel: string,
  topic: string,
  textTone: TextTone,
  creativityLevel: CreativityLevel,
  contextualPersonas: ContextualPersona[],
  advancedSettings: AdvancedAISettings
): Promise<TextGenerationResult> => {
  const personaInstruction = getPersonaPromptInstruction(contextualPersonas);
  const conditionalHashtags = getConditionalHashtags(contextualPersonas);
  
  const prompt = `
  ${personaInstruction}
  ${commonTextPromptInstructions(topic, textTone, creativityLevel)}
  Objetivo: Caption Instagram atractivo.
  Estructura:
  - Frase gancho visual.
  - 2-3 párrafos cortos.
  - Emojis generosos.
  - Call to action.
  Hashtags:
  - ${PRIMARY_HASHTAG}
  - Bloque de 5-10 hashtags.
  - ${SECONDARY_HASHTAG}
  ${conditionalHashtags.length > 0 ? `- Añade: "${conditionalHashtags.join(' ')}"` : ''}
  `;
  return generateTextWithTokens(textModel, prompt, advancedSettings);
};

export const generateFacebookPost = async (
  textModel: string,
  topic: string,
  textTone: TextTone,
  creativityLevel: CreativityLevel,
  contextualPersonas: ContextualPersona[],
  advancedSettings: AdvancedAISettings
): Promise<TextGenerationResult> => {
  const personaInstruction = getPersonaPromptInstruction(contextualPersonas);
  const conditionalHashtags = getConditionalHashtags(contextualPersonas);

  const prompt = `
  ${personaInstruction}
  ${commonTextPromptInstructions(topic, textTone, creativityLevel)}
  Objetivo: Post Facebook informativo y social.
  Estructura:
  - Gancho.
  - 2-4 párrafos explicativos pero cercanos.
  - Pregunta o encuesta implícita.
  Hashtags:
  - ${PRIMARY_HASHTAG}
  - 3-5 relevantes.
  - ${SECONDARY_HASHTAG}
  ${conditionalHashtags.length > 0 ? `- Añade: "${conditionalHashtags.join(' ')}"` : ''}
  `;
  return generateTextWithTokens(textModel, prompt, advancedSettings);
};

export const generateBlogPost = async ( 
  textModel: string,
  topic: string,
  textTone: TextTone,
  creativityLevel: CreativityLevel,
  contextualPersonas: ContextualPersona[],
  advancedSettings: AdvancedAISettings
): Promise<TextGenerationResult> => {
  const personaInstruction = getPersonaPromptInstruction(contextualPersonas);
  
  const prompt = `
  ${personaInstruction}
  ${commonTextPromptInstructions(topic, textTone, creativityLevel)}
  Objetivo: Artículo de Blog (300-500 palabras).
  Estructura:
  - PRIMERA LÍNEA: Título en negrita (**Título**).
  - Intro, Cuerpo (varios párrafos), Conclusión.
  - Tono experto pero legible.
  Sin hashtags al final.
  `;
  return generateTextWithTokens(textModel, prompt, advancedSettings);
};


export const generateImage = async (
  imageModel: string,
  topic: string,
  visualStyle: VisualStyle,
  outputMimeType: ImageFormat,
  customHints?: string,
  platform?: SocialPlatform,
  allowTextInImage?: boolean
): Promise<ImageGenerationResult> => {
  let apiKey: string;
  try {
     apiKey = getApiKey();
  } catch (e) {
      throw handleApiError(e, 'al generar la imagen');
  }

  const ai = new GoogleGenAI({ apiKey });

  let aspectRatio = '1:1';
  let platformHint = '';

  switch (platform) {
      case 'linkedin':
      case 'instagram':
      case 'facebook':
          aspectRatio = '1:1';
          platformHint = 'Fondo limpio, profesional, colores vibrantes.';
          break;
      case 'twitter':
      case 'blog':
          aspectRatio = '16:9';
          platformHint = 'Formato apaisado, alto impacto visual.';
          break;
      default:
          aspectRatio = '1:1';
          break;
  }

  let basePrompt = `Imagen de alta calidad sobre: "${topic}".`;
  let styleInstruction = "";
  let textRule = allowTextInImage === false 
      ? "Regla estricta: NO incluyas texto, letras o números. Imagen 100% visual." 
      : "";

  switch (visualStyle) {
    case VisualStyle.Pictogram:
      styleInstruction = `Estilo pictograma. Iconos y símbolos gráficos limpios. Minimalista.`;
      break;
    case VisualStyle.Infographic:
      styleInstruction = `Infografía profesional y limpia. Diseño moderno, puntos clave visuales.`;
      textRule = ""; // Infographics imply text
      break;
    case VisualStyle.RetroFuturism:
      styleInstruction = "Estilo retrofuturista (años 70-80). Neón, cromo, nostalgia tecnológica.";
      break;
    case VisualStyle.PixelArt:
      styleInstruction = "Pixel art detallado (16-bit).";
      break;
    case VisualStyle.Cinematic:
      styleInstruction = "Cinemático, iluminación dramática, 4k, alta definición.";
      break;
    case VisualStyle.Photorealistic: 
    default:
      styleInstruction = `Fotorrealista, alta calidad, iluminación de estudio, profesional.`;
      break;
  }

  const imagePrompt = [basePrompt, styleInstruction, textRule, customHints, platformHint].filter(Boolean).join(' ');

  try {
    // Dynamic logic based on model family
    const isImagenModel = imageModel.includes('imagen');
    
    if (isImagenModel) {
        // IMAGEN MODEL (e.g., imagen-4.0)
        const response = await ai.models.generateImages({
            model: imageModel,
            prompt: imagePrompt,
            config: { 
                numberOfImages: 1, 
                outputMimeType: outputMimeType,
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages?.[0]?.image?.imageBytes) {
            return { base64Image: response.generatedImages[0].image.imageBytes, mimeType: outputMimeType, tokenCount: null };
        }
    } else {
        // GEMINI MODEL (e.g., gemini-2.5-flash-image, gemini-3-pro-image-preview)
        // Note: responseMimeType is NOT supported for these models in image generation config.
        const response = await ai.models.generateContent({
            model: imageModel,
            contents: { parts: [{ text: imagePrompt }] },
            config: {
                imageConfig: {
                    aspectRatio: aspectRatio,
                    // imageSize is only for pro models, but let's try leaving it to default or setting strictly if needed.
                    // For now, aspectRatio is the main config.
                }
            }
        });

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                     return { 
                        base64Image: part.inlineData.data, 
                        mimeType: part.inlineData.mimeType || outputMimeType, 
                        tokenCount: response.usageMetadata?.totalTokenCount || null 
                    };
                }
            }
        }
    }

    throw new Error("No se generó ninguna imagen válida.");

  } catch (error) {
    if (error instanceof Error && error.message.startsWith("No se generó")) {
      throw error;
    }
    throw handleApiError(error, 'al generar la imagen');
  }
};

export const suggestTopics = async (textModel: string, currentTopic: string): Promise<TextGenerationResult> => { 
  let apiKey: string;
  try {
     apiKey = getApiKey();
  } catch (e) {
      throw handleApiError(e, 'al sugerir temas');
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
  Tema: "${currentTopic}".
  Sugerencias: 3-5 temas relacionados concisos (max 12 palabras).
  Salida: Array JSON de strings.
  Ejemplo: ["Tema 1", "Tema 2"]
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    if (typeof response.text !== 'string') throw new Error('Respuesta inválida.');
    
    return { text: cleanJsonString(response.text), tokenCount: response.usageMetadata?.totalTokenCount ?? null };

  } catch (error) {
    throw handleApiError(error, 'al sugerir temas');
  }
};


export const suggestImageHints = async (
    textModel: string, 
    topic: string, 
    visualStyle: VisualStyle,
    textTone: TextTone,
    creativityLevel: CreativityLevel,
    contextualPersonas: ContextualPersona[]
): Promise<TextGenerationResult> => {
  let apiKey: string;
  try {
     apiKey = getApiKey();
  } catch (e) {
      throw handleApiError(e, 'al sugerir detalles');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
  Tema: "${topic}". Estilo: ${visualStyle}. Tono: ${textTone}.
  Genera una descripción visual DETALLADA (prompt de imagen) de 50-80 palabras EN ESPAÑOL.
  Incluye: iluminación, composición, colores, elementos clave.
  Salida: JSON {"text": "descripción..."}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    if (typeof response.text !== 'string') throw new Error('Respuesta inválida.');
    
    let jsonString = cleanJsonString(response.text);
    let parsedData = JSON.parse(jsonString);

    if (parsedData && typeof parsedData.text === 'string') {
      return { text: parsedData.text, tokenCount: response.usageMetadata?.totalTokenCount ?? null };
    }
    throw new Error("Formato inválido.");
  } catch (error) {
    throw handleApiError(error, 'al sugerir detalles');
  }
};

export const generateHeadline = async (
  textModel: string,
  currentCopy: string,
  textTone: TextTone,
  contextualPersonas: ContextualPersona[]
): Promise<TextGenerationResult> => {
  let apiKey: string;
  try {
     apiKey = getApiKey();
  } catch (e) {
      throw handleApiError(e, 'al generar el titular');
  }

  const ai = new GoogleGenAI({ apiKey });
  const personaInstruction = getPersonaPromptInstruction(contextualPersonas);

  const prompt = `
  Texto: ${currentCopy.substring(0, 500)}...
  ${personaInstruction}
  Tono: ${textTone}.
  Genera un titular (hook) de max 10-12 palabras EN ESPAÑOL. Solo el texto.
  `;
  
  try {
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return { text: response.text?.trim() || "", tokenCount: response.usageMetadata?.totalTokenCount ?? null };
  } catch (error) {
    throw handleApiError(error, 'al generar el titular');
  }
};

export const editText = async (
  textModel: string,
  currentText: string,
  editInstruction: string,
  advancedSettings: AdvancedAISettings
): Promise<TextGenerationResult> => {
  const prompt = `
  Texto Original:
  ---
  ${currentText}
  ---
  Instrucción: ${editInstruction}
  Devuelve el texto completo modificado. Español de España.
  `;
  return generateTextWithTokens(textModel, prompt, advancedSettings);
};

export const editImage = async (
    base64ImageData: string,
    mimeType: string,
    editInstruction: string,
): Promise<ImageGenerationResult> => {
    let apiKey: string;
    try {
        apiKey = getApiKey();
    } catch (e) {
        throw handleApiError(e, 'al editar la imagen');
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // We strictly use gemini-2.5-flash-image or pro for editing as they support multimodal input + instructions
    // Nano Banana = gemini-2.5-flash-image
    const editModel = 'gemini-2.5-flash-image'; 

    try {
        const response = await ai.models.generateContent({
            model: editModel,
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType: mimeType } },
                    { text: `Edita esta imagen: ${editInstruction}.` },
                ],
            },
            // Note: responseModalities might not be strictly needed if defaults apply, but explicit is good.
            // However, typical usage for generateContent implies returning content (text/image).
        });

        const firstCandidate = response.candidates?.[0];
        if (!firstCandidate) throw new Error("Respuesta vacía.");

        const imagePart = firstCandidate.content?.parts?.find(part => part.inlineData);

        if (imagePart && imagePart.inlineData) {
            return {
                base64Image: imagePart.inlineData.data,
                mimeType: imagePart.inlineData.mimeType || 'image/png',
                tokenCount: response.usageMetadata?.totalTokenCount ?? null,
            };
        } else {
             // Handle text fallback (error description from model)
             const textPart = firstCandidate.content?.parts?.find(part => part.text);
             throw new Error(textPart?.text || "No se devolvió una imagen editada.");
        }
    } catch (error) {
        throw handleApiError(error, 'al editar la imagen');
    }
};