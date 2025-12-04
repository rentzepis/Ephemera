import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { CanvasItem, FrameStyle, NoteColor } from '../types';
import { NOTE_COLORS } from '../constants/colors';

interface CustomizationModalProps {
  visible: boolean;
  item: CanvasItem | null;
  onClose: () => void;
  onUpdate: (updates: Partial<CanvasItem>) => void;
}

const FRAME_STYLES: { value: FrameStyle; label: string; emoji: string }[] = [
  { value: 'polaroid', label: 'Polaroid', emoji: '📷' },
  { value: 'plain', label: 'Plain', emoji: '🖼️' },
  { value: 'film-strip', label: 'Film Strip', emoji: '🎞️' },
  { value: 'vintage', label: 'Vintage', emoji: '📜' },
  { value: 'tape', label: 'Taped', emoji: '📎' },
];

export default function CustomizationModal({
  visible,
  item,
  onClose,
  onUpdate,
}: CustomizationModalProps) {
  if (!item) return null;

  const isPhoto = item.type === 'image';
  const isNote = item.type === 'text';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={30} style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContainer}
          >
            <View style={styles.modal}>
              <Text style={styles.title}>
                {isPhoto ? '📷 Photo Frame' : '📝 Note Style'}
              </Text>

              <ScrollView style={styles.optionsContainer}>
                {isPhoto && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frame Style</Text>
                    {FRAME_STYLES.map((frameStyle) => (
                      <TouchableOpacity
                        key={frameStyle.value}
                        style={[
                          styles.option,
                          item.style === frameStyle.value && styles.optionSelected,
                        ]}
                        onPress={() => {
                          onUpdate({ style: frameStyle.value });
                          onClose();
                        }}
                      >
                        <Text style={styles.optionEmoji}>{frameStyle.emoji}</Text>
                        <Text style={styles.optionText}>{frameStyle.label}</Text>
                        {item.style === frameStyle.value && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {isNote && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Note Color</Text>
                    <View style={styles.colorGrid}>
                      {NOTE_COLORS.map((noteColor) => (
                        <TouchableOpacity
                          key={noteColor.value}
                          style={[
                            styles.colorOption,
                            { backgroundColor: noteColor.value },
                            (item.noteColor || '#FFF59D') === noteColor.value &&
                              styles.colorOptionSelected,
                          ]}
                          onPress={() => {
                            onUpdate({ noteColor: noteColor.value });
                            onClose();
                          }}
                        >
                          {(item.noteColor || '#FFF59D') === noteColor.value && (
                            <Text style={styles.colorCheckmark}>✓</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: '70%',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    maxHeight: 400,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: '#e8f4f8',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  checkmark: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  colorOptionSelected: {
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  colorCheckmark: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
