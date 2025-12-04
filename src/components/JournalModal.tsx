import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { CanvasItem } from '../types';

interface JournalModalProps {
  visible: boolean;
  item: CanvasItem | null;
  onClose: () => void;
  onSave: (itemId: string, journalEntry: string, noteContent?: string) => void;
  onDelete: (itemId: string) => void;
}

export default function JournalModal({
  visible,
  item,
  onClose,
  onSave,
  onDelete,
}: JournalModalProps) {
  const [journalText, setJournalText] = useState(item?.journalEntry || '');
  const [noteContent, setNoteContent] = useState(item?.type === 'text' ? item.content : '');

  React.useEffect(() => {
    if (item) {
      setJournalText(item.journalEntry || '');
      setNoteContent(item.type === 'text' ? item.content : '');
    }
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    if (item.type === 'text') {
      // For text notes, update both content and journal entry
      onSave(item.id, journalText, noteContent);
    } else {
      onSave(item.id, journalText);
    }
    onClose();
  };

  const handleDelete = () => {
    onDelete(item.id);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).toUpperCase().replace(',', '');
    
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).toUpperCase();
    
    return `${dateStr} ${timeStr}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={80} style={styles.blurContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.card}>
            {/* Date Stamp */}
            <View style={styles.header}>
              <Text style={styles.dateStamp}>{formatDate(item.dateAdded)}</Text>
              
              {/* Close Button */}
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Content Inputs */}
            <ScrollView style={styles.scrollContainer}>
              {item.type === 'text' ? (
                <>
                  <Text style={styles.sectionLabel}>Note Text</Text>
                  <TextInput
                    style={[styles.journalInput, styles.noteContentInput]}
                    value={noteContent}
                    onChangeText={setNoteContent}
                    placeholder="Write your note..."
                    placeholderTextColor="#999"
                    multiline
                    textAlignVertical="top"
                  />
                </>
              ) : (
                <TextInput
                  style={styles.journalInput}
                  value={journalText}
                  onChangeText={setJournalText}
                  placeholder="What do you remember about this?"
                  placeholderTextColor="#999"
                  multiline
                  textAlignVertical="top"
                />
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.button, styles.deleteButton]}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.button, styles.saveButton]}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: 350,
    height: 500,
    backgroundColor: '#f9f7f0',
    borderRadius: 8,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateStamp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  journalInput: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    minHeight: 200,
  },
  noteContentInput: {
    minHeight: 80,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#333',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
