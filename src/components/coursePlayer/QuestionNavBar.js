import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/coursePlayer/coursePlayer.styles';

export default function QuestionNavBar({
  currentIndex,
  isLastQuestion,
  currentAnswered,
  isSubmitting,
  onPrev,
  onNext,
  onSubmit,
}) {
  return (
    <View style={styles.questionNavBar}>
      {/* Previous */}
      <TouchableOpacity
        style={[
          styles.questionNavBtn,
          (currentIndex === 0 || isSubmitting) && styles.questionNavBtnDisabled,
        ]}
        onPress={onPrev}
        disabled={currentIndex === 0 || isSubmitting}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={20} color="#d8ddf5" />
        <Text style={styles.questionNavBtnText}>Previous</Text>
      </TouchableOpacity>

      {/* Next OR Submit */}
      {isLastQuestion ? (
        <TouchableOpacity
          style={[
            styles.questionNavNextBtn,
            (!currentAnswered || isSubmitting) && styles.questionNavNextBtnDisabled,
          ]}
          onPress={onSubmit}
          disabled={!currentAnswered || isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.questionNavNextBtnText}>Submit Test</Text>
          }
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.questionNavNextBtn, !currentAnswered && styles.questionNavNextBtnMuted]}
          onPress={onNext}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Text style={styles.questionNavNextBtnText}>Next</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}
