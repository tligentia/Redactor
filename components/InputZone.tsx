import React from 'react';
import { FireIcon, LinkIcon, LightBulbIcon, ClearIcon } from './icons'; // Added ClearIcon
import LoadingSpinner from './LoadingSpinner';

interface InputZoneProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  onFetchNews: () => void;
  isLoadingNews: boolean;
  newsSourceUrl?: string | null;
  newsSourceTitle?: string | null;
  newsPublicationDate?: string | null; // Date will be displayed below the source
  onSuggestTopics: () => void;
  isLoadingSuggestions: boolean;
  suggestedTopicsList: string[] | null;
  onSelectSuggestedTopic: (suggestion: string) => void;
  onClearAll: () => void; // New prop
  isAnyLoading: boolean; // New prop
}

const InputZone: React.FC<InputZoneProps> = ({
  topic,
  onTopicChange,
  onFetchNews,
  isLoadingNews,
  newsSourceUrl,
  newsSourceTitle,
  newsPublicationDate, // Use this prop for display
  onSuggestTopics,
  isLoadingSuggestions,
  suggestedTopicsList,
  onSelectSuggestedTopic,
  onClearAll,
  isAnyLoading,
}) => {
  return (
    <div className="bg-neutral-100 p-6 rounded-xl shadow-xl space-y-4">
      <textarea
        value={topic}
        onChange={(e) => onTopicChange(e.target.value)}
        placeholder="Introduce tu tema o palabra clave aquí... (Ej: El impacto de la IA cuántica en las finanzas)"
        className="w-full h-32 p-3 bg-white border border-neutral-300 rounded-lg focus:ring-red-500 focus:border-red-500 placeholder-neutral-400 text-neutral-800 resize-none shadow-sm"
        disabled={isAnyLoading}
        aria-label="Tema principal o palabra clave"
      />
      {newsSourceUrl && newsSourceTitle && (
        <div className="text-xs text-neutral-500 bg-neutral-200/50 p-2 rounded-md space-y-1">
          <div>
            Noticia obtenida de: <a href={newsSourceUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-500 underline inline-flex items-center gap-1">
              {newsSourceTitle} <LinkIcon className="w-3 h-3" />
            </a>
          </div>
          {newsPublicationDate && (
            <div>
              Fecha: {newsPublicationDate}
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={onFetchNews}
          disabled={isAnyLoading}
          className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Buscar noticia del día sobre el tema actual o genérico"
        >
          {isLoadingNews ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <FireIcon className="mr-2 h-5 w-5" />
              Buscar Noticia
            </>
          )}
        </button>
        <button
          onClick={onSuggestTopics}
          disabled={isAnyLoading || !topic.trim()}
          className="w-full flex items-center justify-center px-4 py-3 bg-neutral-700 hover:bg-neutral-800 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sugerir temas relacionados con el contenido actual del campo de tema"
        >
          {isLoadingSuggestions ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <LightBulbIcon className="mr-2 h-5 w-5" />
              Sugerir Temas
            </>
          )}
        </button>
        <button
          onClick={onClearAll}
          disabled={isAnyLoading}
          className="w-full flex items-center justify-center px-4 py-3 bg-neutral-500 hover:bg-neutral-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Limpiar todos los campos, contenidos generados y reiniciar configuraciones"
          title="Limpiar Todo y Reiniciar"
        >
          <ClearIcon className="mr-2 h-5 w-5" />
          Limpiar Todo
        </button>
      </div>
      {suggestedTopicsList && suggestedTopicsList.length > 0 && (
        <div className="mt-3 space-y-2">
          <h4 className="text-sm font-medium text-neutral-700">Sugerencias de Temas:</h4>
          <div className="flex flex-wrap gap-2">
            {suggestedTopicsList.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSelectSuggestedTopic(suggestion)}
                className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs font-medium rounded-full shadow-sm transition-colors duration-150 ease-in-out"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputZone;