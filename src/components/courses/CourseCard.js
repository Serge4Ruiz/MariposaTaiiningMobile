import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/CoursesScreen.styles';

const formatDuration = (minutes) => {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export default function CourseCard({ item, thumbnailUrl, onNamePress, onWatch, onTest, onDiploma, onPrint }) {
  const lec = item.lecture;
  const viewed = lec?.Viewed === true;
  const status = lec?.Status;
  const [imageLoading, setImageLoading] = useState(true);

  const watchBtn = (
    <TouchableOpacity
      key="watch"
      style={[styles.actionBtn, styles.watchBtn]}
      onPress={() => onWatch(item)}
      activeOpacity={0.8}
    >
      <Ionicons name="play-circle-outline" size={14} color="#fff" />
      <Text style={styles.actionBtnText}>Watch</Text>
    </TouchableOpacity>
  );

  const renderButtons = () => {
    if (viewed && status === 'Incomplete') {
      return (
        <View style={styles.buttonsRow}>
          {watchBtn}
          <TouchableOpacity
            style={[styles.actionBtn, styles.testBtn]}
            onPress={() => onTest(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text-outline" size={14} color="#fff" />
            <Text style={styles.actionBtnText}>Test</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (viewed && status === 'Completed') {
      return (
        <View style={styles.buttonsRow}>
          {watchBtn}
          <TouchableOpacity
            style={[styles.actionBtn, styles.printBtn]}
            onPress={() => (onDiploma ?? onPrint)?.(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="school-outline" size={14} color="#fff" />
            <Text style={styles.actionBtnText}>Diploma</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return <View style={styles.buttonsRow}>{watchBtn}</View>;
  };

  return (
    <View style={styles.card}>
      {/* Thumbnail */}
      {thumbnailUrl ? (
        <View style={styles.thumbnailWrapper}>
          {imageLoading && (
            <View style={styles.thumbnailLoader}>
              <ActivityIndicator color="#4f6ef7" size="small" />
            </View>
          )}
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </View>
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <Ionicons name="book-outline" size={28} color="#4f6ef7" />
        </View>
      )}

      <View style={styles.cardRight}>
        <TouchableOpacity onPress={() => onNamePress(item.Name)} activeOpacity={0.7}>
          <Text style={styles.courseName} numberOfLines={2}>{item.Name}</Text>
        </TouchableOpacity>

        {item.InstructorName ? (
          <View style={styles.metaRow}>
            <Ionicons name="person-outline" size={12} color="#9099b2" />
            <Text style={styles.metaText} numberOfLines={1}>{item.InstructorName}</Text>
          </View>
        ) : null}

        <View style={styles.pillsRow}>
          {item.Length ? (
            <View style={styles.pill}>
              <Ionicons name="time-outline" size={11} color="#9099b2" />
              <Text style={styles.pillText}>{formatDuration(item.Length)}</Text>
            </View>
          ) : null}
          {item.CeuCount ? (
            <View style={styles.pill}>
              <Ionicons name="ribbon-outline" size={11} color="#9099b2" />
              <Text style={styles.pillText}>{item.CeuCount} CEU</Text>
            </View>
          ) : null}
        </View>

        {renderButtons()}
      </View>
    </View>
  );
}
