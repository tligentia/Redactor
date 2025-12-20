import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DownloadIcon, RefreshIcon, LinkedInIcon, TwitterIcon, InstagramIcon, FacebookIcon, BlogIcon, PencilIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';
import { IMAGE_MODEL_OPTIONS } from '../constants'; 
import { SocialPlatform } from '../types';

interface ImageViewerProps {
  imageUrl?: string | null; // base64 string
  mimeType?: string | null; // e.g., 'image/jpeg'
  isLoading: boolean; // Loading for initial generation
  isRegenerating: boolean; // Loading for regeneration
  onRegenerate: () => void;
  onRegenerateForPlatform: (platform: SocialPlatform) => void;
  altText?: string;
  canRegenerate: boolean; // To enable/disable regenerate button
  imageModelUsed?: string | null; 
  onEdit: () => void; // New prop for editing
}

const ZOOM_LEVELS = [1, 1.5, 2, 2.5]; // Scale factors for zoom
const MAGNIFIER_LENS_SIZE = 150; // Pixels for the diameter of the lens
const MAGNIFIER_ZOOM_LEVEL = 2.5; // How much the lens magnifies relative to the displayed image

const ImageViewer: React.FC<ImageViewerProps> = ({ 
  imageUrl, 
  mimeType,
  isLoading, 
  isRegenerating, 
  onRegenerate, 
  onRegenerateForPlatform,
  altText = "Generated visual content",
  canRegenerate,
  imageModelUsed,
  onEdit // New prop for editing
}) => {
  const [resolvedModelLabel, setResolvedModelLabel] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentZoomLevelIndex, setCurrentZoomLevelIndex] = useState(0);

  // States for magnifier
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [magnifierBg, setMagnifierBg] = useState<{ size: string; position: string; image?: string }>({ size: 'auto', position: '0% 0%' });
  const lightboxImageRef = useRef<HTMLImageElement>(null);
  
  const fullImageUrl = `data:${mimeType || 'image/jpeg'};base64,${imageUrl}`;

  useEffect(() => {
    if (imageModelUsed) {
      const modelOption = IMAGE_MODEL_OPTIONS.find(opt => opt.value === imageModelUsed);
      setResolvedModelLabel(modelOption ? modelOption.label : imageModelUsed);
    } else {
      setResolvedModelLabel(null);
    }
  }, [imageModelUsed]);

  useEffect(() => {
    if (imageUrl) {
      setMagnifierBg(prev => ({
        ...prev,
        image: `url(${fullImageUrl})`
      }));
    }
  }, [imageUrl, mimeType, fullImageUrl]);

  const platformButtons = [
    { platform: 'linkedin', icon: <LinkedInIcon />, name: 'LinkedIn' },
    { platform: 'twitter', icon: <TwitterIcon />, name: 'Twitter/X' },
    { platform: 'instagram', icon: <InstagramIcon />, name: 'Instagram' },
    { platform: 'facebook', icon: <FacebookIcon />, name: 'Facebook' },
    { platform: 'blog', icon: <BlogIcon />, name: 'Blog' },
  ] as const;

  const downloadImage = () => {
    if (!imageUrl || !mimeType) return;
    const extension = mimeType.split('/')[1] || 'jpg';
    const link = document.createElement('a');
    link.href = fullImageUrl; 
    link.download = `redactor_image_${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openLightbox = useCallback(() => {
    if (imageUrl) {
      setIsLightboxOpen(true);
      setCurrentZoomLevelIndex(0); 
      document.body.style.overflow = 'hidden'; 
    }
  }, [imageUrl]);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setShowMagnifier(false); 
    document.body.style.overflow = ''; 
  }, []);

  const cycleZoomLevel = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation(); 
    setCurrentZoomLevelIndex(prevIndex => (prevIndex + 1) % ZOOM_LEVELS.length);
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    };
    if (isLightboxOpen) {
      window.addEventListener('keydown', handleEscKey);
    }
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isLightboxOpen, closeLightbox]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLImageElement>) => {
    if (!lightboxImageRef.current || !imageUrl) {
      setShowMagnifier(false);
      return;
    }

    const img = lightboxImageRef.current;
    const imgRect = img.getBoundingClientRect();
    const clientX = event.clientX;
    const clientY = event.clientY;

    const xOnImage = clientX - imgRect.left;
    const yOnImage = clientY - imgRect.top;

    if (xOnImage < 0 || xOnImage > imgRect.width || yOnImage < 0 || yOnImage > imgRect.height) {
      setShowMagnifier(false);
      return;
    }
    
    setShowMagnifier(true);

    setMagnifierPosition({
      top: clientY - MAGNIFIER_LENS_SIZE / 2,
      left: clientX - MAGNIFIER_LENS_SIZE / 2,
    });

    const bgSizeWidth = imgRect.width * MAGNIFIER_ZOOM_LEVEL;
    const bgSizeHeight = imgRect.height * MAGNIFIER_ZOOM_LEVEL;
    const bgPosX = -(xOnImage * MAGNIFIER_ZOOM_LEVEL - MAGNIFIER_LENS_SIZE / 2);
    const bgPosY = -(yOnImage * MAGNIFIER_ZOOM_LEVEL - MAGNIFIER_LENS_SIZE / 2);

    setMagnifierBg(prev => ({
      ...prev,
      size: `${bgSizeWidth}px ${bgSizeHeight}px`,
      position: `${bgPosX}px ${bgPosY}px`,
    }));
  }, [imageUrl, currentZoomLevelIndex]); // currentZoomLevelIndex because imgRect changes with scale

  const handleMouseLeaveImage = useCallback(() => {
    setShowMagnifier(false);
  }, []);
  
  const handleMouseEnterImage = useCallback(() => {
    // setShowMagnifier(true); // Let mouseMove and boundary checks handle actual showing
  }, []);


  const showInitialLoading = isLoading && !imageUrl; 
  const showContent = !showInitialLoading && imageUrl;
  const currentScale = ZOOM_LEVELS[currentZoomLevelIndex];

  return (
    <>
      <div className="bg-neutral-100 p-4 rounded-xl shadow-xl flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
            Visual Generado
            {imageUrl && !isLoading && !isRegenerating && (
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-1.5 bg-sky-100 hover:bg-sky-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    title="Mejorar imagen con IA"
                    aria-label="Mejorar imagen"
                >
                    <PencilIcon className="w-4 h-4 text-sky-500" />
                </button>
            )}
          </h3>
          {canRegenerate && imageUrl && !isLoading && !isRegenerating && (
            <div className="flex space-x-1">
              {platformButtons.map(({ platform, icon, name }) => (
                <button
                  key={platform}
                  onClick={(e) => { e.stopPropagation(); onRegenerateForPlatform(platform); }}
                  disabled={isRegenerating || isLoading}
                  className="p-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  title={`Regenerar para ${name}`}
                  aria-label={`Regenerar imagen para ${name}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div 
          className="w-full aspect-square bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden relative cursor-pointer flex-shrink-0"
          onClick={openLightbox}
          role="button"
          aria-label={altText + " (Haz clic para ampliar)"}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(); }}
        >
          {showInitialLoading && <LoadingSpinner message="Generando imagen..." />}
          {isRegenerating && imageUrl && ( 
            <div className="absolute inset-0 bg-neutral-100/70 flex items-center justify-center z-10 rounded-lg">
              <LoadingSpinner message="Regenerando imagen..." />
            </div>
          )}
          {showContent && (
            <img 
              src={fullImageUrl} 
              alt={altText} 
              className={`w-full h-full object-contain ${isRegenerating ? 'opacity-50' : ''}`}
            />
          )}
          {!isLoading && !isRegenerating && !imageUrl && (
            <div className="text-neutral-500 p-4 text-center">
              La imagen aparecerá aquí una vez generada.
            </div>
          )}
        </div>
        
        <div className="flex-grow"></div> 

        {imageUrl && resolvedModelLabel && !isLoading && !isRegenerating && (
          <p className="text-xs text-neutral-500 mt-2 text-center flex-shrink-0">
            Generado con: {resolvedModelLabel}
          </p>
        )}

        <div className="mt-auto pt-4 w-full space-y-2 flex-shrink-0">
          {imageUrl && !isLoading && (
            <button
              onClick={(e) => { e.stopPropagation(); downloadImage(); }}
              disabled={isRegenerating || isLoading}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DownloadIcon className="mr-2" />
              Descargar Imagen
            </button>
          )}
          {canRegenerate && imageUrl && !isLoading && (
            <button
              onClick={(e) => { e.stopPropagation(); onRegenerate();}}
              disabled={isRegenerating || isLoading}
              className="w-full flex items-center justify-center px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshIcon className="mr-2" />
              Regenerar Imagen
            </button>
          )}
        </div>
      </div>

      {isLightboxOpen && imageUrl && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          style={{ cursor: showMagnifier ? 'none' : 'default' }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-image"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-3xl hover:text-neutral-300 z-[70]" // Higher z-index than magnifier
            aria-label="Cerrar lightbox"
          >
            &times;
          </button>
          <div 
            className="relative max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} 
          >
            <img
              ref={lightboxImageRef}
              id="lightbox-image"
              src={fullImageUrl}
              alt={altText + " - Vista ampliada"}
              className="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 ease-in-out"
              style={{ 
                transform: `scale(${currentScale})`, 
                cursor: showMagnifier ? 'none' : 'zoom-in' 
              }}
              onClick={cycleZoomLevel}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeaveImage}
              onMouseEnter={handleMouseEnterImage}
            />
          </div>

          {showMagnifier && magnifierBg?.image && (
            <div
              style={{
                position: 'absolute',
                top: `${magnifierPosition.top}px`,
                left: `${magnifierPosition.left}px`,
                width: `${MAGNIFIER_LENS_SIZE}px`,
                height: `${MAGNIFIER_LENS_SIZE}px`,
                backgroundImage: magnifierBg.image,
                backgroundPosition: magnifierBg.position,
                backgroundSize: magnifierBg.size,
                border: '3px solid white',
                borderRadius: '50%', // Circular lens
                pointerEvents: 'none', // Important: lens should not trap mouse events
                backgroundRepeat: 'no-repeat',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                zIndex: 60, // Ensure it's above the image but below close button
              }}
            />
          )}

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1.5 rounded-md">
            Zoom: {Math.round(currentScale * 100)}% (Haz clic en la imagen para cambiar)
          </p>
        </div>
      )}
    </>
  );
};

export default ImageViewer;
