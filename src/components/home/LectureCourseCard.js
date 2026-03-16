import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/HomeScreen.styles';

const getStatusStyle = (status) => {
  switch (status) {
    case 'Completed': return { backgroundColor: '#1b3d2e' };
    case 'Incomplete': return { backgroundColor: '#3d2e1b' };
    case 'InQueue': return { backgroundColor: '#1b253d' };
    default: return { backgroundColor: '#2a2a3d' };
  }
};

export default function LectureCourseCard({ lecture, onNamePress }) {
  return (
    <View style={styles.courseCard}>
      <View style={styles.courseInfo}>
        <TouchableOpacity
          onPress={() => onNamePress(lecture.CourseName)}
          activeOpacity={0.7}
          style={{ flex: 1 }}
        >
          <Text style={styles.courseName} numberOfLines={2}>
            {lecture.CourseName}
          </Text>
        </TouchableOpacity>
        <View style={[styles.statusBadge, getStatusStyle(lecture.Status)]}>
          <Text style={styles.statusText}>{lecture.Status}</Text>
        </View>
      </View>
    </View>
  );
}
