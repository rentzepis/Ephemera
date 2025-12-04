import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAddPage: () => void;
}

export default function PageIndicator({ currentPage, totalPages, onPageChange, onAddPage }: PageIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.dotContainer}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onPageChange(index)}
              style={[
                styles.dot,
                index === currentPage && styles.activeDot,
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity onPress={onAddPage} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Page</Text>
        </TouchableOpacity>
        
        <Text style={styles.pageNumber}>
          {currentPage + 1} / {totalPages}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20, // Below dynamic island on iOS, standard margin on Android
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#333',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  pageNumber: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
});
