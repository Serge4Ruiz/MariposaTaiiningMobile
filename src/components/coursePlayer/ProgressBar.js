import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/coursePlayer/coursePlayer.styles';

export default function ProgressBar({ currentSlide, totalSlides, isComplete }) {
  const pct = totalSlides > 0
    ? (isComplete ? 100 : ((currentSlide + 1) / totalSlides) * 100)
    : 0;

  return (
    <View style={styles.progressBarWrap}>
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>
          {isComplete ? 'Complete' : `Slide ${currentSlide + 1} / ${totalSlides}`}
        </Text>
        <Text style={styles.progressPercent}>{Math.round(pct)}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}
