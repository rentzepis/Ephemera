import React from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';
import { FrameStyle } from '../types';

interface PhotoFrameProps {
  uri: string;
  frameStyle: FrameStyle;
}

export default function PhotoFrame({ uri, frameStyle }: PhotoFrameProps) {
  if (frameStyle === 'plain') {
    return (
      <View style={styles.plainContainer}>
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  // Polaroid style
  return (
    <View style={styles.polaroidContainer}>
      {/* Decorative tape */}
      <View style={styles.tape} />
      
      {/* Photo with white border */}
      <View style={styles.polaroidFrame}>
        <Image source={{ uri }} style={styles.polaroidImage} resizeMode="cover" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  plainContainer: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  image: {
    width: 200,
    height: 200,
  },
  polaroidContainer: {
    position: 'relative',
  },
  polaroidFrame: {
    backgroundColor: '#fff',
    padding: 8,
    paddingBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  polaroidImage: {
    width: 200,
    height: 200,
  },
  tape: {
    position: 'absolute',
    top: -6,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 12,
    backgroundColor: '#e0c097',
    opacity: 0.8,
    zIndex: 10,
    transform: [{ rotate: '2deg' }],
  },
});
