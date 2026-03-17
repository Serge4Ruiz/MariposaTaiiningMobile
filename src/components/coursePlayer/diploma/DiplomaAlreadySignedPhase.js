import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../../styles/coursePlayer/DiplomaModal.styles';

export default function DiplomaAlreadySignedPhase({ courseName, onDownload, onClose }) {
  return (
    <View style={styles.centeredBody}>
      <Ionicons name="ribbon" size={64} color="#4f6ef7" />
      <Text style={[styles.title, { marginBottom: 4 }]}>Diploma Ready</Text>

      {!!courseName && (
        <Text style={[styles.bodySubText, { marginBottom: 4 }]}>{courseName}</Text>
      )}

      <Text style={styles.bodySubText}>
        Your diploma was already signed. Tap below to download it.
      </Text>

      <TouchableOpacity
        style={[styles.confirmBtn, { marginTop: 20 }]}
        onPress={onDownload}
        activeOpacity={0.8}
      >
        <Ionicons name="cloud-download-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.confirmBtnText}>Download Diploma</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
