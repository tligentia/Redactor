import React, { useState, useEffect, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';
// Added RefreshIcon to the import list from icons to fix the compilation error
import { 
  CopyIcon, 
  LinkedInIcon, 
  TwitterIcon, 
  InstagramIcon, 
  FacebookIcon, 
  BlogIcon,
  NewspaperIcon,
  BoldIcon, 
  ItalicIcon, 
  ListBulletIcon, 
  ListOrderedIcon,
  PencilIcon,
  RefreshIcon
} from './icons';
import { TEXT_MODEL_OPTIONS } from '../constants'; 
import {
  NORMAL_TO_BOLD, NORMAL_TO_ITALIC,
  BOLD_TO_NORMAL, ITALIC_TO_NORMAL,
} from '../utils/unicodeMaps';

interface CopyEditorProps {
  copy: string | null;
  onCopyChange: (newCopy: string) => void;
  isLoading: boolean; 
  isRegenerating: boolean; 
  onRegenerateLinkedIn: () => void;
  onRegenerateTwitter: () => void;
  onRegenerateInstagram: () => void;
  onRegenerateFacebook: () => void;
  onRegenerateBlog: () => void;
  canRegenerate: boolean; 
  textModelUsed?: string | null; 
  imageUrl?: string | null;
  mimeType?: string | null;
  onGenerateHeadline: () => void;
  isLoadingHeadline: boolean;
  onEdit: () => void;
  generateHeadlineEnabled: boolean; // New prop
  onGenerateHeadlineToggle: () => void; // New prop
}

const RegenerationButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  platformName: string;
  icon: React.ReactNode;
}> = ({ onClick, disabled, platformName, icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    aria-label={`Regenerar copy para ${platformName}`}
    title={`Regenerar para ${platformName}`}
  >
    {icon}
  </button>
);

const ToolbarButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  label: string;
  title: string;
  icon?: React.ReactNode;
}> = ({ onClick, disabled, label, title, icon }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="p-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-md shadow-sm transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    aria-label={label}
    title={title}
  >
    {icon || label}
  </button>
);

const CopyEditor: React.FC<CopyEditorProps> = ({ 
  copy, 
  onCopyChange, 
  isLoading, 
  isRegenerating, 
  onRegenerateLinkedIn,
  onRegenerateTwitter,
  onRegenerateInstagram,
  onRegenerateFacebook,
  onRegenerateBlog,
  canRegenerate,
  textModelUsed,
  imageUrl,
  mimeType,
  onGenerateHeadline,
  isLoadingHeadline,
  onEdit,
  generateHeadlineEnabled,
  onGenerateHeadlineToggle,
}) => {
  const [resolvedModelLabel, setResolvedModelLabel] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fullImageUrl = `data:${mimeType || 'image/jpeg'};base64,${imageUrl}`;
  const imageExtension = mimeType ? mimeType.split('/')[1] : 'jpg';

  useEffect(() => {
    if (textModelUsed) {
      const modelOption = [...TEXT_MODEL_OPTIONS].find(opt => opt.value === textModelUsed);
      setResolvedModelLabel(modelOption ? modelOption.label : textModelUsed);
    } else {
      setResolvedModelLabel(null);
    }
  }, [textModelUsed]);


  const handleClipboardCopy = () => {
    if (copy) {
      navigator.clipboard.writeText(copy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => console.error('Error al copiar texto: ', err));
    }
  };

  const handlePublishToLinkedIn = () => {
    if (!copy || !imageUrl) {
      alert("Se necesita generar tanto el texto como la imagen para poder publicar en LinkedIn.");
      return;
    }
    const link = document.createElement('a');
    link.href = fullImageUrl;
    link.download = `redactor_linkedin_image_${Date.now()}.${imageExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    navigator.clipboard.writeText(copy).catch(err => console.error(err));
    window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer');
  };

  const handlePublishToTwitter = () => {
    if (!copy) {
      alert("Se necesita generar texto para poder publicar en Twitter/X.");
      return;
    }
    navigator.clipboard.writeText(copy).catch(err => console.error(err));
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = fullImageUrl;
      link.download = `redactor_twitter_image_${Date.now()}.${imageExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    window.open('https://x.com/compose/tweet', '_blank', 'noopener,noreferrer');
  };

  const handlePublishToInstagram = () => {
    if (!copy || !imageUrl) {
      alert("Se necesita generar tanto el texto como la imagen para poder publicar en Instagram.");
      return;
    }
    const link = document.createElement('a');
    link.href = fullImageUrl;
    link.download = `redactor_instagram_image_${Date.now()}.${imageExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    navigator.clipboard.writeText(copy).catch(err => console.error(err));
    window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');
  };
  
  const showInitialLoading = isLoading && copy === null;
  const isEffectivelyLoading = isLoading || isRegenerating || isLoadingHeadline;

  const applyCharacterFormat = (formatType: 'bold' | 'italic') => {
    const textarea = textareaRef.current;
    if (!textarea || copy === null) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = copy.substring(start, end);
    
    if (!selectedText) return;

    const styleMap = formatType === 'bold' ? NORMAL_TO_BOLD : NORMAL_TO_ITALIC;
    const normalizedSelection = [...selectedText].map(char => 
        BOLD_TO_NORMAL[char] || ITALIC_TO_NORMAL[char] || char
    ).join('');
    const restyledSelection = [...normalizedSelection].map(char =>
        styleMap[char] || char
    ).join('');

    let newSelectedText = selectedText === restyledSelection ? normalizedSelection : restyledSelection;
    const newFullText = copy.substring(0, start) + newSelectedText + copy.substring(end);
    onCopyChange(newFullText);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start, start + newSelectedText.length);
      }
    }, 0);
  };

  const applyListFormat = (listType: 'ul' | 'ol') => {
    const textarea = textareaRef.current;
    if (!textarea || copy === null) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let lineStartIndex = copy.lastIndexOf('\n', start - 1) + 1;
    let lineEndIndex = copy.indexOf('\n', end);
    if (lineEndIndex === -1) lineEndIndex = copy.length;
    const selectedLinesText = copy.substring(lineStartIndex, lineEndIndex);
    const lines = selectedLinesText.split('\n');
    let newLines = [...lines];
    let textModified = false;
    const ulMarker = '- ';
    const olRegex = /^\d+\.\s/;
    let currentOlNumber = 1;
    const prevContentBeforeSelectionStart = copy.substring(0, lineStartIndex);
    const lastNewlineBeforeSelection = prevContentBeforeSelectionStart.lastIndexOf('\n');
    const lineImmediatelyBeforeSelection = prevContentBeforeSelectionStart.substring(lastNewlineBeforeSelection + 1);
    const matchPrevLineOl = lineImmediatelyBeforeSelection.match(olRegex);
    if (matchPrevLineOl) currentOlNumber = parseInt(lineImmediatelyBeforeSelection, 10) + 1;
    const allLinesStartWithUl = lines.every(line => line.startsWith(ulMarker) || line.trim() === '');
    const allLinesStartWithOl = lines.every(line => olRegex.test(line) || line.trim() === '');
    if (listType === 'ul') {
      if (allLinesStartWithUl) {
        newLines = lines.map(line => line.startsWith(ulMarker) ? line.substring(ulMarker.length) : line);
        textModified = true;
      } else {
        newLines = lines.map(line => line.trim() !== '' || lines.length === 1 ? ulMarker + line.replace(olRegex, '') : line);
        textModified = true;
      }
    } else if (listType === 'ol') {
      if (allLinesStartWithOl) {
        newLines = lines.map(line => line.replace(olRegex, ''));
        textModified = true;
      } else {
        newLines = lines.map((line, index) => line.trim() !== '' || lines.length === 1 ? `${currentOlNumber + index}. ${line.startsWith(ulMarker) ? line.substring(ulMarker.length) : line.replace(olRegex, '')}` : line);
        textModified = true;
      }
    }
    if (textModified) {
        const newTextChunk = newLines.join('\n');
        onCopyChange(copy.substring(0, lineStartIndex) + newTextChunk + copy.substring(lineEndIndex));
    }
  };

  return (
    <div className="bg-neutral-100 p-4 rounded-xl shadow-xl flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
          Texto Generado
          <button
            onClick={onGenerateHeadlineToggle}
            disabled={isLoadingHeadline}
            className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center border ${generateHeadlineEnabled ? 'bg-yellow-500 text-white border-yellow-600 shadow-inner' : 'bg-neutral-200 text-neutral-400 border-neutral-300'}`}
            title={generateHeadlineEnabled ? "Auto-Titular Activado: Se generará un titular automáticamente" : "Auto-Titular Desactivado: Haz clic para activar"}
            aria-label="Toggle auto-titular"
          >
             <NewspaperIcon className="w-4 h-4" />
          </button>
          
          {copy && !isEffectivelyLoading && (
            <div className="flex gap-2">
               <button
                  onClick={onGenerateHeadline}
                  disabled={isLoadingHeadline}
                  className="p-1.5 bg-yellow-100 hover:bg-yellow-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  title="Generar un titular puntual ahora"
                  aria-label="Generar titular ahora"
                >
                  {isLoadingHeadline ? <LoadingSpinner size="sm" /> : <RefreshIcon className="w-4 h-4 text-yellow-500" />}
                </button>
                <button
                    onClick={onEdit}
                    className="p-1.5 bg-sky-100 hover:bg-sky-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    title="Mejorar texto con IA"
                    aria-label="Mejorar texto"
                >
                    <PencilIcon className="w-4 h-4 text-sky-500" />
                </button>
            </div>
          )}
        </h3>
        {canRegenerate && (
          <div className="flex space-x-1">
            <RegenerationButton onClick={onRegenerateLinkedIn} disabled={isEffectivelyLoading} platformName="LinkedIn" icon={<LinkedInIcon />} />
            <RegenerationButton onClick={onRegenerateTwitter} disabled={isEffectivelyLoading} platformName="Twitter/X" icon={<TwitterIcon />} />
            <RegenerationButton onClick={onRegenerateInstagram} disabled={isEffectivelyLoading} platformName="Instagram" icon={<InstagramIcon />} />
            <RegenerationButton onClick={onRegenerateFacebook} disabled={isEffectivelyLoading} platformName="Facebook" icon={<FacebookIcon />} />
            <RegenerationButton onClick={onRegenerateBlog} disabled={isEffectivelyLoading} platformName="Blog" icon={<BlogIcon />} />
          </div>
        )}
      </div>

      <div className="bg-white p-2 rounded-lg border border-neutral-200 shadow-sm flex-grow flex flex-col">
        <div className="flex items-center space-x-2 p-1 border-b border-neutral-200 mb-2">
            <ToolbarButton onClick={() => applyCharacterFormat('bold')} disabled={isEffectivelyLoading || copy === null} label="Bold" title="Negrita" icon={<BoldIcon />} />
            <ToolbarButton onClick={() => applyCharacterFormat('italic')} disabled={isEffectivelyLoading || copy === null} label="Italic" title="Cursiva" icon={<ItalicIcon />} />
            <ToolbarButton onClick={() => applyListFormat('ul')} disabled={isEffectivelyLoading || copy === null} label="UL" title="Lista con viñetas" icon={<ListBulletIcon />} />
            <ToolbarButton onClick={() => applyListFormat('ol')} disabled={isEffectivelyLoading || copy === null} label="OL" title="Lista numerada" icon={<ListOrderedIcon />} />
        </div>
        <div className="relative flex-grow h-full min-h-[200px]">
          {isEffectivelyLoading && (
            <div className="absolute inset-0 bg-neutral-100/70 flex items-center justify-center z-10 rounded-b-lg">
              <LoadingSpinner message={isLoadingHeadline ? "Generando titular..." : "Regenerando texto..."} />
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={copy ?? ''}
            onChange={(e) => onCopyChange(e.target.value)}
            className={`w-full h-full p-2 bg-transparent border-0 rounded-md focus:ring-0 resize-none text-neutral-800 ${isEffectivelyLoading ? 'opacity-50' : ''}`}
            placeholder={showInitialLoading ? "Generando texto..." : "El texto aparecerá aquí una vez generado."}
            readOnly={isEffectivelyLoading}
            aria-label="Editor de texto para el contenido generado"
          />
        </div>
      </div>
      
      {copy !== null && resolvedModelLabel && !isEffectivelyLoading && (
          <p className="text-xs text-neutral-500 mt-2 text-center">
            Texto de {copy.length} letras by: {resolvedModelLabel}
          </p>
      )}

      <div className="mt-auto pt-4 w-full space-y-2">
        {copy !== null && !showInitialLoading && (
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
              <button
                onClick={handleClipboardCopy}
                disabled={isEffectivelyLoading}
                className="w-full flex items-center justify-center px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CopyIcon className="mr-2" />
                {copied ? '¡Copiado!' : 'Copiar Texto'}
              </button>
              <button
                onClick={handlePublishToLinkedIn}
                disabled={isEffectivelyLoading || !imageUrl || !copy}
                className="w-full flex items-center justify-center px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                title="Publicar en LinkedIn (requiere imagen y texto)"
              >
                <LinkedInIcon className="mr-2" />
                LinkedIn
              </button>
              <button
                onClick={handlePublishToTwitter}
                disabled={isEffectivelyLoading || !copy}
                className="w-full flex items-center justify-center px-4 py-2 bg-[#1DA1F2] hover:bg-[#0c85d0] text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                title="Publicar en Twitter/X"
              >
                <TwitterIcon className="mr-2" />
                Twitter/X
              </button>
              <button
                onClick={handlePublishToInstagram}
                disabled={isEffectivelyLoading || !imageUrl || !copy}
                className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-none disabled:bg-neutral-400"
                title="Publicar en Instagram (requiere imagen y texto)"
              >
                <InstagramIcon className="mr-2" />
                Instagram
              </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CopyEditor;