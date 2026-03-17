import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PlayerHeader from './PlayerHeader';
import styles from '../../styles/coursePlayer/coursePlayer.styles';

export default function TestResultScreen({ courseName, passed, onRetake, onBack, onGetDiploma }) {
  return (
    <View style={styles.container}>
      <PlayerHeader onBack={onBack} courseName={courseName} subtitle="Test Result" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.resultCard, passed ? styles.resultCardPass : styles.resultCardFail]}>
          <Ionicons
            name={passed ? 'shield-checkmark' : 'close-circle'}
            size={64}
            color={passed ? '#2ecc71' : '#e05c7a'}
          />
          <Text style={[styles.resultTitle, passed ? styles.resultTitlePass : styles.resultTitleFail]}>
            {passed ? 'Congratulations!' : 'Not Quite!'}
          </Text>
          <Text style={styles.resultSubtitle}>
            {passed ? 'You passed the final test for\n' : 'You did not pass the test for\n'}
            <Text style={{ color: '#d8ddf5', fontWeight: '700' }}>{courseName}</Text>
          </Text>

          {!passed && (
            <TouchableOpacity style={styles.retakeBtn} onPress={onRetake} activeOpacity={0.8}>
              <Text style={styles.retakeBtnText}>Retake Test</Text>
            </TouchableOpacity>
          )}

          {passed && (
            <TouchableOpacity
              style={[styles.retakeBtn, { backgroundColor: '#2ecc71' }]}
              onPress={onGetDiploma}
              activeOpacity={0.8}
            >
              <Text style={styles.retakeBtnText}>🎓  Download Diploma</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
