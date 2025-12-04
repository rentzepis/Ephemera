import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Dimensions } from 'react-native';
import { CanvasItem, FrameStyle, NoteColor } from '../types';
import { NOTE_COLORS } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CustomizationToolbarProps {
  item: CanvasItem | null;
  visible: boolean;
  onUpdateItem: (updates: Partial<CanvasItem>) => void;
  onDeleteItem: () => void;
}

const FRAME_STYLES: { value: FrameStyle; label: string }[] = [
  { value: 'polaroid', label: 'Polaroid' },
  { value: 'plain', label: 'Plain' },
  { value: 'film-strip', label: 'Film' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'tape', label: 'Tape' },
];

const FONT_OPTIONS: { value: 'monospace' | 'script' | 'serif'; label: string }[] = [
  { value: 'monospace', label: 'Mono' },
  { value: 'script', label: 'Script' },
  { value: 'serif', label: 'Serif' },
];

export default function CustomizationToolbar({ item, visible, onUpdateItem, onDeleteItem }: CustomizationToolbarProps) {
  const slideAnim = useRef(new Animated.Value(200)).current; // Start off-screen

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 200,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [visible, slideAnim]);

  if (!item) return null;

  const isImage = item.type === 'image';
  const isText = item.type === 'text';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.toolbar}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isImage ? 'Frame Style' : 'Note Style'}
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDeleteItem}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {isImage && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsContainer}
          >
            {FRAME_STYLES.map((frameStyle) => (
              <TouchableOpacity
                key={frameStyle.value}
                style={[
                  styles.option,
                  item.style === frameStyle.value && styles.optionSelected,
                ]}
                onPress={() => onUpdateItem({ style: frameStyle.value })}
              >
                <Text
                  style={[
                    styles.optionText,
                    item.style === frameStyle.value && styles.optionTextSelected,
                  ]}
                >
                  {frameStyle.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {isText && (
          <View style={styles.rowsContainer}>
            {/* First row: Colors */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.optionsContainer}
            >
              {NOTE_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.value },
                    item.noteColor === color.value && styles.colorSelected,
                  ]}
                  onPress={() => onUpdateItem({ noteColor: color.value })}
                >
                  {item.noteColor === color.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Second row: Font and Date toggle */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.optionsContainer}
            >
              {FONT_OPTIONS.map((font) => (
                <TouchableOpacity
                  key={font.label}
                  style={[
                    styles.option,
                    item.font === font.value && styles.optionSelected,
                  ]}
                  onPress={() => onUpdateItem({ font: font.value })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.font === font.value && styles.optionTextSelected,
                    ]}
                  >
                    {font.label}
                  </Text>
                </TouchableOpacity>
              ))}

              <View style={styles.divider} />

              <TouchableOpacity
                style={[
                  styles.option,
                  item.showDate && styles.optionSelected,
                ]}
                onPress={() => onUpdateItem({ showDate: !item.showDate })}
              >
                <Text
                  style={[
                    styles.optionText,
                    item.showDate && styles.optionTextSelected,
                  ]}
                >
                  {item.showDate ? 'Hide Date' : 'Show Date'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  toolbar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#ef5350',
  },
  deleteButtonText: {
    fontSize: 13,
    color: '#d32f2f',
    fontWeight: '600',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  rowsContainer: {
    gap: 10,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#2196f3',
    fontWeight: '600',
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  colorSelected: {
    borderColor: '#2196f3',
  },
  checkmark: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
});
