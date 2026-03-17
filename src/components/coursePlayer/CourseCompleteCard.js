import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/coursePlayer/coursePlayer.styles';

export default function CourseCompleteCard({ courseName, totalSlides, isTestAlreadyPassed, onTakeTest, onGetDiploma }) {
  return (
    <View style={styles.completeCard}>
      <Ionicons name="trophy" size={56} color="#2ecc71" />
      <Text style={styles.completeTitle}>Course Complete!</Text>
      <Text style={styles.completeSubtitle}>
        You have finished all {totalSlides} slides of{'\n'}
        <Text style={{ color: '#d8ddf5', fontWeight: '700' }}>{courseName}</Text>
      </Text>

      {isTestAlreadyPassed ? (
        <TouchableOpacity
          style={[styles.takeTestBtn, { backgroundColor: '#2ecc71' }]}
          onPress={onGetDiploma}
          activeOpacity={0.85}
        >
          <Text style={styles.takeTestBtnText}>🎓  Download Diploma</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.takeTestBtn}
          onPress={onTakeTest}
          activeOpacity={0.85}
        >
          <Text style={styles.takeTestBtnText}>📝  Take Final Test</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
