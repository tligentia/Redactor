import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { ClearIcon } from './icons';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  contentToEdit: {
    type: 'text' | 'image';
    content: string; // for text, the copy; for image, the data URL
    mimeType?: string;
  } | null;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSubmit, isLoading, contentToEdit }) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen || !contentToEdit) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800"
          aria-label="Cerrar modal de edición"
        >
          <ClearIcon className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-semibold text-red-700">
          Mejorar {contentToEdit.type === 'text' ? 'Texto' : 'Imagen'}
        </h3>
        
        <div className="max-h-64 overflow-y-auto bg-neutral-100 p-3 rounded-lg border border-neutral-200">
          {contentToEdit.type === 'text' ? (
            <p className="text-sm text-neutral-700 whitespace-pre-wrap">{contentToEdit.content}</p>
          ) : (
            <img src={contentToEdit.content} alt="Content to edit" className="w-full h-auto object-contain rounded-md" />
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              contentToEdit.type === 'text'
                ? 'Ej: Hazlo más conciso y añade un emoji de cohete al final.'
                : 'Ej: Añade un fondo de atardecer y haz que los colores sean más vibrantes.'
            }
            className="w-full h-28 p-3 bg-white border border-neutral-300 rounded-lg focus:ring-red-500 focus:border-red-500 placeholder-neutral-400 text-neutral-800 resize-y shadow-sm"
            disabled={isLoading}
            aria-label="Instrucciones de mejora"
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Aplicar Mejora'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
