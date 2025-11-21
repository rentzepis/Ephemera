import React from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { NoteColor } from '../types';

interface StickyNoteProps {
  text: string;
  onTextChange: (text: string) => void;
  backgroundColor?: NoteColor;
  editable?: boolean;
}

export default function StickyNote({ 
  text, 
  onTextChange,
  backgroundColor = '#FFF59D', // Yellow sticky note color
  editable = false,
}: StickyNoteProps) {
  return (
    <View style={[styles.container, { backgroundColor }]} pointerEvents={editable ? 'auto' : 'none'}>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={onTextChange}
        multiline
        editable={editable}
        placeholder="Tap to write..."
        placeholderTextColor="#999"
        returnKeyType="done"
        blurOnSubmit={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 180,
    padding: 16,
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
    color: '#333',
    textAlignVertical: 'top',
    // TODO: Apply handwriting font when loaded
    // fontFamily: 'PatrickHand',
  },
});
