import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuProps {
  onClearCanvas: () => void;
}

export default function Menu({ onClearCanvas }: MenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const handleClearCanvas = () => {
    setIsMenuOpen(false);
    onClearCanvas();
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
          <View style={[styles.menuPanel, { top: insets.top + 60 }]}>
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
    zIndex: 1000,
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
});
