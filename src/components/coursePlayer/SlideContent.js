import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSlideImageUrl } from '../../services/courseService';
import styles from '../../styles/coursePlayer/coursePlayer.styles';

function fmtTime(sec) {
  const s = Math.floor(sec ?? 0);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, '0')}`;
}

export default function SlideContent({ slide, slideIndex, courseNumber }) {
  if (!slide) return null;

  const startSec = slide.StartTime ?? slide.StartTimeSecD;
  const durationSec = slide.Duration ?? slide.DurationSecD;
  const transcriptText = (slide.Transcript || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{2,}/g, '\n')
    .trim();

  return (
    <>
      {/* Slide image */}
      {courseNumber != null && slide.SlideNumber != null && (
        <View style={styles.slideImageWrapper}>
          <Image
            source={{ uri: getSlideImageUrl(courseNumber, slide.SlideNumber) }}
            style={styles.slideImage}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Slide number badge */}
      <View style={styles.slideNumberBadge}>
        <Ionicons name="layers-outline" size={13} color="#9099b2" />
        <Text style={styles.slideNumberText}>
          Slide {(slide.SlideNumber ?? slideIndex) + 1}
          {slide.RequiresQuiz ? '  •  Quiz Required' : ''}
        </Text>
      </View>

      {/* Transcript */}
      <View style={styles.transcriptCard}>
        {/* <Text style={styles.transcriptLabel}>Transcript</Text> */}
        <Text style={styles.transcriptText}>
          {transcriptText || 'No content available'}
        </Text>
      </View>

      {/* Timing info */}
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>Start: {fmtTime(startSec)}</Text>
        <Text style={styles.timeText}>Duration: {fmtTime(durationSec)}</Text>
      </View>
    </>
  );
}
