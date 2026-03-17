import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/coursePlayer/coursePlayer.styles';

export default function PlayerHeader({ onBack, courseName, subtitle }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={24} color="#d8ddf5" />
      </TouchableOpacity>
      <View style={styles.headerTitleCol}>
        <Text style={styles.headerCourseName} numberOfLines={2}>
          {courseName}
        </Text>
        {subtitle ? (
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}
