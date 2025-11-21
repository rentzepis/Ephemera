# BUGS:

dragging still not scaling correctly when not at default scale
have the journal open up after some delay identifying long press, instead of waiting for the user to release
journal opens with tap, should be long press

# SMALL TWEAKS

change font of note to be the same as the journal modal
add paper texture to the note

# MISSING FEATURES

1. No Layering/Collage Support

Junk journals are all about overlapping items - tickets over photos, washi tape across multiple items
Currently each item is isolated; you can't create that authentic "glued on top of each other" look
Fix: Add semi-transparent overlays, blend modes, or clipping masks

2. No Physical Ephemera Import
   Real junk journals include receipts, tickets, handwritten notes, magazine clippings
   You only support photos from camera roll
   Fix: Add document scanner integration (expo-document-picker or camera-based scanning)
3. Limited Decoration Options

No washi tape, stickers, stamps, or doodles yet
The "tape" mentioned in specs isn't implemented
Fix: Add SVG sticker library, draw-on-canvas capability, or stamp overlays

No Handwriting/Drawing

Real junk journals have hand-drawn doodles, arrows, circled dates
Fix: Add react-native-sketch-canvas or drawing mode

11. No Color/Mood Themes

Junk journals often have color-coordinated pages (all blue, all vintage, all pink)
Fix: Add page background options or color filter overlays

12. No Date/Timeline View

Hard to find "that page from summer 2024"
Fix: Add gallery/timeline view showing all pages chronologically

13. Limited Text Styling

Sticky notes are basic; no typewriter text, no stamps, no handwriting fonts yet
Fix: Load custom fonts (Patrick Hand, Caveat, Special Elite)

14. No Export/Share

Can't export pages as images to share or print
Fix: Add react-native-view-shot to capture and share pages

15. No Templates/Inspiration

Blank canvas is intimidating
Fix: Add starter templates (travel page, birthday, daily log)
