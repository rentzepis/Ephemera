import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToolbarProps {
  onAddPhoto: (uri: string) => void;
  onAddPhotoAsSticker: (uri: string) => void;
  onAddText: () => void;
  onAddSticker: (emoji: string) => void;
}

export default function Toolbar({ onAddPhoto, onAddPhotoAsSticker, onAddText, onAddSticker }: ToolbarProps) {
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStickers, setShowStickers] = useState(false);

  const stickers = ['⭐', '💖', '✨', '🌸', '🎀', '📌', '✂️', '🎨', '🌈', '☀️', '🌙', '💫', '🦋', '🌺', '🍃', '🎪'];

  const pickImage = async () => {
    setIsExpanded(false);
    
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to add photos!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      
      // Ask user if they want it as a sticker or photo
      Alert.alert(
        'Add Image',
        'How would you like to add this image?',
        [
          {
            text: 'As Photo',
            onPress: () => onAddPhoto(uri),
          },
          {
            text: 'As Sticker',
            onPress: () => onAddPhotoAsSticker(uri),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleAddText = () => {
    setIsExpanded(false);
    onAddText();
  };

  const handleAddSticker = (emoji: string) => {
    setShowStickers(false);
    setIsExpanded(false);
    onAddSticker(emoji);
  };

  const toggleStickers = () => {
    setShowStickers(!showStickers);
    if (showStickers) {
      setIsExpanded(false);
    }
  };

  const pasteImage = async () => {
    setIsExpanded(false);
    
    try {
      const hasImage = await Clipboard.hasImageAsync();
      
      if (!hasImage) {
        Alert.alert('No Image', 'There is no image in the clipboard. Copy an image first.');
        return;
      }

      const image = await Clipboard.getImageAsync({ format: 'png' });
      
      if (!image?.data) {
        Alert.alert('Error', 'No image data available in clipboard.');
        return;
      }

      // Use data URI directly - React Native Image can handle it
      const dataUri = `data:image/png;base64,${image.data}`;
      
      // Ask user if they want it as a sticker or photo
      Alert.alert(
        'Paste Image',
        'How would you like to add this image?',
        [
          {
            text: 'As Photo',
            onPress: () => onAddPhoto(dataUri),
          },
          {
            text: 'As Sticker',
            onPress: () => onAddPhotoAsSticker(dataUri),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error pasting image:', error);
      Alert.alert('Error', `Failed to paste image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <View style={[styles.toolbar, { top: insets.top + 16 }]}>
      {isExpanded && (
        <View style={styles.expandedMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={pickImage}>
            <Text style={styles.menuText}>📷 Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={pasteImage}>
            <Text style={styles.menuText}>📋 Paste</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleAddText}>
            <Text style={styles.menuText}>📝 Note</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={toggleStickers}>
            <Text style={styles.menuText}>✨ Sticker</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {showStickers && (
        <View style={styles.stickerPicker}>
          {stickers.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={styles.stickerButton}
              onPress={() => handleAddSticker(emoji)}
            >
              <Text style={styles.stickerEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.plusButton} 
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    position: 'absolute',
    left: 16,
    zIndex: 1000,
  },
  plusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  plusButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
  expandedMenu: {
    position: 'absolute',
    left: 60,
    top: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 150,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  stickerPicker: {
    position: 'absolute',
    left: 60,
    top: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: 200,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  stickerButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  stickerEmoji: {
    fontSize: 24,
  },
});
