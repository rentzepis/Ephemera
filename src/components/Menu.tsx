import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuProps {
  onClearCanvas: () => void;
}

export default function Menu({ onClearCanvas }: MenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showGestureGuide, setShowGestureGuide] = useState(false);
  const insets = useSafeAreaInsets();

  const handleClearCanvas = () => {
    setIsMenuOpen(false);
    onClearCanvas();
  };

  const handleShowGestureGuide = () => {
    setIsMenuOpen(false);
    setShowGestureGuide(true);
  };

  return (
    <>
      {/* Menu Button */}
      <TouchableOpacity
        style={[styles.menuButton, { top: insets.top + 16 }]}
        onPress={() => setIsMenuOpen(true)}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMenuOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.menuPanel, { top: insets.top + 60 }]}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Ephemera</Text>
                <Text style={styles.menuSubtitle}>A memory collage • Junk journal • Digital scrapbook</Text>
              </View>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem} onPress={handleShowGestureGuide}>
                <Text style={styles.menuItemIcon}>👆</Text>
                <Text style={styles.menuItemText}>Gesture Guide</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem} onPress={handleClearCanvas}>
                <Text style={styles.menuItemIcon}>🗑️</Text>
                <Text style={[styles.menuItemText, styles.dangerText]}>Clear Page</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setIsMenuOpen(false)}
              >
                <Text style={styles.menuItemIcon}>✕</Text>
                <Text style={styles.menuItemText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Gesture Guide Modal */}
      <Modal
        visible={showGestureGuide}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGestureGuide(false)}
      >
        <View style={styles.guideOverlay}>
          <View style={styles.guidePanel}>
            <Text style={styles.guideTitle}>Gesture Guide</Text>
            
            <ScrollView style={styles.guideScroll}>
              <View style={styles.guideSection}>
                <Text style={styles.guideSectionTitle}>Canvas</Text>
                <Text style={styles.guideItem}>• Two fingers: Pan and zoom canvas</Text>
                <Text style={styles.guideItem}>• Tap empty space: Close customization toolbar</Text>
              </View>

              <View style={styles.guideSection}>
                <Text style={styles.guideSectionTitle}>Items (Photos, Notes, Stickers)</Text>
                <Text style={styles.guideItem}>• Tap: Select for customization</Text>
                <Text style={styles.guideItem}>• Long press (hold): Edit content/journal entry</Text>
                <Text style={styles.guideItem}>• Drag: Move item</Text>
                <Text style={styles.guideItem}>• Two-finger rotate: Rotate item</Text>
                <Text style={styles.guideItem}>• Pinch: Scale item</Text>
              </View>

              <View style={styles.guideSection}>
                <Text style={styles.guideSectionTitle}>Pages</Text>
                <Text style={styles.guideItem}>• Swipe left/right: Navigate pages</Text>
                <Text style={styles.guideItem}>• Tap page indicator: Jump to page</Text>
              </View>

              <View style={styles.guideSection}>
                <Text style={styles.guideSectionTitle}>Adding Content</Text>
                <Text style={styles.guideItem}>• + button: Add photo, note, or sticker</Text>
                <Text style={styles.guideItem}>• Paste: Add image from clipboard</Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.guideCloseButton}
              onPress={() => setShowGestureGuide(false)}
            >
              <Text style={styles.guideCloseText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  menuIcon: {
    fontSize: 24,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuPanel: {
    position: 'absolute',
    left: 16,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  dangerText: {
    color: '#dc3545',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  guideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  guidePanel: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  guideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  guideScroll: {
    maxHeight: 400,
  },
  guideSection: {
    marginBottom: 20,
  },
  guideSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2196f3',
  },
  guideItem: {
    fontSize: 15,
    lineHeight: 24,
    color: '#555',
    marginBottom: 4,
  },
  guideCloseButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  guideCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
