export type ItemType = 'image' | 'text' | 'sticker';

export type FrameStyle = 'polaroid' | 'plain' | 'film-strip' | 'vintage' | 'tape';

export type NoteColor = '#FFF59D' | '#FFE5E5' | '#E5F5FF' | '#E5FFE5' | '#F5E5FF' | '#FFE5D9';

export interface CanvasItem {
  id: string;
  type: ItemType;
  content: string; // file URI for images, text content for text, asset name for stickers
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
  style?: FrameStyle;
  noteColor?: NoteColor;
  font?: 'handwritten' | 'serif';
  dateAdded: string; // ISO-8601 date string
  journalEntry?: string; // User's notes about this item
  location?: string; // Optional location metadata
}

export interface Page {
  id: string;
  title: string;
  backgroundStyle: 'dot-grid' | 'crumpled' | 'kraft' | 'pastel';
  items: CanvasItem[];
}

export interface AppState {
  pages: Page[];
}
