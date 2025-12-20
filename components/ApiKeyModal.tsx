import React, { useState } from 'react';
import { SaveIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  onClose: () => void; // Optional if we want to allow closing without saving (e.g. cancel action)
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onClose }) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim().length < 10) {
        setError("La clave API parece demasiado corta.");
        return;
    }
    onSave(apiKeyInput.trim());
    setApiKeyInput('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
        <h2 className="text-2xl font-bold text-red-700 mb-2">Configuración Necesaria</h2>
        <p className="text-neutral-600 mb-6 text-sm">
          Para utilizar las funciones de IA, necesitas proporcionar tu propia <strong>Google Gemini API Key</strong>. 
          Esta clave se guardará de forma segura en tu navegador.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-api-key" className="block text-sm font-medium text-neutral-700 mb-1">
              Tu API Key
            </label>
            <input
              id="modal-api-key"
              type="password"
              value={apiKeyInput}
              onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setError('');
              }}
              placeholder="Ej: AIzaSy..."
              className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-lg focus:ring-red-500 focus:border-red-500 shadow-sm"
              autoFocus
            />
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!apiKeyInput}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              Guardar Key
            </button>
          </div>
        </form>
        
        <p className="text-xs text-neutral-400 mt-4 text-center">
            Puedes obtener una clave gratuita en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">Google AI Studio</a>.
        </p>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ApiKeyModal;