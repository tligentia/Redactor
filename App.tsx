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
import { Cookies } from './components/Cookies';
import Ajustes from './components/Ajustes';
import { Manual } from './components/Manual';
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
  IMAGE_FORMAT_OPTIONS,
  getShortcutKey,
  APP_VERSION
} from './constants';
import { convertToUnicodeStyled } from './utils/unicodeMaps';

const getBestDefaultTextModel = (models: { value: string; label: string }[]): string => {
    return models.length > 0 ? models[0].value : 'gemini-3-flash-preview';
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
  GENERATE_HEADLINE_ENABLED: 'redactorApp_generateHeadlineEnabled',
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
    if (key === LOCAL_STORAGE_KEYS.API_KEY) return item as unknown as T;
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
    return defaultValue;
  }
};

const saveStateToLocalStorage = <T,>(key: string, value: T) => {
  try {
    if (typeof value === 'string') window.localStorage.setItem(key, value);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {}
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
  const [lastOperationTokenCount, setLastOperationTokenCount] = useState<number | null>(null);

  const [history, setHistory] = useState<HistoryEntry[]>(() => loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.HISTORY, []));
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState<boolean>(false);
  const [editModalState, setEditModalState] = useState<{ isOpen: boolean; contentToEdit: ContentToEdit }>({ isOpen: false, contentToEdit: null });

  const [showAjustes, setShowAjustes] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const isAnyLoading = isLoadingNews || isLoadingContent || isLoadingRegenerateImage || isLoadingRegenerateCopy || isLoadingSuggestions || isLoadingImageHints || isLoadingHeadline || isLoadingEdit;

  useEffect(() => {
    const initModels = async () => {
        if (apiKey || process.env.API_KEY) {
            const dynamicModels = await fetchDynamicModels();
            if (dynamicModels.textModels.length > 0) setTextModelOptions(dynamicModels.textModels);
            if (dynamicModels.imageModels.length > 0) setImageModelOptions(dynamicModels.imageModels);
        }
    };
    initModels();
  }, [apiKey]);

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
          const data = await response.json();
          setUserIp(data.ip);
        }
      } catch (e) {}
    };
    fetchIp();
  }, []);

  useEffect(() => {
     const savedTextModel = loadStateFromLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_TEXT_MODEL, '');
     const validModels = textModelOptions.map(m => m.value);
     if (savedTextModel && validModels.includes(savedTextModel)) setSelectedTextModel(savedTextModel);
     else setSelectedTextModel(getBestDefaultTextModel(textModelOptions));
  }, [textModelOptions]);

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
  const handleGenerateHeadlineEnabledToggle = () => handleStateChangeAndSave(setGenerateHeadlineEnabled, LOCAL_STORAGE_KEYS.GENERATE_HEADLINE_ENABLED, !generateHeadlineEnabled);

  const handleApiKeySave = (newKey: string) => {
    const shortcut = getShortcutKey(newKey);
    const finalKey = shortcut || newKey;
    handleStateChangeAndSave(setApiKey, LOCAL_STORAGE_KEYS.API_KEY, finalKey);
    setShowAjustes(false);
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

  const handleFetchNews = async () => {
    setIsLoadingNews(true);
    setError(null);
    try {
      const result = await fetchNewsOfTheDay(selectedTextModel, contextualPersonas, topicInput);
      setFetchedNewsDetails(result.news);
      handleTopicChange(result.news.title + " - " + result.news.summary);
      setLastOperationTokenCount(result.tokenCount);
    } catch (err: any) { setError(err.message); } finally { setIsLoadingNews(false); }
  };

  const handleSuggestTopics = async () => {
    if (!topicInput.trim()) return;
    setIsLoadingSuggestions(true);
    setError(null);
    try {
      const result = await suggestTopics(selectedTextModel, topicInput);
      setSuggestedTopicsList(JSON.parse(result.text));
      setLastOperationTokenCount(result.tokenCount);
    } catch (err: any) { setError(err.message); } finally { setIsLoadingSuggestions(false); }
  };

  const handleSuggestImageHints = async () => {
    if (!topicInput.trim()) return;
    setIsLoadingImageHints(true);
    setError(null);
    try {
        const result = await suggestImageHints(selectedTextModel, topicInput, visualStyle, textTone, creativityLevel, contextualPersonas);
        handleStateChangeAndSave(setImagePromptHints, LOCAL_STORAGE_KEYS.IMAGE_PROMPT_HINTS, result.text);
        setLastOperationTokenCount(result.tokenCount);
    } catch (err: any) { setError(err.message); } finally { setIsLoadingImageHints(false); }
  };

  const handleGenerateContent = async () => {
    if (!topicInput.trim()) return;
    setIsLoadingContent(true);
    setError(null);
    setGenerationProgress({ progress: 10, message: 'Generando texto...' });
    try {
      const copyResult = await generateLinkedInPost(selectedTextModel, topicInput, textTone, creativityLevel, contextualPersonas, advancedSettings);
      let finalCopy = copyResult.text;
      let totalTokens = copyResult.tokenCount || 0;

      if (generateHeadlineEnabled) {
          setGenerationProgress({ progress: 30, message: 'Añadiendo titular...' });
          const headlineResult = await generateHeadline(selectedTextModel, finalCopy, textTone, contextualPersonas);
          finalCopy = `${convertToUnicodeStyled(headlineResult.text, 'bold')}\n\n${finalCopy}`;
          totalTokens += headlineResult.tokenCount || 0;
      }
      
      setGenerationProgress({ progress: 60, message: 'Generando imagen...' });
      const imageResult = await generateImage(selectedImageModel, topicInput, visualStyle, imageFormat, imagePromptHints, undefined, allowTextInImage);
      const finalContent = { linkedInCopy: finalCopy, imageUrl: imageResult.base64Image, mimeType: imageResult.mimeType };
      setGeneratedContent(finalContent);
      setLastOperationTokenCount(totalTokens);
      addToHistory({ topic: topicInput, copy: finalCopy, imageUrl: imageResult.base64Image, mimeType: imageResult.mimeType });
      setGenerationProgress({ progress: 100, message: '¡Completado!' });
    } catch (err: any) { setError(err.message); } finally { 
      setIsLoadingContent(false);
      setTimeout(() => setGenerationProgress(null), 2000);
    }
  };

  const handleRegenerateOnlyImage = async (platform?: SocialPlatform) => {
    setIsLoadingRegenerateImage(true);
    setError(null);
    try {
      const result = await generateImage(selectedImageModel, topicInput, visualStyle, imageFormat, imagePromptHints, platform, allowTextInImage);
      setGeneratedContent(prev => prev ? { ...prev, imageUrl: result.base64Image, mimeType: result.mimeType } : null);
    } catch (err: any) { setError(err.message); } finally { setIsLoadingRegenerateImage(false); }
  };

  const handleRegenerateOnlyCopy = async (generator: any) => {
    setIsLoadingRegenerateCopy(true);
    setError(null);
    try {
      const result = await generator(selectedTextModel, topicInput, textTone, creativityLevel, contextualPersonas, advancedSettings);
      let finalCopy = result.text;
      if (generateHeadlineEnabled) {
          const hr = await generateHeadline(selectedTextModel, finalCopy, textTone, contextualPersonas);
          finalCopy = `${convertToUnicodeStyled(hr.text, 'bold')}\n\n${finalCopy}`;
      }
      setGeneratedContent(prev => prev ? { ...prev, linkedInCopy: finalCopy } : null);
    } catch (err: any) { setError(err.message); } finally { setIsLoadingRegenerateCopy(false); }
  };

  const handleGenerateHeadlineManual = async () => {
    if (!generatedContent?.linkedInCopy) return;
    setIsLoadingHeadline(true);
    try {
      const result = await generateHeadline(selectedTextModel, generatedContent.linkedInCopy, textTone, contextualPersonas);
      const newCopy = `${convertToUnicodeStyled(result.text, 'bold')}\n\n${generatedContent.linkedInCopy}`;
      setGeneratedContent(prev => prev ? { ...prev, linkedInCopy: newCopy } : null);
    } catch (err: any) { setError(err.message); } finally { setIsLoadingHeadline(false); }
  };

  const handleClearAll = () => {
    if (confirm("¿Estás seguro de que deseas limpiar todos los campos y el historial actual?")) {
        setTopicInput('');
        setGeneratedContent(null);
        setFetchedNewsDetails(null);
        setHistory([]);
        setSuggestedTopicsList(null);
        setError(null);
    }
  };

  const handleOpenEditModal = (type: 'text' | 'image') => {
    if (!generatedContent) return;
    setEditModalState({
        isOpen: true,
        contentToEdit: type === 'text' ? { type: 'text', content: generatedContent.linkedInCopy } : { type: 'image', content: `data:${generatedContent.mimeType};base64,${generatedContent.imageUrl}`, mimeType: generatedContent.mimeType }
    });
  };

  const handleEditSubmit = async (instr: string) => {
    if (!editModalState.contentToEdit) return;
    setIsLoadingEdit(true);
    try {
        if (editModalState.contentToEdit.type === 'text') {
            const res = await editText(selectedTextModel, generatedContent!.linkedInCopy, instr, advancedSettings);
            setGeneratedContent(p => p ? {...p, linkedInCopy: res.text} : null);
        } else {
            const res = await editImage(generatedContent!.imageUrl, generatedContent!.mimeType, instr);
            setGeneratedContent(p => p ? {...p, imageUrl: res.base64Image, mimeType: res.mimeType} : null);
        }
        setEditModalState({ isOpen: false, contentToEdit: null });
    } catch (err: any) { setError(err.message); } finally { setIsLoadingEdit(false); }
  };

  return (
    <SecureAccessGate>
      <div className="bg-white min-h-screen flex flex-col">
        <Header onShowManual={() => setShowManual(true)} />
        
        <main className="flex-1 container mx-auto px-4 pb-8 max-w-7xl">
          <div className="space-y-6">
            <InputZone
              topic={topicInput}
              onTopicChange={handleTopicChange}
              onFetchNews={handleFetchNews}
              isLoadingNews={isLoadingNews}
              newsSourceUrl={fetchedNewsDetails?.url}
              newsSourceTitle={fetchedNewsDetails?.title}
              onSuggestTopics={handleSuggestTopics}
              isLoadingSuggestions={isLoadingSuggestions}
              suggestedTopicsList={suggestedTopicsList}
              onSelectSuggestedTopic={(s) => handleTopicChange(s)}
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
              onContextualPersonaChange={(p) => {
                if (p === ContextualPersona.Neutral) setContextualPersonas([ContextualPersona.Neutral]);
                else setContextualPersonas(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev.filter(x => x !== ContextualPersona.Neutral), p]);
              }}
              isGeneratingAnything={isAnyLoading}
              textModelOptions={textModelOptions}
              selectedTextModel={selectedTextModel}
              onSelectedTextModelChange={(m) => handleStateChangeAndSave(setSelectedTextModel, LOCAL_STORAGE_KEYS.SELECTED_TEXT_MODEL, m)}
              selectedImageModel={selectedImageModel}
              onSelectedImageModelChange={(m) => handleStateChangeAndSave(setSelectedImageModel, LOCAL_STORAGE_KEYS.SELECTED_IMAGE_MODEL, m)}
              imageModelOptions={imageModelOptions}
              imageFormat={imageFormat}
              onImageFormatChange={handleImageFormatChange}
              advancedSettings={advancedSettings}
              onAdvancedSettingsChange={setAdvancedSettings}
              advancedPanelCollapsed={advancedPanelCollapsed}
              onAdvancedPanelToggle={() => setAdvancedPanelCollapsed(!advancedPanelCollapsed)}
              imagePromptHints={imagePromptHints}
              onImagePromptHintsChange={(h) => handleStateChangeAndSave(setImagePromptHints, LOCAL_STORAGE_KEYS.IMAGE_PROMPT_HINTS, h)}
              onSuggestImageHints={handleSuggestImageHints}
              isLoadingImageHints={isLoadingImageHints}
              allowTextInImage={allowTextInImage}
              onAllowTextInImageToggle={handleAllowTextInImageToggle}
              onSaveSettings={() => setShowSaveConfirmation(true)}
              apiKey={apiKey}
              onApiKeyChange={handleApiKeySave}
            />
          </div>

          <div className="mt-8 text-center flex items-center justify-center gap-4">
            <button
              onClick={handleGenerateContent}
              disabled={isAnyLoading || !topicInput.trim()}
              className="px-8 py-4 bg-red-700 hover:bg-red-800 text-white font-bold text-lg rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              <span className="flex items-center">
                <SparklesIcon className="mr-3 h-6 w-6" />
                {isLoadingContent ? 'Procesando...' : 'Generar Contenido'}
              </span>
            </button>
            <button
              onClick={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)}
              className="px-4 py-4 bg-neutral-600 hover:bg-neutral-700 text-white rounded-full shadow-lg transform hover:scale-105"
            >
              <HistoryIcon className="h-6 w-6" />
            </button>
          </div>

          {error && <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg font-medium">{error}</div>}
          {generationProgress && <div className="mt-6"><ProgressBar progress={generationProgress.progress} message={generationProgress.message} /></div>}
          
          <ResultsZone 
            generatedContent={generatedContent}
            onCopyChange={(c) => setGeneratedContent(prev => prev ? {...prev, linkedInCopy: c} : null)}
            isLoadingContent={isLoadingContent}
            isLoadingImageRegen={isLoadingRegenerateImage}
            isLoadingCopyRegen={isLoadingRegenerateCopy}
            onRegenerateImage={() => handleRegenerateOnlyImage()}
            onRegenerateImageForPlatform={(p) => handleRegenerateOnlyImage(p)}
            onRegenerateLinkedInCopy={() => handleRegenerateOnlyCopy(generateLinkedInPost)}
            onRegenerateTwitterCopy={() => handleRegenerateOnlyCopy(generateTwitterPost)}
            onRegenerateInstagramCopy={() => handleRegenerateOnlyCopy(generateInstagramCaption)}
            onRegenerateFacebookCopy={() => handleRegenerateOnlyCopy(generateFacebookPost)}
            onRegenerateBlogCopy={() => handleRegenerateOnlyCopy(generateBlogPost)}
            canRegenerate={!isAnyLoading}
            selectedTextModel={selectedTextModel}
            selectedImageModel={selectedImageModel}
            onGenerateHeadline={handleGenerateHeadlineManual}
            isLoadingHeadline={isLoadingHeadline}
            onEditText={() => handleOpenEditModal('text')}
            onEditImage={() => handleOpenEditModal('image')}
            generateHeadlineEnabled={generateHeadlineEnabled}
            onGenerateHeadlineToggle={handleGenerateHeadlineEnabledToggle}
          />
        </main>

        <Footer 
          userIp={userIp} 
          onShowCookies={() => setShowCookies(true)} 
          onShowAjustes={() => setShowAjustes(true)} 
        />

        <Cookies isOpen={showCookies} onClose={() => setShowCookies(false)} />
        <Ajustes 
          isOpen={showAjustes} 
          onClose={() => setShowAjustes(false)} 
          apiKey={apiKey}
          onApiKeySave={handleApiKeySave}
          userIp={userIp}
        />
        <Manual isOpen={showManual} onClose={() => setShowManual(false)} />
        
        <EditModal 
            isOpen={editModalState.isOpen} 
            onClose={() => setEditModalState({isOpen:false, contentToEdit: null})} 
            onSubmit={handleEditSubmit} 
            isLoading={isLoadingEdit} 
            contentToEdit={editModalState.contentToEdit} 
        />
        
        <HistoryPanel 
            isOpen={isHistoryPanelOpen} 
            history={history} 
            onRecover={(id) => {
                const item = history.find(x => x.id === id);
                if (item) {
                    handleTopicChange(item.topic);
                    setGeneratedContent({ linkedInCopy: item.copy, imageUrl: item.imageUrl?.split(',')[1] || '', mimeType: item.mimeType || 'image/png' });
                    setIsHistoryPanelOpen(false);
                }
            }} 
            onDelete={(id) => setHistory(prev => prev.filter(x => x.id !== id))} 
            onClearAll={() => setHistory([])} 
        />
      </div>
    </SecureAccessGate>
  );
};

export default App;