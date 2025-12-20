export enum VisualStyle {
  Infographic = 'infographic',
  Photorealistic = 'photorealistic',
  Pictogram = 'pictogram',
  RetroFuturism = 'retroFuturism',
  AbstractExpressionism = 'abstractExpressionism',
  PixelArt = 'pixelArt',
  Watercolor = 'watercolor',
  Cinematic = 'cinematic', 
  DroneShot = 'droneShot', 
  MacroPhotography = 'macroPhotography', 
}

export enum TextTone {
  Professional = 'professional',
  Inspirational = 'inspirational',
  Approachable = 'approachable', // Cercano
  Technical = 'technical',
  Urgent = 'urgent',
  Collaborative = 'collaborative',
}

export enum CreativityLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum ContextualPersona {
  Neutral = 'neutral',
  CybersecurityExpert = 'cybersecurityExpert',
  VitagAppPlatform = 'vitagAppPlatform',
  AIBootcampEducator = 'aiBootcampEducator',
  Innovator = 'innovator',
  Influencer = 'influencer', 
  MarketingExpert = 'marketingExpert', 
  OpinionLeader = 'opinionLeader', 
  CommunityManager = 'communityManager', 
  TechnicalWriter = 'technicalWriter', 
  Storyteller = 'storyteller', 
  HumanizedAI = 'humanizedAI', // Newly Added
  FinanceExpert = 'financeExpert',
}

export enum ImageFormat {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WebP = 'image/webp',
}

export type SocialPlatform = 'linkedin' | 'twitter' | 'instagram' | 'facebook' | 'blog';

export interface FetchedNews {
  title: string;
  summary: string;
  url: string;
  publicationDate?: string; // Fecha de publicación de la noticia
}

export interface GeneratedContent {
  imageUrl: string; // base64 string
  mimeType: string; // e.g., 'image/jpeg'
  linkedInCopy: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  topic: string;
  copy: string;
  imageUrl?: string; // This will be the full data URL
  mimeType?: string;
}


// For Google Search grounding metadata
export interface GroundingChunkWeb {
  uri?: string; 
  title?: string; 
}
export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // Other types of chunks can be added if needed
}
export interface GroundingMetadata {
  groundingAttributions?: any[]; // Corregido según la definición de @google/genai, puede ser más específico si se conoce la estructura.
  webSearchQueries?: string[];
  groundingChunks?: GroundingChunk[];
}
export interface Candidate { // This is a local type definition for Candidate from @google/genai
    groundingMetadata?: GroundingMetadata;
    // Other candidate fields from @google/genai
    // Ensure this matches the structure you expect from the API, e.g., for 'finishReason', 'citationMetadata', etc.
}

// Service response types that include token counts
export interface TextGenerationResult {
  text: string;
  tokenCount: number | null;
}

export interface NewsFetchResult {
  news: FetchedNews;
  tokenCount: number | null;
}

export interface StringArrayResult {
  data: string[];
  tokenCount: number | null;
}

export interface ImageGenerationResult {
    base64Image: string;
    mimeType: string;
    // Token count for image generation is typically not provided by the API in the same way.
    // We can add it if available, otherwise it will be null.
    tokenCount: number | null; 
}

export interface AdvancedAISettings {
  temperature: number;
  topP: number;
  topK: number;
}