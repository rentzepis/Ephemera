import React, { useCallback, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Dimensions, Alert, ScrollView, NativeScrollEvent, NativeSyntheticEvent, GestureResponderEvent } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Canvas from './src/components/Canvas';
import Toolbar from './src/components/Toolbar';
import JournalModal from './src/components/JournalModal';
import Menu from './src/components/Menu';
import PageIndicator from './src/components/PageIndicator';
import { usePersistedPages } from './src/hooks/usePersistedPages';
import { CanvasItem } from './src/types';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Edge threshold for page swiping (pixels from left/right edge)
const SWIPE_EDGE_THRESHOLD = 50;

export default function App() {
  const {
    pages,
    currentPage,
    currentPageIndex,
    isLoading: isLoadingPages,
    setCurrentPageIndex,
    addPage,
    deletePage,
    addItem,
    updateItem,
    deleteItem,
    bringToFront,
    clearAll,
  } = usePersistedPages();
  
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const touchStartX = useRef<number>(0);

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    // You can add custom fonts here later
    // 'PatrickHand': require('./assets/fonts/PatrickHand-Regular.ttf'),
    // 'PlayfairDisplay': require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !isLoadingPages) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoadingPages]);

  const handleAddPhoto = (uri: string) => {
    // Generate random position and rotation for new photo
    const randomX = Math.random() * (SCREEN_WIDTH - 220) + 10;
    const randomY = Math.random() * (SCREEN_HEIGHT - 320) + 50;
    const randomRotation = (Math.random() - 0.5) * 20; // -10 to 10 degrees

    const newItem: CanvasItem = {
      id: `item_${Date.now()}`,
      type: 'image',
      content: uri,
      x: randomX,
      y: randomY,
      rotation: randomRotation,
      scale: 1.0,
      zIndex: currentPage.items.length,
      style: 'polaroid',
      dateAdded: new Date().toISOString(),
    };

    addItem(newItem);
  };

  const handleAddText = () => {
    // Generate random position and rotation for new note
    const randomX = Math.random() * (SCREEN_WIDTH - 200) + 10;
    const randomY = Math.random() * (SCREEN_HEIGHT - 200) + 50;
    const randomRotation = (Math.random() - 0.5) * 15; // -7.5 to 7.5 degrees

    const newItem: CanvasItem = {
      id: `item_${Date.now()}`,
      type: 'text',
      content: '',
      x: randomX,
      y: randomY,
      rotation: randomRotation,
      scale: 1.0,
      zIndex: currentPage.items.length,
      dateAdded: new Date().toISOString(),
    };

    addItem(newItem);
  };

  const handleClearCanvas = () => {
    Alert.alert(
      'Clear Page',
      'Are you sure you want to delete all items on this page? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Page',
          style: 'destructive',
          onPress: clearAll,
        },
      ]
    );
  };

  const handleLongPress = (itemId: string) => {
    // Long press just brings to front now, journal handled separately
    bringToFront(itemId);
  };

  const handleJournalOpen = (itemId: string) => {
    // Open journal modal for photos on long-press
    const item = currentPage.items.find(i => i.id === itemId);
    if (item?.type === 'image') {
      setSelectedItemId(itemId);
    }
  };

  const handleSaveJournal = (itemId: string, journalEntry: string) => {
    updateItem(itemId, { journalEntry });
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItem(itemId);
    setSelectedItemId(null);
  };

  const handlePageChange = (newPageIndex: number) => {
    setCurrentPageIndex(newPageIndex);
    scrollViewRef.current?.scrollTo({
      x: newPageIndex * SCREEN_WIDTH,
      animated: true,
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newPageIndex = Math.round(offsetX / SCREEN_WIDTH);
    if (newPageIndex !== currentPageIndex && newPageIndex >= 0 && newPageIndex < pages.length) {
      setCurrentPageIndex(newPageIndex);
    }
  };

  const handleTouchStart = (event: GestureResponderEvent) => {
    const touchX = event.nativeEvent.pageX;
    touchStartX.current = touchX;
    
    // Only enable scrolling if touch starts near the edges
    const isNearLeftEdge = touchX < SWIPE_EDGE_THRESHOLD;
    const isNearRightEdge = touchX > SCREEN_WIDTH - SWIPE_EDGE_THRESHOLD;
    
    setScrollEnabled(isNearLeftEdge || isNearRightEdge);
  };

  const selectedItem = currentPage?.items.find(item => item.id === selectedItemId) || null;

  if (!fontsLoaded || isLoadingPages) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <Menu
          onClearCanvas={handleClearCanvas}
        />
        
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          scrollEnabled={scrollEnabled}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          style={styles.scrollView}
        >
          {pages.map((page) => (
            <View key={page.id} style={styles.pageContainer}>
              <Canvas
                items={page.items}
                onUpdateItem={updateItem}
                onBringToFront={handleLongPress}
                onJournalOpen={handleJournalOpen}
              />
            </View>
          ))}
        </ScrollView>

        <PageIndicator
          currentPage={currentPageIndex}
          totalPages={pages.length}
          onPageChange={handlePageChange}
          onAddPage={addPage}
        />
        
        <Toolbar onAddPhoto={handleAddPhoto} onAddText={handleAddText} />
        
        <JournalModal
          visible={selectedItemId !== null}
          item={selectedItem}
          onClose={() => setSelectedItemId(null)}
          onSave={handleSaveJournal}
          onDelete={handleDeleteItem}
        />
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f4f1ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
