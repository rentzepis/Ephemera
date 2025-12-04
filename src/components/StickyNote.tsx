import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform, Image } from 'react-native';
import { NoteColor } from '../types';

interface StickyNoteProps {
  text: string;
  onTextChange: (text: string) => void;
  backgroundColor?: NoteColor;
  font?: 'monospace' | 'script' | 'serif';
  editable?: boolean;
  showDate?: boolean;
  dateAdded?: string;
}

export default function StickyNote({ 
  text, 
  onTextChange,
  backgroundColor = '#FFD54F', // Yellow sticky note color
  font = 'monospace',
  editable = false,
  showDate = false,
  dateAdded,
}: StickyNoteProps) {
  // Determine font family based on font prop
  let fontFamily: string | undefined;
  if (font === 'monospace') {
    fontFamily = Platform.OS === 'ios' ? 'Courier' : 'monospace';
  } else if (font === 'script') {
    fontFamily = Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive';
  } else if (font === 'serif') {
    fontFamily = Platform.OS === 'ios' ? 'Georgia' : 'serif';
  }

  // Format date if showing
  const formattedDate = showDate && dateAdded 
    ? new Date(dateAdded).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    : null;

  return (
    <View style={[styles.container, { backgroundColor }]} pointerEvents={editable ? 'auto' : 'none'}>
      {formattedDate && (
        <Text style={[styles.dateText, fontFamily && { fontFamily }]}>
          {formattedDate}
        </Text>
      )}
      <TextInput
        style={[styles.textInput, fontFamily && { fontFamily }]}
        value={text}
        onChangeText={onTextChange}
        multiline
        editable={editable}
        placeholder="Tap to write..."
        placeholderTextColor="#999"
        returnKeyType="done"
        blurOnSubmit={true}
      />
      <Image
        source={require('../../assets/paper-texture.png')}
        style={styles.paperTexture}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 180,
    padding: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    textAlignVertical: 'top',
  },
  dateText: {
    fontSize: 16,
    color: '#222',
    marginBottom: 8,
    // fontWeight: '400',
  },
  paperTexture: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 180,
    height: 180,
    opacity: 0.3,
  },
});
