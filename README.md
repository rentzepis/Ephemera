# Ephemera - Digital Scrapbook App

A tactile, free-form digital canvas for preserving physical mementos (tickets, receipts, notes) in a messy, artistic way.

## Current Implementation Status

### ✅ Phase 1: Foundation (Completed)

- Project structure with TypeScript
- Canvas component with paper texture background (#f4f1ea)
- State management with AsyncStorage persistence
- Basic gesture handling setup

### ✅ Phase 2: Core Gestures (Completed)

- **DraggableItem Component** with multi-gesture support:
  - Pan gesture for dragging items anywhere on canvas
  - Pinch gesture for scaling
  - Rotation gesture for two-finger rotation
  - Tap gesture to bring items to front (z-index management)
- Smooth animations with react-native-reanimated

### ✅ Phase 3: Photo Upload & Framing (Completed)

- **Toolbar Component** with image picker integration
- **PhotoFrame Component** with two styles:
  - Polaroid frame (white border with extra bottom padding)
  - Plain frame (just the image)
- Decorative tape elements positioned on top of photos
- iOS-style shadows for depth (shadowOffset, shadowOpacity, shadowRadius)
- Random positioning and rotation when adding new photos

### ✅ Phase 4: Persistence (Completed)

- **usePersistedItems Hook** for state management
  - Automatic save to AsyncStorage on changes
  - Load items on app startup
  - CRUD operations (add, update, bring to front)

## Project Structure

```
Ephemera/
├── src/
│   ├── components/
│   │   ├── Canvas.tsx           # Main canvas container
│   │   ├── DraggableItem.tsx    # Gesture-enabled item wrapper
│   │   ├── PhotoFrame.tsx       # Photo with frame styles
│   │   └── Toolbar.tsx          # Bottom toolbar with controls
│   ├── hooks/
│   │   └── usePersistedItems.ts # AsyncStorage state management
│   └── types/
│       └── index.ts             # TypeScript interfaces
├── App.tsx                       # Root component
└── package.json
```

## Key Dependencies

- **react-native-gesture-handler** - Touch gesture recognition
- **react-native-reanimated** - Smooth 60fps animations
- **expo-image-picker** - Camera roll access
- **@react-native-async-storage/async-storage** - Local persistence
- **expo-font** - Custom font loading
- **react-native-safe-area-context** - Safe area handling

## Running the App

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Next Steps (Future Phases)

### Phase 5: Text & Stickers

- [ ] StickyNote component for text captions
- [ ] Editable text with handwriting font
- [ ] Sticker library (SVG assets: paperclips, coffee stains, doodles)
- [ ] Sticker drawer UI

### Phase 6: Multiple Backgrounds

- [ ] Background texture selection (dot-grid, crumpled, kraft, pastel)
- [ ] Background image support
- [ ] Page management (multiple canvases)

### Phase 7: Polish & Features

- [ ] Custom font loading (Patrick Hand, Playfair Display)
- [ ] Undo/redo functionality
- [ ] Delete items
- [ ] Export canvas as image
- [ ] Share functionality

## Data Structure

Each canvas item follows this schema:

```typescript
interface CanvasItem {
  id: string;
  type: "image" | "text" | "sticker";
  content: string; // URI for images, text for notes
  x: number; // Position
  y: number;
  rotation: number; // Degrees
  scale: number; // Multiplier
  zIndex: number; // Layering
  style?: "polaroid" | "plain";
  font?: "handwritten" | "serif";
}
```

## Design Philosophy

- **No grids** - Everything is free-form and can be placed anywhere
- **Tactile feel** - Heavy use of shadows, rotation, and textures
- **Messy aesthetic** - Items randomly rotated, overlapping allowed
- **Physical metaphor** - Like a corkboard or messy workbench
