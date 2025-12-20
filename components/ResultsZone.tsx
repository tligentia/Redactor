import React from 'react';
import ImageViewer from './ImageViewer';
import CopyEditor from './CopyEditor';
import { GeneratedContent, SocialPlatform } from '../types';

interface ResultsZoneProps {
  generatedContent: GeneratedContent | null;
  onCopyChange: (newCopy: string) => void;
  isLoadingContent: boolean;
  isLoadingImageRegen: boolean;
  isLoadingCopyRegen: boolean;
  onRegenerateImage: () => void;
  onRegenerateImageForPlatform: (platform: SocialPlatform) => void;
  onRegenerateLinkedInCopy: () => void;
  onRegenerateTwitterCopy: () => void;
  onRegenerateInstagramCopy: () => void;
  onRegenerateFacebookCopy: () => void;
  onRegenerateBlogCopy: () => void;

  topicForAltText?: string;
  canRegenerate: boolean;
  selectedTextModel: string | null;
  selectedImageModel: string | null;
  onGenerateHeadline: () => void;
  isLoadingHeadline: boolean;
  onEditText: () => void;
  onEditImage: () => void;
  generateHeadlineEnabled: boolean; // New prop
  onGenerateHeadlineToggle: () => void; // New prop
}

const ResultsZone: React.FC<ResultsZoneProps> = ({ 
  generatedContent, 
  onCopyChange, 
  isLoadingContent,
  isLoadingImageRegen,
  isLoadingCopyRegen,
  onRegenerateImage,
  onRegenerateImageForPlatform,
  onRegenerateLinkedInCopy,
  onRegenerateTwitterCopy,
  onRegenerateInstagramCopy,
  onRegenerateFacebookCopy,
  onRegenerateBlogCopy,
  topicForAltText,
  canRegenerate,
  selectedTextModel,
  selectedImageModel,
  onGenerateHeadline,
  isLoadingHeadline,
  onEditText,
  onEditImage,
  generateHeadlineEnabled,
  onGenerateHeadlineToggle
}) => {
  if (!isLoadingContent && !generatedContent && !isLoadingImageRegen && !isLoadingCopyRegen) {
    return (
        <div className="mt-8 p-6 bg-neutral-100 rounded-xl shadow-xl text-center text-neutral-500 min-h-[200px] flex items-center justify-center">
            Los resultados de la generación aparecerán aquí.
        </div>
    );
  }
  
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <ImageViewer 
        imageUrl={generatedContent?.imageUrl} 
        mimeType={generatedContent?.mimeType}
        isLoading={isLoadingContent && !generatedContent?.imageUrl}
        isRegenerating={isLoadingImageRegen}
        onRegenerate={onRegenerateImage}
        onRegenerateForPlatform={onRegenerateImageForPlatform}
        altText={topicForAltText ? `Visual for ${topicForAltText}` : "Generated visual content"}
        canRegenerate={canRegenerate}
        imageModelUsed={selectedImageModel}
        onEdit={onEditImage}
      />
      <CopyEditor 
        copy={generatedContent?.linkedInCopy ?? null} 
        imageUrl={generatedContent?.imageUrl}
        mimeType={generatedContent?.mimeType}
        onCopyChange={onCopyChange} 
        isLoading={isLoadingContent && !generatedContent?.linkedInCopy}
        isRegenerating={isLoadingCopyRegen}
        onRegenerateLinkedIn={onRegenerateLinkedInCopy}
        onRegenerateTwitter={onRegenerateTwitterCopy}
        onRegenerateInstagram={onRegenerateInstagramCopy}
        onRegenerateFacebook={onRegenerateFacebookCopy}
        onRegenerateBlog={onRegenerateBlogCopy}
        canRegenerate={canRegenerate}
        textModelUsed={selectedTextModel}
        onGenerateHeadline={onGenerateHeadline}
        isLoadingHeadline={isLoadingHeadline}
        onEdit={onEditText}
        generateHeadlineEnabled={generateHeadlineEnabled}
        onGenerateHeadlineToggle={onGenerateHeadlineToggle}
      />
    </div>
  );
};

export default ResultsZone;