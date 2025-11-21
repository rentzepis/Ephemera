import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import { CanvasItem } from '../types';
import DraggableItem from './DraggableItem';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CanvasProps {
  items: CanvasItem[];
  onUpdateItem: (id: string, updates: Partial<CanvasItem>) => void;
  onBringToFront: (id: string) => void;
  onJournalOpen: (id: string) => void;
}

export default function Canvas({ items, onUpdateItem, onBringToFront, onJournalOpen }: CanvasProps) {
  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const baseScale = useRef(1);
  const initialDistance = useRef(0);
  const [currentScale, setCurrentScale] = useState(1);

  const getDistance = (touches: any[]) => {
    if (touches.length < 2) return 0;
    const [touch1, touch2] = touches;
    const dx = touch1.pageX - touch2.pageX;
    const dy = touch1.pageY - touch2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const canvasPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        // Only activate for two-finger gestures
        return gestureState.numberActiveTouches === 2;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only activate for two-finger gestures
        return gestureState.numberActiveTouches === 2;
      },
      onPanResponderGrant: (evt) => {
        panX.setOffset(panX._value);
        panY.setOffset(panY._value);
        panX.setValue(0);
        panY.setValue(0);
        
        // Record initial pinch distance
        if (evt.nativeEvent.touches.length === 2) {
          initialDistance.current = getDistance(evt.nativeEvent.touches);
          baseScale.current = scale._value;
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          // Handle panning
          panX.setValue(gestureState.dx);
          panY.setValue(gestureState.dy);
          
          // Handle pinch zoom
          const currentDistance = getDistance(evt.nativeEvent.touches);
          if (initialDistance.current > 0) {
            const newScale = (currentDistance / initialDistance.current) * baseScale.current;
            // Clamp scale between 0.5x and 3x
            const clampedScale = Math.max(0.5, Math.min(3, newScale));
            scale.setValue(clampedScale);
            setCurrentScale(clampedScale);
          }
        }
      },
      onPanResponderRelease: () => {
        panX.flattenOffset();
        panY.flattenOffset();
        baseScale.current = scale._value;
        setCurrentScale(scale._value);
        initialDistance.current = 0;
      },
      onPanResponderTerminate: () => {
        panX.flattenOffset();
        panY.flattenOffset();
        baseScale.current = scale._value;
        setCurrentScale(scale._value);
        initialDistance.current = 0;
      },
    })
  ).current;

  // Provide a function to get real-time scale value from Animated.Value
  const getCanvasScale = () => {
    // @ts-ignore - __getValue is a private API but necessary for real-time value
    return scale.__getValue ? scale.__getValue() : currentScale;
  };

  return (
    <View style={styles.container} {...canvasPanResponder.panHandlers}>
      <Animated.View
        style={[
          styles.canvas,
          {
            transform: [
              { translateX: panX },
              { translateY: panY },
              { scale: scale },
            ],
          },
        ]}
      >
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            onUpdate={(updates) => onUpdateItem(item.id, updates)}
            onLongPress={() => onBringToFront(item.id)}
            onJournalOpen={() => onJournalOpen(item.id)}
            getCanvasScale={getCanvasScale}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1ea', // Paper texture color on container
  },
  canvas: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
