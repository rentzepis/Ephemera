# Quick Start Guide

## Running Ephemera

### Start Development Server

```bash
npm start
```

### Test on iOS Simulator

```bash
npm run ios
```

### Test on Physical Device

1. Install "Expo Go" app from App Store
2. Run `npm start`
3. Scan the QR code with your camera

## Current Features

### Adding Photos

1. Tap the **"+ Add Photo"** button at the bottom
2. Select a photo from your camera roll
3. Photo appears on canvas with random position/rotation

### Manipulating Photos

- **Move**: Touch and drag anywhere
- **Rotate**: Use two fingers to rotate
- **Scale**: Pinch to zoom in/out
- **Bring to Front**: Tap the photo

### Automatic Saving

All changes are automatically saved to device storage. Your canvas will be restored when you reopen the app.

## Current Limitations (To Be Added)

- No delete functionality yet (restart app to clear)
- Can't add text notes via UI (component exists, needs toolbar button)
- Only polaroid frames shown (plain style available in code)
- No undo/redo
- No export/share functionality

## Architecture

### Key Files

- `App.tsx` - Main app entry point
- `src/components/Canvas.tsx` - Main canvas container
- `src/components/DraggableItem.tsx` - Handles all gestures
- `src/components/PhotoFrame.tsx` - Photo rendering with frames
- `src/hooks/usePersistedItems.ts` - State management + persistence

### Data Flow

```
User Action
    ↓
Toolbar/Gesture Handler
    ↓
App.tsx (state update via hook)
    ↓
AsyncStorage (auto-save)
    ↓
Canvas re-renders with new state
    ↓
DraggableItem shows updated position/scale/rotation
```

## Customization

### Change Background Color

Edit `src/components/Canvas.tsx`, line 35:

```typescript
backgroundColor: '#f4f1ea', // Change this hex code
```

### Adjust Photo Size

Edit `src/components/PhotoFrame.tsx`:

```typescript
width: 200,  // Change width
height: 200, // Change height
```

### Change Tape Color

Edit `src/components/PhotoFrame.tsx`, tape style:

```typescript
backgroundColor: '#e0c097', // Washi tape color
```

## Troubleshooting

### App won't start

```bash
# Clear cache and restart
npm start -- --clear
```

### Changes not appearing

```bash
# In Expo dev tools, press 'r' to reload
```

### Photos not uploading

- Check camera roll permissions in iOS Settings
- Make sure you're granting permission when prompted

### Gestures not working

- Make sure you're testing on a real device or simulator
- Web preview has limited gesture support

## Next Steps

See `IMPLEMENTATION.md` for the full list of planned features and technical details.
