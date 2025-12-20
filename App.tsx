import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import InputZone from './components/InputZone';
import ControlPanel from './components/ControlPanel';
import ResultsZone from './components/ResultsZone';
import ProgressBar from './components/ProgressBar';
import { SparklesIcon, HistoryIcon } from './components/icons';
import SecureAccessGate from './components/SecureAccessGate';
import Footer from './components/Footer';
import HistoryPanel from './components/HistoryPanel';
import EditModal from './components/EditModal';
import PrivacyBanner from './components/PrivacyBanner';
import ApiKeyModal from './components/ApiKeyModal';
import { 
  VisualStyle, 
  TextTone, 
  CreativityLevel, 
  FetchedNews, 
  GeneratedContent, 
  ContextualPersona,
  TextGenerationResult,
  SocialPlatform,
  AdvancedAISettings,
  ImageFormat,
  HistoryEntry
} from './types';
import { 
  fetchNewsOfTheDay, 
  generateLinkedInPost, 
  generateImage, 
  suggestTopics,
  generateTwitterPost,
  generateInstagramCaption,
  generateFacebookPost,
  generateBlogPost,
  suggestImageHints,
  generateHeadline,
  editText,
  editImage,
  fetchDynamicModels
} from './services/geminiService';
import { 
  DEFAULT_IMAGE_MODEL,
  IMAGE_MODEL_OPTIONS,
  TEXT_MODEL_OPTIONS,
  VISUAL_STYLE_OPTIONS,
  APP_VERSION,
  IMAGE_FORMAT_OPTIONS
} from './constants';
import { convertToUnicodeStyled } from './utils/unicodeMaps';


const getBestDefaultTextModel = (models: { value: string; label: string }[]): string => {
    return models.length > 0 ? models[0].value : 'gemini-2.5-flash';
};

type ContentToEdit = { type: 'text' | 'image'; content: string; mimeType?: string } | null;


const LOCAL_STORAGE_KEYS = {
  TOPIC_INPUT: 'redactorApp_topicInput',
  VISUAL_STYLE: 'redactorApp_visualStyle',
  TEXT_TONE: 'redactorApp_textTone',
  CREATIVITY_LEVEL: 'redactorApp_creativityLevel',
  CONTEXTUAL_PERSONA: 'redactorApp_contextualPersonas_v2', 
  IMAGE_PROMPT_HINTS: 'redactorApp_imagePromptHints',
  SELECTED_TEXT_MODEL: 'redactorApp_selectedTextModel_v25', 
  SELECTED_IMAGE_MODEL: 'redactorApp_selectedImageModel_v25', 
  IMAGE_FORMAT: 'redactorApp_imageFormat',
  ADVANCED_AI_SETTINGS: 'redactorApp_advancedAISettings',
  ADVANCED_PANEL_COLLAPSED: 'redactorApp_advancedPanelCollapsed',
  ALLOW_TEXT_IN_IMAGE: 'redactorApp_allowTextInImage',
  HISTORY: 'redactorApp_history_v2', 
  API_KEY: 'redactor_api_key',
  GENERATE_HEADLINE_ENABLED: 'redactorApp_generateHeadlineEnabled', // New key
};

const DEFAULT_VALUES = {
  TOPIC_INPUT: '',
  VISUAL_STYLE: VisualStyle.Pictogram,
  TEXT_TONE: TextTone.Professional,
  CREATIVITY_LEVEL: CreativityLevel.Medium,
  CONTEXTUAL_PERSONAS: [ContextualPersona.Neutral],
  IMAGE_PROMPT_HINTS: '',
  SELECTED_IMAGE_MODEL: DEFAULT_IMAGE_MODEL,
  IMAGE_FORMAT: ImageFormat.PNG,
  ADVANCED_AI_SETTINGS: { temperature: 0.7, topP: 0.95, topK: 40 },
  ADVANCED_PANEL_COLLAPSED: true,
  ALLOW_TEXT_IN_IMAGE: false,
  GENERATE_HEADLINE_ENABLED: true,
};

const loadStateFromLocalStorage = <T,>(key: string, defaultValue: T, validOptions?: {value: any}[]): T => {
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;

    if (key === LOCAL_STORAGE_KEYS.API_KEY) {
        return item as unknown as T;
    }

    const parsed = JSON.parse(item);
    
    if (validOptions) {
      if (Array.isArray(parsed)) {
          const validValues = new Set(validOptions.map(opt => opt.value));
          const filtered = parsed.filter(p => validValues.has(p));
          return filtered.length > 0 ? filtered as T : defaultValue;
      }
      return validOptions.some(opt => opt.value === parsed) ? parsed as T : defaultValue;
    }
    
    return parsed as T;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const saveStateToLocalStorage = <T,>(key: string, value: T) => {
  try {
    if (typeof value === 'string') {
        window.localStorage.setItem(key, value);
    } else {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
};


const App: React.FC = () => {
  const [userIp, setUserIp] = useState<string | null>(null);

  const [topicInput, setTopicInput] = useState<string>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.TOPIC_INPUT, DEFAULT_VALUES.TOPIC_INPUT));
  const [fetchedNewsDetails, setFetchedNewsDetails] = useState<FetchedNews | null>(null);
  
  const [visualStyle, setVisualStyle] = useState<VisualStyle>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.VISUAL_STYLE, DEFAULT_VALUES.VISUAL_STYLE, VISUAL_STYLE_OPTIONS as any));
  const [textTone, setTextTone] = useState<TextTone>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.TEXT_TONE, DEFAULT_VALUES.TEXT_TONE));
  const [creativityLevel, setCreativityLevel] = useState<CreativityLevel>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.CREATIVITY_LEVEL, DEFAULT_VALUES.CREATIVITY_LEVEL));
  const [contextualPersonas, setContextualPersonas] = useState<ContextualPersona[]>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.CONTEXTUAL_PERSONA, DEFAULT_VALUES.CONTEXTUAL_PERSONAS));
  const [imagePromptHints, setImagePromptHints] = useState<string>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.IMAGE_PROMPT_HINTS, DEFAULT_VALUES.IMAGE_PROMPT_HINTS)); 
  const [imageFormat, setImageFormat] = useState<ImageFormat>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.IMAGE_FORMAT, DEFAULT_VALUES.IMAGE_FORMAT, IMAGE_FORMAT_OPTIONS as any));
  const [allowTextInImage, setAllowTextInImage] = useState<boolean>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.ALLOW_TEXT_IN_IMAGE, DEFAULT_VALUES.ALLOW_TEXT_IN_IMAGE));
  const [generateHeadlineEnabled, setGenerateHeadlineEnabled] = useState<boolean>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.GENERATE_HEADLINE_ENABLED, DEFAULT_VALUES.GENERATE_HEADLINE_ENABLED));

  const [textModelOptions, setTextModelOptions] = useState<{ value: string; label: string }[]>(TEXT_MODEL_OPTIONS);
  const [imageModelOptions, setImageModelOptions] = useState<{ value: string; label: string }[]>(IMAGE_MODEL_OPTIONS);

  const [selectedTextModel, setSelectedTextModel] = useState<string>('');
  const [selectedImageModel, setSelectedImageModel] = useState<string>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_IMAGE_MODEL, DEFAULT_VALUES.SELECTED_IMAGE_MODEL, IMAGE_MODEL_OPTIONS as any));
  
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedAISettings>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.ADVANCED_AI_SETTINGS, DEFAULT_VALUES.ADVANCED_AI_SETTINGS));
  const [advancedPanelCollapsed, setAdvancedPanelCollapsed] = useState<boolean>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.ADVANCED_PANEL_COLLAPSED, DEFAULT_VALUES.ADVANCED_PANEL_COLLAPSED));
  
  const [apiKey, setApiKey] = useState<string>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.API_KEY, ''));
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(false);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false); 
  const [isLoadingRegenerateImage, setIsLoadingRegenerateImage] = useState<boolean>(false);
  const [isLoadingRegenerateCopy, setIsLoadingRegenerateCopy] = useState<boolean>(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
  const [isLoadingImageHints, setIsLoadingImageHints] = useState<boolean>(false);
  const [isLoadingHeadline, setIsLoadingHeadline] = useState<boolean>(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<{ progress: number, message: string } | null>(null);
  const [suggestedTopicsList, setSuggestedTopicsList] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [timerCurrentTime, setTimerCurrentTime] = useState<number | null>(null);
  const [timerTotalTime, setTimerTotalTime] = useState<number | null>(null);
  const [lastOperationTokenCount, setLastOperationTokenCount] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const processAbortedRef = useRef(false);

  const [history, setHistory] = useState<HistoryEntry[]>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.HISTORY, []));
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState<boolean>(false);
  const [editModalState, setEditModalState] = useState<{ isOpen: boolean; contentToEdit: ContentToEdit }>({ isOpen: false, contentToEdit: null });

  const isAnyLoading = isLoadingNews || isLoadingContent || isLoadingRegenerateImage || isLoadingRegenerateCopy || isLoadingSuggestions || isLoadingImageHints || isLoadingHeadline || isLoadingEdit;

  useEffect(() => {
    const initModels = async () => {
        if (apiKey || process.env.API_KEY) {
            const dynamicModels = await fetchDynamicModels();
            
            if (dynamicModels.textModels.length > 0) {
                const mergedText = [...dynamicModels.textModels];
                TEXT_MODEL_OPTIONS.forEach(def => {
                    if (!mergedText.find(m => m.value === def.value)) {
                        mergedText.push(def);
                    }
                });
                setTextModelOptions(mergedText);
            } else {
                setTextModelOptions(TEXT_MODEL_OPTIONS);
            }

            if (dynamicModels.imageModels.length > 0) {
                const mergedImage = [...dynamicModels.imageModels];
                IMAGE_MODEL_OPTIONS.forEach(def => {
                    if (!mergedImage.find(m => m.value === def.value)) {
                        mergedImage.push(def);
                    }
                });
                setImageModelOptions(mergedImage);
            } else {
                 setImageModelOptions(IMAGE_MODEL_OPTIONS);
            }
        } else {
            setTextModelOptions(TEXT_MODEL_OPTIONS);
            setImageModelOptions(IMAGE_MODEL_OPTIONS);
        }
    };
    initModels();
  }, [apiKey]);


  useEffect(() => {
    const fetchIpForDisplay = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) return;
        const data = await response.json();
        setUserIp(data.ip);
      } catch (error) {
        console.warn("Could not fetch user IP");
      }
    };
    fetchIpForDisplay();
  }, []);

  useEffect(() => {
     const savedTextModel = loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_TEXT_MODEL, '');
     const validModels = textModelOptions.map(m => m.value);

     if (savedTextModel && validModels.includes(savedTextModel)) {
         setSelectedTextModel(savedTextModel);
     } else {
         const bestDefault = getBestDefaultTextModel(textModelOptions);
         setSelectedTextModel(bestDefault);
     }
  }, [textModelOptions]);


  const startTimer = () => {
    const startTime = Date.now();
    setTimerStartTime(startTime);
    setTimerCurrentTime(0);
    setTimerTotalTime(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setTimerCurrentTime(Date.now() - startTime);
    }, 100);
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (timerStartTime) {
      setTimerTotalTime(Date.now() - timerStartTime);
      setTimerStartTime(null);
    }
  };

  const handleError = (err: unknown, defaultMessage: string) => {
    processAbortedRef.current = true;
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : defaultMessage;
    
    if (errorMessage === "CUSTOM_API_KEY_MISSING") {
        setShowApiKeyModal(true);
        setError("Se requiere una API Key de Gemini para continuar. Por favor, ingrésala.");
    } else {
        setError(errorMessage);
    }

    setGenerationProgress(null);
    stopTimer();
    setIsLoadingContent(false);
    setIsLoadingNews(false);
    setIsLoadingRegenerateImage(false);
    setIsLoadingRegenerateCopy(false);
    setIsLoadingSuggestions(false);
    setIsLoadingImageHints(false);
    setIsLoadingHeadline(false);
    setIsLoadingEdit(false);
  };
  
  const handleStateChangeAndSave = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, key: string, value: T) => {
    setter(value);
    saveStateToLocalStorage(key, value);
  };
  
  const handleTopicChange = (newTopic: string) => handleStateChangeAndSave(setTopicInput, LOCAL_STORAGE_KEYS.TOPIC_INPUT, newTopic);
  const handleVisualStyleChange = (style: VisualStyle) => handleStateChangeAndSave(setVisualStyle, LOCAL_STORAGE_KEYS.VISUAL_STYLE, style);
  const handleTextToneChange = (tone: TextTone) => handleStateChangeAndSave(setTextTone, LOCAL_STORAGE_KEYS.TEXT_TONE, tone);
  const handleCreativityLevelChange = (level: CreativityLevel) => handleStateChangeAndSave(setCreativityLevel, LOCAL_STORAGE_KEYS.CREATIVITY_LEVEL, level);
  const handleImageFormatChange = (format: ImageFormat) => handleStateChangeAndSave(setImageFormat, LOCAL_STORAGE_KEYS.IMAGE_FORMAT, format);
  const handleAllowTextInImageToggle = () => handleStateChangeAndSave(setAllowTextInImage, LOCAL_STORAGE_KEYS.ALLOW_TEXT_IN_IMAGE, !allowTextInImage);
  const handleApiKeyChange = (key: string) => handleStateChangeAndSave(setApiKey, LOCAL_STORAGE_KEYS.API_KEY, key);
  const handleGenerateHeadlineEnabledToggle = () => handleStateChangeAndSave(setGenerateHeadlineEnabled, LOCAL_STORAGE_KEYS.GENERATE_HEADLINE_ENABLED, !generateHeadlineEnabled);

  const handleContextualPersonaChange = (persona: ContextualPersona) => {
    let newPersonas: ContextualPersona[];

    if (persona === ContextualPersona.Neutral) {
      newPersonas = [ContextualPersona.Neutral];
    } else {
      const currentPersonas = contextualPersonas.filter(p => p !== ContextualPersona.Neutral);
      if (currentPersonas.includes(persona)) {
        newPersonas = currentPersonas.filter(p => p !== persona);
      } else {
        newPersonas = [...currentPersonas, persona];
      }
      if (newPersonas.length === 0) {
        newPersonas = [ContextualPersona.Neutral];
      }
    }
    handleStateChangeAndSave(setContextualPersonas, LOCAL_STORAGE_KEYS.CONTEXTUAL_PERSONA, newPersonas);
  };
  
  const handleSelectedTextModelChange = (model: string) => handleStateChangeAndSave(setSelectedTextModel, LOCAL_STORAGE_KEYS.SELECTED_TEXT_MODEL, model);
  const handleSelectedImageModelChange = (model: string) => handleStateChangeAndSave(setSelectedImageModel, LOCAL_STORAGE_KEYS.SELECTED_IMAGE_MODEL, model);
  const handleAdvancedSettingsChange = (settings: AdvancedAISettings) => handleStateChangeAndSave(setAdvancedSettings, LOCAL_STORAGE_KEYS.ADVANCED_AI_SETTINGS, settings);
  const handleAdvancedPanelToggle = () => handleStateChangeAndSave(setAdvancedPanelCollapsed, LOCAL_STORAGE_KEYS.ADVANCED_PANEL_COLLAPSED, !advancedPanelCollapsed);

  const handleSaveSettings = () => {
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.TOPIC_INPUT, topicInput);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.VISUAL_STYLE, visualStyle);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.TEXT_TONE, textTone);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.CREATIVITY_LEVEL, creativityLevel);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.CONTEXTUAL_PERSONA, contextualPersonas);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.IMAGE_PROMPT_HINTS, imagePromptHints);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_TEXT_MODEL, selectedTextModel);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_IMAGE_MODEL, selectedImageModel);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.IMAGE_FORMAT, imageFormat);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.ADVANCED_AI_SETTINGS, advancedSettings);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.ADVANCED_PANEL_COLLAPSED, advancedPanelCollapsed);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.ALLOW_TEXT_IN_IMAGE, allowTextInImage);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.API_KEY, apiKey);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.GENERATE_HEADLINE_ENABLED, generateHeadlineEnabled);
    
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 2500);
  };

  const addToHistory = useCallback((content: { topic: string; copy: string; imageUrl?: string; mimeType?: string; }) => {
    const newEntry: HistoryEntry = {
      id: new Date().toISOString() + Math.random(),
      timestamp: Date.now(),
      topic: content.topic,
      copy: content.copy,
      imageUrl: content.imageUrl ? `data:${content.mimeType};base64,${content.imageUrl}` : undefined,
      mimeType: content.mimeType,
    };

    setHistory(prevHistory => {
      const updatedHistory = [newEntry, ...prevHistory].slice(0, 10);
      saveStateToLocalStorage(LOCAL_STORAGE_KEYS.HISTORY, updatedHistory);
      return updatedHistory;
    });
  }, []);

  const recoverFromHistory = useCallback((id: string) => {
    const entry = history.find(item => item.id === id);
    if (entry) {
      handleTopicChange(entry.topic);
      const base64Image = entry.imageUrl ? entry.imageUrl.split(',')[1] : '';
      setGeneratedContent({
        linkedInCopy: entry.copy,
        imageUrl: base64Image,
        mimeType: entry.mimeType || ImageFormat.PNG
      });
      setError(null);
      setIsHistoryPanelOpen(false);
    }
  }, [history]);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory(prevHistory => {
      const updatedHistory = prevHistory.filter(item => item.id !== id);
      saveStateToLocalStorage(LOCAL_STORAGE_KEYS.HISTORY, updatedHistory);
      return updatedHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.HISTORY, []);
  }, []);

  const handleFetchNews = useCallback(async () => {
    setError(null);
    setSuggestedTopicsList(null);
    setIsLoadingNews(true);
    startTimer();
    try {
      const result = await fetchNewsOfTheDay(selectedTextModel, contextualPersonas, topicInput);
      if (result.news.title.toLowerCase().includes("no se encontró")) {
          setError("No se encontró una noticia relevante.");
          setFetchedNewsDetails(null);
      } else {
          setFetchedNewsDetails(result.news);
          handleTopicChange(result.news.title + " - " + result.news.summary);
      }
      setLastOperationTokenCount(result.tokenCount);
    } catch (err) {
      handleError(err, 'Error al buscar noticias.');
    } finally {
      stopTimer();
      setIsLoadingNews(false);
    }
  }, [selectedTextModel, contextualPersonas, topicInput]);

  const handleSuggestTopics = useCallback(async () => {
    if (!topicInput.trim()) return;
    setError(null);
    setSuggestedTopicsList(null);
    setIsLoadingSuggestions(true);
    startTimer();
    try {
      const result = await suggestTopics(selectedTextModel, topicInput);
      setSuggestedTopicsList(JSON.parse(result.text));
      setLastOperationTokenCount(result.tokenCount);
    } catch (err) {
      handleError(err, 'Error al sugerir temas.');
    } finally {
      stopTimer();
      setIsLoadingSuggestions(false);
    }
  }, [topicInput, selectedTextModel]);
  
  const handleSuggestImageHints = useCallback(async () => {
    if (!topicInput.trim()) {
      setError("Introduce un tema para obtener sugerencias.");
      return;
    }
    setError(null);
    setIsLoadingImageHints(true);
    startTimer();
    try {
        const result = await suggestImageHints(selectedTextModel, topicInput, visualStyle, textTone, creativityLevel, contextualPersonas);
        handleStateChangeAndSave(setImagePromptHints, LOCAL_STORAGE_KEYS.IMAGE_PROMPT_HINTS, result.text);
        setLastOperationTokenCount(result.tokenCount);
    } catch (err) {
        handleError(err, 'Error al sugerir detalles.');
    } finally {
        stopTimer();
        setIsLoadingImageHints(false);
    }
  }, [topicInput, selectedTextModel, visualStyle, textTone, creativityLevel, contextualPersonas]);

  const handleSelectSuggestedTopic = (suggestion: string) => {
    handleTopicChange(suggestion);
    setSuggestedTopicsList(null);
  };
  
  const handleCopyChange = (newCopy: string) => {
    setGeneratedContent(prev => prev ? { ...prev, linkedInCopy: newCopy } : null);
  };
  
  const generateAndSetContent = async (
    copyGenerator: (textModel: string, topic: string, textTone: TextTone, creativityLevel: CreativityLevel, contextualPersonas: ContextualPersona[], advancedSettings: AdvancedAISettings) => Promise<TextGenerationResult>,
    platform?: SocialPlatform
  ) => {
      processAbortedRef.current = false;
      
      setGenerationProgress({ progress: 10, message: 'Generando texto...' });
      const copyResult = await copyGenerator(selectedTextModel, topicInput, textTone, creativityLevel, contextualPersonas, advancedSettings);
      if (processAbortedRef.current) return;
      
      let finalCopy = copyResult.text;
      let totalTokens = copyResult.tokenCount;

      // Conditional headline generation
      if (generateHeadlineEnabled) {
          setGenerationProgress({ progress: 30, message: 'Añadiendo titular...' });
          try {
            const headlineResult = await generateHeadline(selectedTextModel, finalCopy, textTone, contextualPersonas);
            const boldHeadline = convertToUnicodeStyled(headlineResult.text, 'bold');
            finalCopy = `${boldHeadline}\n\n${finalCopy}`;
            if (headlineResult.tokenCount !== null) {
              totalTokens = (totalTokens || 0) + headlineResult.tokenCount;
            }
          } catch (hErr) {
            console.warn("Failed to generate headline during main flow:", hErr);
          }
      }

      const tempContent = { 
        ...(generatedContent || { imageUrl: '', mimeType: imageFormat, linkedInCopy: '' }), 
        linkedInCopy: finalCopy 
      };
      setGeneratedContent(tempContent);
      setLastOperationTokenCount(totalTokens);
      
      setGenerationProgress({ progress: 60, message: 'Generando imagen...' });
      const imageResult = await generateImage(selectedImageModel, topicInput, visualStyle, imageFormat, imagePromptHints, platform, allowTextInImage);
      if (processAbortedRef.current) return;
      
      const finalContent = { 
        ...tempContent,
        imageUrl: imageResult.base64Image,
        mimeType: imageResult.mimeType,
      };
      setGeneratedContent(finalContent);
      
      addToHistory({
        topic: topicInput,
        copy: finalContent.linkedInCopy,
        imageUrl: finalContent.imageUrl,
        mimeType: finalContent.mimeType
      });
      
      setGenerationProgress({ progress: 100, message: '¡Completado!' });
  };
  
  const regenerateOnlyCopy = async (
    copyGenerator: (textModel: string, topic: string, textTone: TextTone, creativityLevel: CreativityLevel, contextualPersonas: ContextualPersona[], advancedSettings: AdvancedAISettings) => Promise<TextGenerationResult>
  ) => {
      setError(null);
      setIsLoadingRegenerateCopy(true);
      startTimer();
      try {
          const result = await copyGenerator(selectedTextModel, topicInput, textTone, creativityLevel, contextualPersonas, advancedSettings);
          let finalCopy = result.text;
          let tokens = result.tokenCount;

          if (generateHeadlineEnabled) {
              const headlineResult = await generateHeadline(selectedTextModel, finalCopy, textTone, contextualPersonas);
              const boldHeadline = convertToUnicodeStyled(headlineResult.text, 'bold');
              finalCopy = `${boldHeadline}\n\n${finalCopy}`;
              if (headlineResult.tokenCount !== null) tokens = (tokens || 0) + headlineResult.tokenCount;
          }

          setGeneratedContent(prev => prev ? { ...prev, linkedInCopy: finalCopy } : null);
          setLastOperationTokenCount(tokens);
      } catch (err) {
          handleError(err, 'Error al regenerar el texto.');
      } finally {
          stopTimer();
          setIsLoadingRegenerateCopy(false);
      }
  };

  const regenerateOnlyImage = async (platform?: SocialPlatform) => {
    setError(null);
    setIsLoadingRegenerateImage(true);
    startTimer();
    try {
        const imageResult = await generateImage(selectedImageModel, topicInput, visualStyle, imageFormat, imagePromptHints, platform, allowTextInImage);
        setGeneratedContent(prev => prev ? { ...prev, imageUrl: imageResult.base64Image, mimeType: imageResult.mimeType } : {
          imageUrl: imageResult.base64Image,
          mimeType: imageResult.mimeType,
          linkedInCopy: ''
        });
    } catch (err) {
        handleError(err, 'Error al regenerar la imagen.');
    } finally {
        stopTimer();
        setIsLoadingRegenerateImage(false);
    }
  };

  const handleGenerateHeadline = useCallback(async () => {
    if (!generatedContent?.linkedInCopy) {
      setError('No hay texto para generar un titular.');
      return;
    }
    setError(null);
    setIsLoadingHeadline(true);
    startTimer();
    try {
      const result = await generateHeadline(
        selectedTextModel,
        generatedContent.linkedInCopy,
        textTone,
        contextualPersonas
      );
      
      const boldHeadline = convertToUnicodeStyled(result.text, 'bold');
      const newCopy = `${boldHeadline}\n\n${generatedContent.linkedInCopy}`;

      setGeneratedContent(prev => prev ? { ...prev, linkedInCopy: newCopy } : null);
      setLastOperationTokenCount(result.tokenCount);
    } catch (err) {
      handleError(err, 'Error al generar el titular.');
    } finally {
      stopTimer();
      setIsLoadingHeadline(false);
    }
  }, [generatedContent, selectedTextModel, textTone, contextualPersonas]);


  const handleGenerateContent = useCallback(async () => {
    if (!topicInput.trim()) {
      setError('Por favor, introduce un tema.');
      return;
    }
    setError(null);
    setSuggestedTopicsList(null);
    setGeneratedContent(null);
    setIsLoadingContent(true);
    startTimer();
    try {
      await generateAndSetContent(generateLinkedInPost);
    } catch (err) {
      handleError(err, 'Ocurrió un error al generar el contenido.');
    } finally {
      stopTimer();
      setIsLoadingContent(false);
      setTimeout(() => setGenerationProgress(null), 2000);
    }
  }, [topicInput, selectedTextModel, selectedImageModel, textTone, creativityLevel, visualStyle, contextualPersonas, imagePromptHints, imageFormat, advancedSettings, allowTextInImage, generateHeadlineEnabled, addToHistory]);

  const handleClearAll = () => {
    setTopicInput(DEFAULT_VALUES.TOPIC_INPUT);
    setFetchedNewsDetails(null);
    setVisualStyle(DEFAULT_VALUES.VISUAL_STYLE);
    setTextTone(DEFAULT_VALUES.TEXT_TONE);
    setCreativityLevel(DEFAULT_VALUES.CREATIVITY_LEVEL);
    setContextualPersonas(DEFAULT_VALUES.CONTEXTUAL_PERSONAS);
    setImagePromptHints(DEFAULT_VALUES.IMAGE_PROMPT_HINTS);
    setSelectedImageModel(DEFAULT_VALUES.SELECTED_IMAGE_MODEL);
    setImageFormat(DEFAULT_VALUES.IMAGE_FORMAT);
    setAdvancedSettings(DEFAULT_VALUES.ADVANCED_AI_SETTINGS);
    setAdvancedPanelCollapsed(DEFAULT_VALUES.ADVANCED_PANEL_COLLAPSED);
    setAllowTextInImage(DEFAULT_VALUES.ALLOW_TEXT_IN_IMAGE);
    setGenerateHeadlineEnabled(DEFAULT_VALUES.GENERATE_HEADLINE_ENABLED);

    setGeneratedContent(null);
    setSuggestedTopicsList(null);
    setError(null);
    setGenerationProgress(null);
    setTimerTotalTime(null);
    setLastOperationTokenCount(null);
    setHistory([]);

    const keysToKeep = [LOCAL_STORAGE_KEYS.API_KEY];

    Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
      if (!keysToKeep.includes(key)) {
        try {
          window.localStorage.removeItem(key);
        } catch (e) {
          console.warn(`Could not remove ${key}`, e);
        }
      }
    });

    const bestDefaultTextModel = getBestDefaultTextModel(textModelOptions);
    setSelectedTextModel(bestDefaultTextModel);
    saveStateToLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_TEXT_MODEL, bestDefaultTextModel);
  };

  const handleOpenEditModal = (type: 'text' | 'image') => {
    if (!generatedContent) return;
    if (type === 'text') {
        setEditModalState({
            isOpen: true,
            contentToEdit: {
                type: 'text',
                content: generatedContent.linkedInCopy
            }
        });
    } else if (type === 'image' && generatedContent.imageUrl) {
        setEditModalState({
            isOpen: true,
            contentToEdit: {
                type: 'image',
                content: `data:${generatedContent.mimeType};base64,${generatedContent.imageUrl}`,
                mimeType: generatedContent.mimeType
            }
        });
    }
  };

  const handleCloseEditModal = () => {
    setEditModalState({ isOpen: false, contentToEdit: null });
  };
  
  const handleEditSubmit = async (prompt: string) => {
    if (!editModalState.contentToEdit || !generatedContent) return;
    setError(null);
    setIsLoadingEdit(true);
    startTimer();
    try {
        if (editModalState.contentToEdit.type === 'text') {
            const result = await editText(selectedTextModel, generatedContent.linkedInCopy, prompt, advancedSettings);
            setGeneratedContent(prev => prev ? { ...prev, linkedInCopy: result.text } : null);
            setLastOperationTokenCount(result.tokenCount);
        } else if (editModalState.contentToEdit.type === 'image') {
            const result = await editImage(generatedContent.imageUrl, generatedContent.mimeType, prompt);
            setGeneratedContent(prev => prev ? { ...prev, imageUrl: result.base64Image, mimeType: result.mimeType } : null);
            setLastOperationTokenCount(result.tokenCount);
        }
        handleCloseEditModal();
    } catch (err) {
        handleError(err, 'Error al aplicar la mejora.');
    } finally {
        stopTimer();
        setIsLoadingEdit(false);
    }
  };
  
  return (
    <SecureAccessGate>
      <div className="bg-white min-h-screen">
        <Header />
        <main className="container mx-auto px-4 pb-8">
          <div className="space-y-6">
            <InputZone
              topic={topicInput}
              onTopicChange={handleTopicChange}
              onFetchNews={handleFetchNews}
              isLoadingNews={isLoadingNews}
              newsSourceUrl={fetchedNewsDetails?.url}
              newsSourceTitle={fetchedNewsDetails?.title}
              newsPublicationDate={fetchedNewsDetails?.publicationDate}
              onSuggestTopics={handleSuggestTopics}
              isLoadingSuggestions={isLoadingSuggestions}
              suggestedTopicsList={suggestedTopicsList}
              onSelectSuggestedTopic={handleSelectSuggestedTopic}
              onClearAll={handleClearAll}
              isAnyLoading={isAnyLoading}
            />
            <ControlPanel
              visualStyle={visualStyle}
              onVisualStyleChange={handleVisualStyleChange}
              textTone={textTone}
              onTextToneChange={handleTextToneChange}
              creativityLevel={creativityLevel}
              onCreativityLevelChange={handleCreativityLevelChange}
              contextualPersonas={contextualPersonas}
              onContextualPersonaChange={handleContextualPersonaChange}
              isGeneratingAnything={isAnyLoading}
              textModelOptions={textModelOptions}
              selectedTextModel={selectedTextModel}
              onSelectedTextModelChange={handleSelectedTextModelChange}
              selectedImageModel={selectedImageModel}
              onSelectedImageModelChange={handleSelectedImageModelChange}
              imageModelOptions={imageModelOptions}
              imageFormat={imageFormat}
              onImageFormatChange={handleImageFormatChange}
              advancedSettings={advancedSettings}
              onAdvancedSettingsChange={handleAdvancedSettingsChange}
              advancedPanelCollapsed={advancedPanelCollapsed}
              onAdvancedPanelToggle={handleAdvancedPanelToggle}
              imagePromptHints={imagePromptHints}
              onImagePromptHintsChange={(newHints) => handleStateChangeAndSave(setImagePromptHints, LOCAL_STORAGE_KEYS.IMAGE_PROMPT_HINTS, newHints)}
              onSuggestImageHints={handleSuggestImageHints}
              isLoadingImageHints={isLoadingImageHints}
              allowTextInImage={allowTextInImage}
              onAllowTextInImageToggle={handleAllowTextInImageToggle}
              onSaveSettings={handleSaveSettings}
              apiKey={apiKey}
              onApiKeyChange={handleApiKeyChange}
            />
          </div>

          <div className="mt-8 text-center flex items-center justify-center gap-4">
            <button
              onClick={handleGenerateContent}
              disabled={isAnyLoading || !topicInput.trim()}
              className="px-8 py-4 bg-red-700 hover:bg-red-800 text-white font-bold text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              <span className="flex items-center">
                <SparklesIcon className="mr-3 h-6 w-6" />
                {isLoadingContent ? 'Generando Contenido...' : 'Generar Contenido'}
              </span>
            </button>
             <button
              onClick={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)}
              disabled={isAnyLoading}
              className="px-4 py-4 bg-neutral-600 hover:bg-neutral-700 text-white font-bold text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              aria-label="Toggle History Panel"
            >
              <HistoryIcon className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          <HistoryPanel
            isOpen={isHistoryPanelOpen}
            history={history}
            onRecover={recoverFromHistory}
            onDelete={deleteFromHistory}
            onClearAll={clearHistory}
          />

          {generationProgress && (
            <div className="mt-6">
              <ProgressBar progress={generationProgress.progress} message={generationProgress.message} />
            </div>
          )}
          
          <ResultsZone 
            generatedContent={generatedContent}
            onCopyChange={handleCopyChange}
            isLoadingContent={isLoadingContent}
            isLoadingImageRegen={isLoadingRegenerateImage}
            isLoadingCopyRegen={isLoadingRegenerateCopy}
            onRegenerateImage={() => regenerateOnlyImage()}
            onRegenerateImageForPlatform={(platform) => regenerateOnlyImage(platform)}
            onRegenerateLinkedInCopy={() => regenerateOnlyCopy(generateLinkedInPost)}
            onRegenerateTwitterCopy={() => regenerateOnlyCopy(generateTwitterPost)}
            onRegenerateInstagramCopy={() => regenerateOnlyCopy(generateInstagramCaption)}
            onRegenerateFacebookCopy={() => regenerateOnlyCopy(generateFacebookPost)}
            onRegenerateBlogCopy={() => regenerateOnlyCopy(generateBlogPost)}
            topicForAltText={topicInput}
            canRegenerate={!!topicInput.trim() && !isAnyLoading}
            selectedTextModel={selectedTextModel}
            selectedImageModel={selectedImageModel}
            onGenerateHeadline={handleGenerateHeadline}
            isLoadingHeadline={isLoadingHeadline}
            onEditText={() => handleOpenEditModal('text')}
            onEditImage={() => handleOpenEditModal('image')}
            generateHeadlineEnabled={generateHeadlineEnabled}
            onGenerateHeadlineToggle={handleGenerateHeadlineEnabledToggle}
          />

        </main>
        <Footer
          appVersion={APP_VERSION}
          userIp={userIp}
          currentEngine={selectedTextModel}
          tokenCount={lastOperationTokenCount}
        />
        <PrivacyBanner />
        <ApiKeyModal
            isOpen={showApiKeyModal}
            onClose={() => setShowApiKeyModal(false)}
            onSave={(key) => {
                handleApiKeyChange(key);
                setShowApiKeyModal(false);
                setError(null); 
            }}
        />
      </div>
       <EditModal
        isOpen={editModalState.isOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        isLoading={isLoadingEdit}
        contentToEdit={editModalState.contentToEdit}
      />
      {showSaveConfirmation && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl transition-all duration-300 ease-in-out animate-fade-in-out" role="status">
          ¡Preferencias guardadas!
        </div>
      )}
      <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 2.5s ease-in-out forwards;
        }
      `}</style>
    </SecureAccessGate>
  );
};

export default App;