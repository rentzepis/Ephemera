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
        <Image 
          source={{ uri }} 
          style={styles.image} 
          resizeMode="cover"
        />
      </View>
    );
  }

  if (frameStyle === 'film-strip') {
    return (
      <View style={styles.filmStripContainer}>
        <View style={styles.filmBorder}>
          <View style={styles.sprocketsTop}>
            {[...Array(8)].map((_, i) => (
              <View key={`top-${i}`} style={styles.sprocket} />
            ))}
          </View>
          <Image source={{ uri }} style={styles.filmImage} resizeMode="cover" />
          <View style={styles.sprocketsBottom}>
            {[...Array(8)].map((_, i) => (
              <View key={`bottom-${i}`} style={styles.sprocket} />
            ))}
          </View>
        </View>
      </View>
    );
  }

  if (frameStyle === 'vintage') {
    return (
      <View style={styles.vintageContainer}>
        <View style={styles.vintageFrame}>
          <Image source={{ uri }} style={styles.vintageImage} resizeMode="cover" />
        </View>
      </View>
    );
  }

  if (frameStyle === 'tape') {
    return (
      <View style={styles.tapeContainer}>
        {/* Corner tapes */}
        <View style={[styles.cornerTape, styles.tapeTopLeft]} />
        <View style={[styles.cornerTape, styles.tapeTopRight]} />
        <View style={[styles.cornerTape, styles.tapeBottomLeft]} />
        <View style={[styles.cornerTape, styles.tapeBottomRight]} />
        
        <Image source={{ uri }} style={styles.tapeImage} resizeMode="cover" />
      </View>
    );
  }

  // Polaroid style (default)
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
  // Film strip styles
  filmStripContainer: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  filmBorder: {
    backgroundColor: '#1a1a1a',
    padding: 6,
  },
  sprocketsTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 2,
  },
  sprocketsBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 2,
  },
  sprocket: {
    width: 18,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  filmImage: {
    width: 200,
    height: 200,
  },
  // Vintage styles
  vintageContainer: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  vintageFrame: {
    backgroundColor: '#d4c5a9',
    padding: 12,
    borderWidth: 2,
    borderColor: '#8b7355',
  },
  vintageImage: {
    width: 200,
    height: 200,
  },
  // Tape styles
  tapeContainer: {
    position: 'relative',
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
  tapeImage: {
    width: 200,
    height: 200,
  },
  cornerTape: {
    position: 'absolute',
    width: 35,
    height: 12,
    backgroundColor: '#e0c097',
    opacity: 0.85,
    zIndex: 10,
  },
  tapeTopLeft: {
    top: -5,
    left: 15,
    transform: [{ rotate: '-15deg' }],
  },
  tapeTopRight: {
    top: -5,
    right: 15,
    transform: [{ rotate: '15deg' }],
  },
  tapeBottomLeft: {
    bottom: -5,
    left: 15,
    transform: [{ rotate: '15deg' }],
  },
  tapeBottomRight: {
    bottom: -5,
    right: 15,
    transform: [{ rotate: '-15deg' }],
  },
});
