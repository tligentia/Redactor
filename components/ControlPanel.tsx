import React from 'react';
import { VisualStyle, TextTone, CreativityLevel, ContextualPersona, ImageFormat, AdvancedAISettings } from '../types';
import { 
  VISUAL_STYLE_OPTIONS, 
  TEXT_TONE_OPTIONS, 
  CREATIVITY_LEVEL_OPTIONS,
  CONTEXTUAL_PERSONA_OPTIONS,
  IMAGE_FORMAT_OPTIONS,
} from '../constants';
import Selector from './Selector';
import AdvancedControlPanel from './AdvancedControlPanel';
import { LightBulbIcon, TextIcon, TextSlashIcon, SaveIcon, CheckIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

interface ControlPanelProps {
  visualStyle: VisualStyle;
  onVisualStyleChange: (style: VisualStyle) => void;
  textTone: TextTone;
  onTextToneChange: (tone: TextTone) => void;
  creativityLevel: CreativityLevel;
  onCreativityLevelChange: (level: CreativityLevel) => void;
  contextualPersonas: ContextualPersona[];
  onContextualPersonaChange: (persona: ContextualPersona) => void;
  isGeneratingAnything: boolean;

  textModelOptions: { value: string; label: string }[];
  selectedTextModel: string;
  onSelectedTextModelChange: (model: string) => void;

  imageModelOptions: { value: string; label: string }[]; // New prop for dynamic options
  selectedImageModel: string;
  onSelectedImageModelChange: (model: string) => void;
  
  imageFormat: ImageFormat;
  onImageFormatChange: (format: ImageFormat) => void;

  advancedSettings: AdvancedAISettings;
  onAdvancedSettingsChange: (settings: AdvancedAISettings) => void;
  advancedPanelCollapsed: boolean;
  onAdvancedPanelToggle: () => void;
  
  imagePromptHints: string;
  onImagePromptHintsChange: (hints: string) => void;
  onSuggestImageHints: () => void;
  isLoadingImageHints: boolean;

  allowTextInImage: boolean;
  onAllowTextInImageToggle: () => void;
  onSaveSettings: () => void;
  
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  visualStyle,
  onVisualStyleChange,
  textTone,
  onTextToneChange,
  creativityLevel,
  onCreativityLevelChange,
  contextualPersonas,
  onContextualPersonaChange,
  isGeneratingAnything,
  textModelOptions,
  selectedTextModel,
  onSelectedTextModelChange,
  imageModelOptions,
  selectedImageModel,
  onSelectedImageModelChange,
  imageFormat,
  onImageFormatChange,
  advancedSettings,
  onAdvancedSettingsChange,
  advancedPanelCollapsed,
  onAdvancedPanelToggle,
  imagePromptHints,
  onImagePromptHintsChange,
  onSuggestImageHints,
  isLoadingImageHints,
  allowTextInImage,
  onAllowTextInImageToggle,
  onSaveSettings,
  apiKey,
  onApiKeyChange,
}) => {
  return (
    <div className="bg-neutral-100 p-6 rounded-xl shadow-xl space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-red-700 mb-4">Personaliza tu Contenido</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Selector
            id="visual-style"
            label="Estilo Visual"
            options={VISUAL_STYLE_OPTIONS}
            value={visualStyle}
            onChange={onVisualStyleChange}
            disabled={isGeneratingAnything}
          />
          <Selector
            id="text-tone"
            label="Tono del Texto"
            options={TEXT_TONE_OPTIONS}
            value={textTone}
            onChange={onTextToneChange}
            disabled={isGeneratingAnything}
          />
          <Selector
            id="creativity-level"
            label="Nivel de Creatividad"
            options={CREATIVITY_LEVEL_OPTIONS}
            value={creativityLevel}
            onChange={onCreativityLevelChange}
            disabled={isGeneratingAnything}
          />
           <Selector
            id="image-format"
            label="Formato de Imagen"
            options={IMAGE_FORMAT_OPTIONS}
            value={imageFormat}
            onChange={onImageFormatChange}
            disabled={isGeneratingAnything}
          />
          <Selector
            id="text-model"
            label="Modelo de Texto (IA)"
            options={textModelOptions}
            value={selectedTextModel}
            onChange={onSelectedTextModelChange}
            disabled={isGeneratingAnything || textModelOptions.length === 0}
          />
          <Selector
            id="image-model"
            label="Modelo de Imagen (IA)"
            options={imageModelOptions}
            value={selectedImageModel}
            onChange={onSelectedImageModelChange}
            disabled={isGeneratingAnything || imageModelOptions.length === 0}
          />
        </div>
      </div>

      <div>
        <label htmlFor="image-hints" className="text-sm font-medium text-neutral-600 flex items-center mb-2">
          <span>Detalles Adicionales para la Imagen (Opcional)</span>
          <button
            onClick={onSuggestImageHints}
            disabled={isGeneratingAnything}
            className="ml-2 p-1.5 bg-yellow-100 hover:bg-yellow-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title="Sugerir detalles basados en la configuración actual"
            aria-label="Sugerir detalles para la imagen"
          >
            {isLoadingImageHints ? <LoadingSpinner size="sm" /> : <LightBulbIcon className="w-4 h-4 text-yellow-500" />}
          </button>
          <button
            onClick={onAllowTextInImageToggle}
            disabled={isGeneratingAnything}
            className="ml-2 p-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border border-neutral-300"
            title={allowTextInImage ? "Prohibir texto en la imagen" : "Permitir texto en la imagen"}
            aria-label={allowTextInImage ? "Desactivar texto en imagen" : "Activar texto en imagen"}
          >
            {allowTextInImage ? <TextIcon className="w-4 h-4 text-green-600" /> : <TextSlashIcon className="w-4 h-4 text-red-600" />}
          </button>
        </label>
        <textarea
          id="image-hints"
          value={imagePromptHints}
          onChange={(e) => onImagePromptHintsChange(e.target.value)}
          disabled={isGeneratingAnything}
          placeholder="Ej: Un primer plano de un robot escribiendo en un teclado antiguo, con iluminación dramática..."
          className="w-full h-24 p-2.5 bg-white border border-neutral-300 rounded-lg focus:ring-red-500 focus:border-red-500 placeholder-neutral-400 text-sm shadow-sm resize-y disabled:bg-neutral-100"
        />
      </div>
      
      <div className="col-span-full">
          <label className="block text-sm font-medium text-neutral-600 mb-2">Actuar Como (Personalidad IA - Combinables)</label>
          <div className="flex flex-wrap gap-2">
              {CONTEXTUAL_PERSONA_OPTIONS.map(option => {
                  const isSelected = contextualPersonas.includes(option.value);
                  return (
                      <button
                          key={option.value}
                          onClick={() => onContextualPersonaChange(option.value)}
                          disabled={isGeneratingAnything}
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg shadow-sm transition-all duration-150 ease-in-out border
                              ${isSelected 
                                  ? 'bg-red-600 text-white border-red-700 ring-2 ring-red-300' 
                                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                              }
                              disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                      >
                          {isSelected && <CheckIcon className="h-4 w-4 mr-1.5" />}
                          {option.label}
                      </button>
                  );
              })}
          </div>
      </div>

      <div className="border-t border-neutral-200 pt-4 flex justify-end">
        <button
            onClick={onSaveSettings}
            disabled={isGeneratingAnything}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            title="Guardar la configuración actual en el navegador. (Nota: los cambios también se guardan automáticamente)"
        >
            <SaveIcon />
            Guardar Preferencias
        </button>
      </div>
      
      <AdvancedControlPanel
        settings={advancedSettings}
        onSettingsChange={onAdvancedSettingsChange}
        isCollapsed={advancedPanelCollapsed}
        onToggleCollapse={onAdvancedPanelToggle}
        isDisabled={isGeneratingAnything}
        apiKey={apiKey}
        onApiKeyChange={onApiKeyChange}
      />
    </div>
  );
};

export default ControlPanel;