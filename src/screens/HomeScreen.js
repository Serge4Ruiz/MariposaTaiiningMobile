import React, { useState } from 'react';
import { View, Text, StatusBar, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import HomeHeader from '../components/home/HomeHeader';
import StatsRow from '../components/home/StatsRow';
import LectureCourseCard from '../components/home/LectureCourseCard';
import CourseNameModal from '../components/shared/CourseNameModal';
import styles from '../styles/HomeScreen.styles';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [selectedCourseName, setSelectedCourseName] = useState('');

  const lectures = user?.Lectures ?? [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1f3c" />

      <HomeHeader user={user} logout={logout} />

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <StatsRow
          completed={user?.CountCompleted ?? 0}
          incomplete={user?.CountIncomplete ?? 0}
          scheduled={user?.CountScheduled ?? 0}
        />

        <Text style={styles.sectionTitle}>My Courses</Text>
        {lectures.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No courses assigned yet.</Text>
          </View>
        ) : (
          lectures.map((lecture, index) => (
            <LectureCourseCard
              key={lecture.LectureSoid ?? index}
              lecture={lecture}
              onNamePress={setSelectedCourseName}
            />
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      <CourseNameModal name={selectedCourseName} onClose={() => setSelectedCourseName('')} />
    </View>
  );
}
