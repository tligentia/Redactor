import React from 'react';
import { HistoryEntry } from '../types';
import { TrashIcon } from './icons';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onRecover: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onRecover, onDelete, onClearAll, isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="mt-6 bg-neutral-100 p-6 rounded-xl shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-red-700">Historial de Generaciones</h3>
        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center px-3 py-1.5 bg-neutral-500 hover:bg-neutral-600 text-white text-xs font-semibold rounded-lg shadow-md transition-colors"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Limpiar Historial
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="text-neutral-500 text-sm text-center py-4">No hay publicaciones guardadas en el historial.</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {history.map((item) => (
            <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm flex items-start gap-4">
              {item.imageUrl && (
                <img src={item.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
              )}
              <div className="flex-grow">
                <p className="text-xs text-neutral-500">{new Date(item.timestamp).toLocaleString('es-ES')}</p>
                <p className="font-semibold text-sm text-neutral-800 line-clamp-2" title={item.topic}>{item.topic}</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => onRecover(item.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
                >
                  Recuperar
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-md shadow-sm transition-colors"
                  aria-label="Eliminar entrada"
                >
                  <TrashIcon className="w-4 h-4 text-neutral-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
