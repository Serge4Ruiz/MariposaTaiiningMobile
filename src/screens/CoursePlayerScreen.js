import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useCourseLoader } from '../hooks/coursePlayer/useCourseLoader';
import { useAudioPlayer } from '../hooks/coursePlayer/useAudioPlayer';
import { useTestManager } from '../hooks/coursePlayer/useTestManager';

import PlayerHeader from '../components/coursePlayer/PlayerHeader';
import ProgressBar from '../components/coursePlayer/ProgressBar';
import SlideContent from '../components/coursePlayer/SlideContent';
import PlayerControls from '../components/coursePlayer/PlayerControls';
import CourseCompleteCard from '../components/coursePlayer/CourseCompleteCard';
import TestLoadingScreen from '../components/coursePlayer/TestLoadingScreen';
import TestQuestionScreen from '../components/coursePlayer/TestQuestionScreen';
import TestResultScreen from '../components/coursePlayer/TestResultScreen';
import DiplomaModal from '../components/coursePlayer/DiplomaModal';

import styles from '../styles/CoursePlayerScreen.styles';

export default function CoursePlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { course, lectures, memberSoid, openTest } = route.params;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [diplomaModalVisible, setDiplomaModalVisible] = useState(false);
  const currentSlideRef = useRef(0);
  const testRequestedRef = useRef(false);
  const { loading, error, slides, courseNumber, startSlide, audioUrl, lectureSoidRef } = useCourseLoader({
    course,
    lectures,
    memberSoid,
    skipCourseContent: openTest,
  });
  const slidesRef = useRef([]);
  const { loadAudio, playSlide, handlePlayPause, handlePrev, handleNext, stopAndRelease } = useAudioPlayer({ slidesRef, currentSlideRef, lectureSoidRef, setCurrentSlide, setIsPlaying, setIsComplete });
  const { testPhase, testData, selectedAnswers, testPassed, currentQuestionIndex, setTestPhase, setCurrentQuestionIndex, handleTakeTest, handleSelectOption, handleSubmitTest, handleRetakeTest } =
    useTestManager(openTest ? 'loading' : 'none');

  useEffect(() => { slidesRef.current = slides; }, [slides]);

  useEffect(() => { currentSlideRef.current = currentSlide; }, [currentSlide]);

  const handleExitCourse = useCallback(async () => {
    await stopAndRelease();
    navigation.goBack();
  }, [navigation, stopAndRelease]);

  useEffect(() => {
    if (loading || !audioUrl || openTest) return;
    let cancelled = false;
    const bootstrap = async () => {
      try {
        await loadAudio(audioUrl);
        if (cancelled) { await stopAndRelease(); return; }
        setCurrentSlide(startSlide);
        currentSlideRef.current = startSlide;
        await playSlide(startSlide);
      } catch (e) {
        console.error('Audio bootstrap error:', e);
      }
    };
    bootstrap();
    return () => {
      cancelled = true;
      stopAndRelease();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, audioUrl, openTest]);

  useEffect(() => {
    if (!openTest || loading || testRequestedRef.current || testPhase !== 'loading') return;
    testRequestedRef.current = true;
    handleTakeTest(lectureSoidRef);
  }, [openTest, loading, testPhase, handleTakeTest, lectureSoidRef]);

  useEffect(() => {
    if (testPhase !== 'none') {
      stopAndRelease();
    }
  }, [testPhase, stopAndRelease]);

  const isTestAlreadyPassed = lectures.some(
    (l) => l.Soid === lectureSoidRef.current && l.Status === 'Completed'
  );
  const headerSubtitle = !loading && !error && slides.length > 0
    ? `Slide ${currentSlide + 1} of ${slides.length}`
    : null;

  const openDiplomaModal = () => setDiplomaModalVisible(true);

  if (testPhase === 'loading') {
    return <TestLoadingScreen courseName={course.Name} onBack={handleExitCourse} />;
  }

  if (testPhase === 'taking' || testPhase === 'submitting') {
    return (
      <TestQuestionScreen
        courseName={course.Name}
        testData={testData}
        currentQuestionIndex={currentQuestionIndex}
        selectedAnswers={selectedAnswers}
        isSubmitting={testPhase === 'submitting'}
        onBack={() => openTest ? handleExitCourse() : setTestPhase('none')}
        onSelectOption={handleSelectOption}
        onPrev={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
        onNext={() => setCurrentQuestionIndex((i) => Math.min((testData?.Questions?.length ?? 1) - 1, i + 1))}
        onSubmit={() => handleSubmitTest(lectureSoidRef)}
      />
    );
  }

  if (testPhase === 'result') {
    return (
      <>
        <TestResultScreen
          courseName={course.Name}
          passed={testPassed === true}
          onRetake={handleRetakeTest}
          onBack={handleExitCourse}
          onGetDiploma={openDiplomaModal}
        />
        <DiplomaModal
          visible={diplomaModalVisible}
          lectureSoid={lectureSoidRef.current}
          onClose={() => setDiplomaModalVisible(false)}
        />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <PlayerHeader onBack={handleExitCourse} courseName={course.Name} subtitle={headerSubtitle} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4f6ef7" />
          <Text style={styles.loadingText}>Loading course…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color="#e05c7a" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleExitCourse}>
            <Text style={styles.retryBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ProgressBar currentSlide={currentSlide} totalSlides={slides.length} isComplete={isComplete} />
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {isComplete ? (
              <CourseCompleteCard
                courseName={course.Name}
                totalSlides={slides.length}
                isTestAlreadyPassed={isTestAlreadyPassed}
                onTakeTest={() => handleTakeTest(lectureSoidRef)}
                onGetDiploma={openDiplomaModal}
              />
            ) : (
              <SlideContent slide={slides[currentSlide]} slideIndex={currentSlide} courseNumber={courseNumber} />
            )}
          </ScrollView>
          {!isComplete && (
            <PlayerControls
              isPlaying={isPlaying}
              canGoPrev={currentSlide > 0}
              onPrev={handlePrev}
              onPlayPause={handlePlayPause}
              onNext={() => handleNext(isComplete)}
            />
          )}
          <DiplomaModal
            visible={diplomaModalVisible}
            lectureSoid={lectureSoidRef.current}
            onClose={() => setDiplomaModalVisible(false)}
          />
        </>
      )}
    </View>
  );
}

