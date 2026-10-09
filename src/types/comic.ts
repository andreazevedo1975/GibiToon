export type TargetAudience = 'beginner' | 'intermediate' | 'advanced';

export type ArtStyle =
  // Estilos da imagem de referência
  | 'cartoon'
  | 'hand_drawn'
  | 'doodle'
  | 'cartoon_educacional'
  | 'scientific_illustration'
  | 'futuristic_digital'
  | 'infografico_moderno'
  | 'minimalista'
  | 'three_d_educacional'
  | 'realista'
  | 'livro_didatico'
  | 'colorido_infantil'
  // Estilos complementares de quadrinhos & mangá
  | 'modern_manga'
  | 'anime_cinematic'
  | 'cartoon_retro'
  | 'chibi_kawaii'
  | 'vintage_comic'
  | 'clean_vector_bd'
  | 'watercolor_graphic_novel'
  | 'pixel_art'
  | 'cyberpunk_noir';

export type StyleCategory = 'all' | 'educational' | 'manga_anime' | 'cartoon' | 'comics' | 'retro_digital';

export type BubbleType = 'speech' | 'thought' | 'shout';

export type PositionAnchor =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'center-left'
  | 'center-right';

export type CameraAngle =
  | 'close-up'
  | 'wide-angle'
  | 'isometric'
  | 'bird-eye'
  | 'medium-shot';

export type LayoutType =
  | 'grid_4_uniform'
  | 'hero_top_two_bottom'
  | 'dynamic_action_5'
  | 'two_vertical_split';

export interface ComicCharacter {
  id: string;
  name: string;
  role: 'mentor' | 'learner';
  visual_description: string;
  avatar_color?: string;
  category?: 'manga_anime' | 'cartoon' | 'chibi' | 'tech_noir' | 'classic';
  style_badge?: string;
}

export interface DialogueBubble {
  id?: string;
  character_id: string;
  type: BubbleType;
  text: string;
  position_anchor: PositionAnchor;
  offset_x?: number; // fine position adjustment in %
  offset_y?: number;
}

export interface ComicPanel {
  panel_index: number;
  visual_prompt: string;
  camera_angle: CameraAngle;
  narration_box?: string;
  bubbles: DialogueBubble[];
  image_url?: string;
  imageUrl?: string;
  aspect_ratio?: string;
}

export interface ComicPage {
  page_number: number;
  layout_type: LayoutType;
  panels: ComicPanel[];
  page_summary?: string;
}

export type ColorThemeId =
  | 'default'
  | 'sepia'
  | 'grayscale'
  | 'vibrant'
  | 'warm_sun'
  | 'cyber_cool'
  | 'vintage_paper'
  | 'high_contrast'
  | 'emerald_matrix'
  | 'rose_pastel';

export type AspectRatioOption = '1:1' | '3:4' | '4:3' | '16:9' | '9:16';

export interface GeneratedSingleImage {
  id: string;
  prompt: string;
  optimizedPrompt: string;
  artStyle: ArtStyle;
  aspectRatio: AspectRatioOption;
  cameraAngle: CameraAngle;
  colorTheme: ColorThemeId;
  imageUrl: string;
  midjourneyCommand: string;
  fluxPrompt: string;
  source: 'ai_generated' | 'svg_fallback';
  engine?: 'gemini-nano-banana-2.1' | 'gemini-3.1-flash-lite-image';
  modelUsed?: string;
  imageSize?: '1K' | '2K';
  quotaNotice?: string;
  speechBubbleText?: string;
  narrationText?: string;
  createdAt: string;
}

export interface BookMetadata {
  title: string;
  topic: string;
  target_audience: TargetAudience;
  art_style: ArtStyle;
  characters: ComicCharacter[];
  tone?: 'socratic' | 'humorous' | 'formal' | 'enthusiastic';
  color_theme?: ColorThemeId;
  created_at?: string;
}

export interface ComicBook {
  book_metadata: BookMetadata;
  pages: ComicPage[];
}

export interface ArtStyleDefinition {
  id: ArtStyle;
  name: string;
  subtitle?: string;
  origin: string;
  category: StyleCategory;
  description: string;
  palette: string[];
  styleAnchorPrompt: string;
  borderStyle: string;
  tag: string;
}

export interface VisualPromptSuggestion {
  title: string;
  pedagogical_concept: string;
  visual_prompt: string;
  style_anchor_prompt: string;
  camera_angle: CameraAngle;
  negative_space_tip: string;
  flux_tags?: string;
}

