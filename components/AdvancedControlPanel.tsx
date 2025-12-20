import React, { useState, useEffect } from 'react';
import { AdvancedAISettings } from '../types';
import { InfoIcon, ChevronDownIcon } from './icons';

interface AdvancedControlPanelProps {
  settings: AdvancedAISettings;
  onSettingsChange: (newSettings: AdvancedAISettings) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isDisabled: boolean;
  apiKey: string; // New prop
  onApiKeyChange: (key: string) => void; // New prop
}

const SliderControl: React.FC<{
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  tooltip: string;
  isDisabled: boolean;
}> = ({ id, label, value, min, max, step, onChange, tooltip, isDisabled }) => (
  <div className="flex flex-col space-y-2">
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-sm font-medium text-neutral-600 flex items-center">
        {label}
        <div className="relative group ml-2">
          <InfoIcon className="w-4 h-4 text-neutral-400 cursor-help" />
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-2 bg-neutral-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
            {tooltip}
          </div>
        </div>
      </label>
      <span className="text-sm font-mono text-neutral-700 bg-neutral-200 px-2 py-0.5 rounded-md">{value.toFixed(2)}</span>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      disabled={isDisabled}
      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600 disabled:accent-neutral-400 disabled:cursor-not-allowed"
    />
  </div>
);

const AdvancedControlPanel: React.FC<AdvancedControlPanelProps> = ({
  settings,
  onSettingsChange,
  isCollapsed,
  onToggleCollapse,
  isDisabled,
  apiKey,
  onApiKeyChange
}) => {
  const [localKey, setLocalKey] = useState(apiKey);

  useEffect(() => {
    setLocalKey(apiKey);
  }, [apiKey]);

  const handleSettingChange = (key: keyof AdvancedAISettings, value: number) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleKeyBlur = () => {
    if (localKey !== apiKey) {
        onApiKeyChange(localKey);
    }
  };

  return (
    <div className="border-t border-neutral-300 pt-4">
      <button
        onClick={onToggleCollapse}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-red-700"
        aria-expanded={!isCollapsed}
        aria-controls="advanced-ai-settings"
      >
        <span>Configuración avanzada de IA</span>
        <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
      </button>
      {!isCollapsed && (
        <div id="advanced-ai-settings" className="mt-4 space-y-6">
           <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
               <label htmlFor="api-key-input" className="block text-sm font-medium text-neutral-700 mb-2">
                   Google Gemini API Key (Opcional si usa entorno predefinido)
               </label>
               <input 
                   id="api-key-input"
                   type="password"
                   value={localKey}
                   onChange={(e) => setLocalKey(e.target.value)}
                   onBlur={handleKeyBlur}
                   disabled={isDisabled}
                   placeholder="Ingrese su API Key aquí..."
                   className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm font-mono placeholder-neutral-400 disabled:bg-neutral-100"
               />
               <p className="text-xs text-neutral-500 mt-1">
                   La clave se almacena localmente en su navegador. Déjelo en blanco si el sistema ya provee una clave.
               </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SliderControl
                id="temperature"
                label="Temperatura"
                value={settings.temperature}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => handleSettingChange('temperature', v)}
                tooltip="Controla la aleatoriedad. Valores más bajos hacen que el modelo sea más determinista y conservador. Valores más altos fomentan respuestas más diversas y creativas."
                isDisabled={isDisabled}
            />
            <SliderControl
                id="top-p"
                label="Top-P"
                value={settings.topP}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => handleSettingChange('topP', v)}
                tooltip="Controla la diversidad del vocabulario. El modelo considera un conjunto más pequeño de palabras probables. Un valor más alto (ej. 0.95) permite más variedad de palabras."
                isDisabled={isDisabled}
            />
            <SliderControl
                id="top-k"
                label="Top-K"
                value={settings.topK}
                min={1}
                max={100}
                step={1}
                onChange={(v) => handleSettingChange('topK', v)}
                tooltip="Limita la selección del modelo a un número 'K' de las palabras más probables. Un valor más bajo (ej. 10) restringe la salida a palabras muy probables, haciéndola más predecible y coherente."
                isDisabled={isDisabled}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedControlPanel;