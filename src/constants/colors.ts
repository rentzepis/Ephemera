import { NoteColor } from '../types';

export const NOTE_COLORS: { value: NoteColor; label: string }[] = [
  { value: '#FFD54F', label: 'Yellow' },
  { value: '#EF9A9A', label: 'Rose' },
  { value: '#90CAF9', label: 'Blue' },
  { value: '#A5D6A7', label: 'Mint' },
  { value: '#CE93D8', label: 'Purple' },
  { value: '#FFAB91', label: 'Peach' },
  { value: '#E6DECA', label: 'Parchment' },
  { value: '#FFFFFF', label: 'White' },
];

export const DEFAULT_NOTE_COLOR: NoteColor = '#FFD54F';
