import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StatusBar, RefreshControl, Alert } from 'react-native';
import DiplomaModal from '../components/coursePlayer/DiplomaModal';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getCatalog, getLecturesOrdered, getCourseThumbnail } from '../services/courseService';
import CoursesHeader from '../components/courses/CoursesHeader';
import CourseCard from '../components/courses/CourseCard';
import CourseNameModal from '../components/shared/CourseNameModal';
import styles from '../styles/CoursesScreen.styles';

export default function CoursesScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [diplomaLectureSoid, setDiplomaLectureSoid] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setError('');
      const [catalog, lectures] = await Promise.all([
        getCatalog(),
        getLecturesOrdered(user.Soid),
      ]);

      const lectureList = lectures ?? [];

      // Build a map from CourseSoid → latest lecture info
      // (a course may appear multiple times; prefer the most recent/relevant one)
      const lectureMap = {};
      lectureList.forEach((lec) => {
        const existing = lectureMap[lec.CourseSoid];
        // Prefer Incomplete > InQueue over others so viewed state is accurate
        if (!existing || lec.Status === 'Incomplete') {
          lectureMap[lec.CourseSoid] = lec;
        }
      });

      setLectures(lectureList);
      setCourses(catalog.map((course) => ({ ...course, lecture: lectureMap[course.Soid] ?? null })));
    } catch (e) {
      console.error('fetchCourses error:', e);
      setError('Failed to load courses. Pull down to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.Soid]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  // Re-fetch every time this screen comes into focus (e.g., returning from CoursePlayer)
  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, [fetchCourses])
  );

  const onRefresh = () => { setRefreshing(true); fetchCourses(); };

  const filteredCourses = courses.filter(
    (c) =>
      c.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.InstructorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWatch = (course) => {
    navigation.navigate('CoursePlayer', { course, lectures, memberSoid: user.Soid });
  };
  // Test button: navigate into CoursePlayer with openTest=true so it goes straight to the test
  const handleTest = (course) => {
    navigation.navigate('CoursePlayer', { course, lectures, memberSoid: user.Soid, openTest: true });
  };
  const handleDiploma = (course) => {
    const lectureSoid = course.lecture?.Soid;
    if (!lectureSoid) {
      Alert.alert('Not Available', 'No lecture record found for this course. Please watch the course first.');
      return;
    }
    setDiplomaLectureSoid(lectureSoid);
  };
  const handlePrint = handleDiploma; // kept for backward compat

  const renderCourseCard = ({ item }) => (
    <CourseCard
      item={item}
      thumbnailUrl={item.Number ? getCourseThumbnail(item.Number) : null}
      onNamePress={setSelectedCourseName}
      onWatch={handleWatch}
      onTest={handleTest}
      onDiploma={handleDiploma}
      onPrint={handleDiploma}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1f3c" />

      <CoursesHeader
        user={user}
        logout={logout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loading={loading}
        filteredCount={filteredCourses.length}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4f6ef7" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color="#e05c7a" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.Soid}
          renderItem={renderCourseCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#4f6ef7"
              colors={['#4f6ef7']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="search-outline" size={48} color="#343c68" />
              <Text style={styles.emptyTitle}>No courses found</Text>
              <Text style={styles.emptySubtitle}>Try a different search term</Text>
            </View>
          }
        />
      )}

      <CourseNameModal name={selectedCourseName} onClose={() => setSelectedCourseName('')} />

      <DiplomaModal
        visible={!!diplomaLectureSoid}
        lectureSoid={diplomaLectureSoid}
        onClose={() => setDiplomaLectureSoid(null)}
      />
    </View>
  );
}
