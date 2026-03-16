import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/CourseNameModal.styles';

export default function CourseNameModal({ name, onClose }) {
  return (
    <Modal
      visible={!!name}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.card}>
          <Text style={styles.label}>Course Name</Text>
          <Text style={styles.name}>{name}</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
