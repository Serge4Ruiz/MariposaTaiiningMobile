import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../../styles/coursePlayer/DiplomaModal.styles';

export default function DiplomaErrorPhase({ errorMsg, onClose }) {
  return (
    <View style={styles.centeredBody}>
      <Ionicons name="alert-circle" size={56} color="#e05c7a" />
      <Text style={[styles.bodyText, { color: '#e05c7a' }]}>{errorMsg}</Text>
      <TouchableOpacity
        style={[styles.confirmBtn, { backgroundColor: '#4f6ef7', marginTop: 16 }]}
        onPress={onClose}
        activeOpacity={0.8}
      >
        <Text style={styles.confirmBtnText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}
