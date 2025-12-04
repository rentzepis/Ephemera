import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Alert, TextInput, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToolbarProps {
  onAddPhoto: (uri: string) => void;
  onAddPhotoAsSticker: (uri: string) => void;
  onAddText: () => void;
  onAddSticker: (emoji: string) => void;
}

export interface ToolbarRef {
  closeMenu: () => void;
}

const Toolbar = forwardRef<ToolbarRef, ToolbarProps>(({ onAddPhoto, onAddPhotoAsSticker, onAddText, onAddSticker }, ref) => {
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [showEmojiInput, setShowEmojiInput] = useState(false);
  const [emojiText, setEmojiText] = useState('');

  useImperativeHandle(ref, () => ({
    closeMenu: () => {
      setIsExpanded(false);
      setShowStickers(false);
    },
  }));

  const stickers = ['⭐', '💖', '✨', '🌸', '🎀', '📌', '✂️', '🎨', '🌈', '☀️', '🌙', '💫', '🦋', '🌺', '🍃', '🎪'];

  const pickPhoto = async () => {
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
      onAddPhoto(uri);
    }
  };

  const pickImageSticker = async () => {
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
      onAddPhotoAsSticker(uri);
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

  const handleCustomEmoji = () => {
    setShowStickers(false);
    setIsExpanded(false);
    setShowEmojiInput(true);
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

      // Check if data is too large (> 10MB base64 string)
      if (image.data.length > 10000000) {
        Alert.alert('Image Too Large', 'This image is very large and may cause performance issues. Try copying a smaller image or use the photo picker instead.', [
          {
            text: 'Try Anyway',
            onPress: () => {
              const dataUri = `data:image/png;base64,${image.data}`;
              Alert.alert(
                'Paste Image',
                'How would you like to add this image?',
                [
                  { text: 'As Photo', onPress: () => onAddPhoto(dataUri) },
                  { text: 'As Sticker', onPress: () => onAddPhotoAsSticker(dataUri) },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]);
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
    <>
      <View style={[styles.toolbar, { top: insets.top + 16 }]}>
      {isExpanded && (
        <View style={styles.expandedMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={pickPhoto}>
            <Text style={styles.menuText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={pickImageSticker}>
            <Text style={styles.menuText}>Sticker</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.menuItem} onPress={pasteImage}>
            <Text style={styles.menuText}>📋 Paste</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.menuItem} onPress={handleAddText}>
            <Text style={styles.menuText}>Note</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={toggleStickers}>
            <Text style={styles.menuText}>Emoji</Text>
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
          <TouchableOpacity
            style={[styles.stickerButton, styles.customEmojiButton]}
            onPress={handleCustomEmoji}
          >
            <Text style={styles.customEmojiText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Modal
        visible={showEmojiInput}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEmojiInput(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEmojiInput(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.emojiInputPanel}>
              <Text style={styles.emojiInputTitle}>Add Custom Emoji</Text>
              <Text style={styles.emojiInputHint}>Tap the text field and use your emoji keyboard</Text>
              <TextInput
                style={styles.emojiInput}
                placeholder="Tap here for emoji keyboard"
                value={emojiText}
                onChangeText={setEmojiText}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={() => {
                  const emoji = emojiText.trim();
                  if (emoji) {
                    onAddSticker(emoji);
                    setShowEmojiInput(false);
                    setEmojiText('');
                  }
                }}
              />
              <View style={styles.emojiButtonRow}>
                <TouchableOpacity
                  style={styles.emojiCancelButton}
                  onPress={() => {
                    setShowEmojiInput(false);
                    setEmojiText('');
                  }}
                >
                  <Text style={styles.emojiCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.emojiDoneButton}
                  onPress={() => {
                    const emoji = emojiText.trim();
                    if (emoji) {
                      onAddSticker(emoji);
                      setShowEmojiInput(false);
                      setEmojiText('');
                    }
                  }}
                >
                  <Text style={styles.emojiDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      
      <TouchableOpacity 
        style={styles.plusButton} 
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
      
      {(isExpanded || showStickers) && (
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => {
            setIsExpanded(false);
            setShowStickers(false);
          }}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
    </>
  );
});

const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalContentContainer: {
    flex: 1,
  },
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
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
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
  closeButtonText: {
    color: '#666',
    fontSize: 20,
    fontWeight: '400',
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
  customEmojiButton: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
    borderStyle: 'dashed',
  },
  customEmojiText: {
    fontSize: 24,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiInputPanel: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  emojiInputTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  emojiInputHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  emojiInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 16,
  },
  emojiButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  emojiCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  emojiCancelText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emojiDoneButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#2196f3',
  },
  emojiDoneText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Toolbar;
