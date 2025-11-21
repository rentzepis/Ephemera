import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CanvasItem } from '../types';
import PhotoFrame from './PhotoFrame';
import StickyNote from './StickyNote';
import { PanResponder } from 'react-native';

interface DraggableItemProps {
  item: CanvasItem;
  onUpdate: (updates: Partial<CanvasItem>) => void;
  onLongPress: () => void;
  onJournalOpen: () => void;
  getCanvasScale: () => number;
}

export default function DraggableItem({ item, onUpdate, onLongPress, onJournalOpen, getCanvasScale }: DraggableItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [livePosition, setLivePosition] = useState({ x: item.x, y: item.y });
  
  // Track the actual current position across updates - this is our source of truth
  const actualPosition = useRef({ x: item.x, y: item.y });
  
  // Gesture state
  const touchStartTime = useRef(0);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const currentDraggedPos = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const isDragging = useRef(false);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const lastTapTime = useRef(0);
  
  // Update actual position ref whenever item prop changes
  React.useEffect(() => {
    actualPosition.current = { x: item.x, y: item.y };
    if (!isDragging.current) {
      setLivePosition({ x: item.x, y: item.y });
    }
  }, [item.x, item.y]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isEditing,
      onMoveShouldSetPanResponder: () => !isEditing,
      
      onPanResponderGrant: (evt) => {
        // Initialize gesture tracking
        isDragging.current = true;
        touchStartTime.current = Date.now();
        touchStartPos.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY
        };
        
        // Use actualPosition ref as source of truth (updates from useEffect)
        const startPos = actualPosition.current;
        setLivePosition({ x: startPos.x, y: startPos.y });
        dragStartPos.current = { x: startPos.x, y: startPos.y };
        hasDragged.current = false;
        isLongPress.current = false;
        
        // Start long-press detection timer
        longPressTimeout.current = setTimeout(() => {
          // Only trigger if haven't started dragging
          if (!hasDragged.current) {
            isLongPress.current = true;
            Haptics.selectionAsync();
            onLongPress();
            if (item.type === 'image') {
              onJournalOpen();
            }
          }
        }, 500);
      },
      
      onPanResponderMove: (evt, gesture) => {
        const moveDistance = Math.sqrt(gesture.dx * gesture.dx + gesture.dy * gesture.dy);
        
        // Cancel long-press if finger moves
        if (moveDistance > 8 && longPressTimeout.current) {
          clearTimeout(longPressTimeout.current);
          longPressTimeout.current = null;
        }
        
        // Start dragging if moved enough
        if (moveDistance > 8 && !hasDragged.current) {
          hasDragged.current = true;
        }
        
        if (hasDragged.current) {
          const currentScale = getCanvasScale();
          const newX = dragStartPos.current.x + (gesture.dx / currentScale);
          const newY = dragStartPos.current.y + (gesture.dy / currentScale);
          
          // Store in ref for release handler (avoids closure issue)
          currentDraggedPos.current = { x: newX, y: newY };
          
          // Update live position for immediate visual feedback
          setLivePosition({ x: newX, y: newY });
        }
      },
      
      onPanResponderRelease: (evt, gesture) => {
        // Clean up timer
        if (longPressTimeout.current) {
          clearTimeout(longPressTimeout.current);
          longPressTimeout.current = null;
        }
        
        const moveDistance = Math.sqrt(gesture.dx * gesture.dx + gesture.dy * gesture.dy);
        const pressDuration = Date.now() - touchStartTime.current;
        
        // Handle drag end - persist position
        if (hasDragged.current && moveDistance > 8) {
          const finalPos = currentDraggedPos.current;
          
          // Update our source of truth immediately
          actualPosition.current = { x: finalPos.x, y: finalPos.y };
          
          onUpdate({ x: finalPos.x, y: finalPos.y });
          hasDragged.current = false;
          isDragging.current = false;
          return;
        }
        
        isDragging.current = false;
        hasDragged.current = false;
        
        // If long-press triggered, don't process as tap
        if (isLongPress.current) {
          return;
        }
        
        // Handle double-tap for text editing
        if (moveDistance < 8 && pressDuration < 500) {
          const now = Date.now();
          const timeSinceLastTap = now - lastTapTime.current;
          
          // Double-tap on text notes enables editing
          if (item.type === 'text' && timeSinceLastTap < 300) {
            setIsEditing(true);
            lastTapTime.current = 0;
          } else {
            lastTapTime.current = now;
          }
        }
      },
      
      onPanResponderTerminate: () => {
        if (longPressTimeout.current) {
          clearTimeout(longPressTimeout.current);
          longPressTimeout.current = null;
        }
        isDragging.current = false;
        hasDragged.current = false;
      },
    })
  ).current;

  // Use live position that updates in real-time during drag
  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          left: livePosition.x,
          top: livePosition.y,
          transform: [
            { scale: item.scale },
            { rotate: `${item.rotation}deg` },
          ],
          zIndex: item.zIndex,
        },
      ]}
    >
      {item.type === 'image' && (
        <PhotoFrame uri={item.content} frameStyle={item.style || 'polaroid'} />
      )}
      {item.type === 'text' && (
        <StickyNote 
          text={item.content} 
          onTextChange={(text) => onUpdate({ content: text })}
          backgroundColor={item.noteColor}
          editable={isEditing}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
