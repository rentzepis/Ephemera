export type ItemType = 'image' | 'text' | 'sticker';

export type FrameStyle = 'polaroid' | 'plain' | 'film-strip' | 'vintage' | 'tape';

export type NoteColor = '#FFD54F' | '#EF9A9A' | '#90CAF9' | '#A5D6A7' | '#CE93D8' | '#FFAB91';

export interface CanvasItem {
  id: string;
  type: ItemType;
  content: string; // file URI for images/image-stickers, text content for text, emoji for emoji stickers
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
  style?: FrameStyle;
  noteColor?: NoteColor;
  font?: 'monospace' | 'script' | 'serif';
  showDate?: boolean;
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
