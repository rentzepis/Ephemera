import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToolbarProps {
  onAddPhoto: (uri: string) => void;
  onAddText: () => void;
}

export default function Toolbar({ onAddPhoto, onAddText }: ToolbarProps) {
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);

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
      onAddPhoto(result.assets[0].uri);
    }
  };

  const handleAddText = () => {
    setIsExpanded(false);
    onAddText();
  };

  return (
    <View style={[styles.toolbar, { top: insets.top + 16 }]}>
      {isExpanded && (
        <View style={styles.expandedMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={pickImage}>
            <Text style={styles.menuText}>📷 Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleAddText}>
            <Text style={styles.menuText}>📝 Note</Text>
          </TouchableOpacity>
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
});
