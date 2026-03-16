import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';

import {
  getLectureSoid,
  findOrCreateLecture,
  getLectureInfo,
  getCourseDetail,
  getCourseAudioUrl,
  adjustProgress,
  getSlideImageUrl,
  createInstance,
} from '../services/courseService';
import styles from '../styles/CoursePlayerScreen.styles';

/** Choose the resume slide index from the Instances array.
 *  Pick the instance with the highest LatestSlide value.
 *  NOTE: Server returns LatestSlide as 1-based (1 = first slide),
 *  so we subtract 1 to convert to a 0-based array index. */
function getResumeSlide(instances) {
  if (!instances || instances.length === 0) return 0;
  const best = instances.reduce((prev, cur) =>
    (cur.LatestSlide ?? 0) > (prev.LatestSlide ?? 0) ? cur : prev
  );
  // Convert 1-based → 0-based, minimum 0
  return Math.max(0, (best.LatestSlide ?? 1) - 1);
}

function fmtTime(sec) {
  const s = Math.floor(sec ?? 0);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, '0')}`;
}

export default function CoursePlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { course, lectures, memberSoid } = route.params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [slides, setSlides] = useState([]);
  const [courseNumber, setCourseNumber] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const soundRef = useRef(null);
  const lectureSoidRef = useRef(null);
  const slidesRef = useRef([]);
  const currentSlideRef = useRef(0);
  const isPlayingRef = useRef(false);
  const isTransitioningRef = useRef(false);

  useEffect(() => { slidesRef.current = slides; }, [slides]);
  useEffect(() => { currentSlideRef.current = currentSlide; }, [currentSlide]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  const playSlide = useCallback(async (slideIndex, sound) => {
    const slide = slidesRef.current[slideIndex];
    if (!slide || !sound) return;

    const startMs = parseFloat(slide.StartTime ?? slide.StartTimeSecD ?? 0) * 1000;
    try {
      await sound.setPositionAsync(startMs);
      await sound.playAsync();
      setIsPlaying(true);
    } catch (e) {
      console.warn('playSlide error:', e);
    }
  }, []);

  const advanceSlide = useCallback(async (sound) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const idx = currentSlideRef.current;
    const lsoid = lectureSoidRef.current;
    const slide = slidesRef.current[idx];

    if (lsoid && slide) {
      try {
        const endTime = parseFloat(slide.StartTime ?? slide.StartTimeSecD ?? 0)
          + parseFloat(slide.Duration ?? slide.DurationSecD ?? 0);
        await adjustProgress(lsoid, idx + 1, endTime);
      } catch (e) {
        console.warn('adjustProgress error (non-fatal):', e);
      }
    }

    const nextIdx = idx + 1;
    if (nextIdx >= slidesRef.current.length) {
      // Course finished
      if (sound) {
        try { await sound.stopAsync(); } catch (_) { }
      }
      setIsPlaying(false);
      setIsComplete(true);
      isTransitioningRef.current = false;
      return;
    }

    // Move to next slide
    setCurrentSlide(nextIdx);
    isTransitioningRef.current = false;
    await playSlide(nextIdx, sound);
  }, [playSlide]);

  const onPlaybackStatus = useCallback((status) => {
    if (!status.isLoaded) return;
    setIsPlaying(status.isPlaying);

    if (!status.isPlaying || !isPlayingRef.current) return;

    const slide = slidesRef.current[currentSlideRef.current];
    if (!slide) return;

    const startSec = parseFloat(slide.StartTime ?? slide.StartTimeSecD ?? 0);
    const durationSec = parseFloat(slide.Duration ?? slide.DurationSecD ?? 0);
    const endSec = startSec + durationSec;
    const posSec = (status.positionMillis ?? 0) / 1000;

    if (posSec >= endSec - 0.25) {
      // Pause immediately so we don't double-fire
      soundRef.current?.pauseAsync?.();
      advanceSlide(soundRef.current);
    }
  }, [advanceSlide]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError('');

        // 1. Resolve lectureSoid — fall back to FindOrCreateLecture if not in local list
        let lsoid = getLectureSoid(lectures, course.Soid);
        if (!lsoid) {
          console.log('lectureSoid not found locally — calling FindOrCreateLecture');
          const created = await findOrCreateLecture(memberSoid, course.Soid);
          lsoid = created?.Soid;
        }
        if (!lsoid) throw new Error('Could not find or create a lecture for this course.');
        lectureSoidRef.current = lsoid;

        // 2. Create a fresh session instance, then fetch lecture info
        await createInstance(lsoid);
        const lectureInfo = await getLectureInfo(lsoid);
        const startSlide = getResumeSlide(lectureInfo?.Instances);

        console.log('====================================');
        console.log(startSlide,lsoid);
        console.log('====================================');

        console.log('lectureInfo:', JSON.stringify(lectureInfo));
        console.log('startSlide:', startSlide, 'lsoid:', lsoid);


        // 3. Course detail → slides + channel
        const courseDetail = await getCourseDetail(course.Soid);
        const slideList = courseDetail?.Slides ?? [];
        if (slideList.length === 0) throw new Error('No slides found for this course.');

        const channel = courseDetail.Channel;
        if (!channel) throw new Error('Course has no audio channel.');

        const audioUrl = getCourseAudioUrl(channel);

        if (cancelled) return;

        slidesRef.current = slideList;
        setSlides(slideList);
        setCourseNumber(courseDetail.Number ?? course.Number ?? null);

        const safeStart = Math.min(startSlide, slideList.length - 1);
        setCurrentSlide(safeStart);
        currentSlideRef.current = safeStart;

        // 4. Load audio (no auto-play yet — we seek then play below)
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false },
          onPlaybackStatus
        );

        if (cancelled) {
          sound.unloadAsync();
          return;
        }

        soundRef.current = sound;
        setLoading(false);

        // Auto-start from the resume slide
        await playSlide(safeStart, sound);
      } catch (e) {
        console.error('CoursePlayer load error:', e);
        if (!cancelled) setError(e.message || 'Failed to load course. Please try again.');
        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      soundRef.current?.unloadAsync?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Play / Pause toggle
  const handlePlayPause = async () => {
    const sound = soundRef.current;
    if (!sound) return;
    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;
      if (status.isPlaying) {
        await sound.pauseAsync();
      } else {
        // If at the very end of a slide, restart the slide
        const slide = slidesRef.current[currentSlideRef.current];
        const startSec = parseFloat(slide?.StartTime ?? slide?.StartTimeSecD ?? 0);
        const durationSec = parseFloat(slide?.Duration ?? slide?.DurationSecD ?? 0);
        const endSec = startSec + durationSec;
        const posSec = (status.positionMillis ?? 0) / 1000;
        if (posSec >= endSec - 0.5) {
          await playSlide(currentSlideRef.current, sound);
        } else {
          await sound.playAsync();
        }
      }
    } catch (e) {
      console.warn('play/pause error:', e);
    }
  };

  // Go to previous slide
  const handlePrev = async () => {
    const idx = currentSlideRef.current;
    if (idx === 0) return;
    const prev = idx - 1;

    // Pause first so the status listener doesn't fire mid-seek
    try { await soundRef.current?.pauseAsync(); } catch (_) { }

    // Update ref synchronously before playSlide so the listener sees the right slide
    currentSlideRef.current = prev;
    setCurrentSlide(prev);
    await playSlide(prev, soundRef.current);
  };

  // Go to next slide manually
  const handleNext = async () => {
    if (isComplete) return;
    await advanceSlide(soundRef.current);
  };

  // Render
  const slide = slides[currentSlide];
  const progressPct = slides.length > 0 ? (currentSlide / slides.length) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#d8ddf5" />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerCourseName} numberOfLines={2}>{course.Name}</Text>
          {!loading && !error && slides.length > 0 && (
            <Text style={styles.headerSubtitle}>
              Slide {currentSlide + 1} of {slides.length}
            </Text>
          )}
        </View>
      </View>

      {/* Loading */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4f6ef7" />
          <Text style={styles.loadingText}>Loading course…</Text>
        </View>
      ) : error ? (
        /* Error */
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color="#e05c7a" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.retryBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Progress bar */}
          <View style={styles.progressBarWrap}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>
                {isComplete ? 'Complete' : `Slide ${currentSlide + 1} / ${slides.length}`}
              </Text>
              <Text style={styles.progressPercent}>{Math.round(progressPct)}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
          </View>

          {/* Slide content */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {isComplete ? (
              <View style={styles.completeCard}>
                <Ionicons name="checkmark-circle" size={56} color="#2ecc71" />
                <Text style={styles.completeTitle}>Course Complete!</Text>
                <Text style={styles.completeSubtitle}>
                  You have finished all {slides.length} slides of{'\n'}
                  <Text style={{ color: '#d8ddf5', fontWeight: '700' }}>{course.Name}</Text>
                </Text>
              </View>
            ) : slide ? (
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

                {/* Slide badge */}
                <View style={styles.slideNumberBadge}>
                  <Ionicons name="layers-outline" size={13} color="#9099b2" />
                  <Text style={styles.slideNumberText}>
                    Slide {(slide.SlideNumber ?? currentSlide) + 1}
                    {slide.RequiresQuiz ? '  •  Quiz Required' : ''}
                  </Text>
                </View>

                {/* Transcript */}
                <View style={styles.transcriptCard}>
                  <Text style={styles.transcriptLabel}>Transcript</Text>
                  <Text style={styles.transcriptText}>
                    {slide.Transcript
                      ? slide.Transcript.replace(/<[^>]+>/g, '') // strip HTML tags
                      : '—'}
                  </Text>
                </View>

                {/* Timing info */}
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>
                    Start: {fmtTime(slide.StartTime ?? slide.StartTimeSecD)}
                  </Text>
                  <Text style={styles.timeText}>
                    Duration: {fmtTime(slide.Duration ?? slide.DurationSecD)}
                  </Text>
                </View>
              </>
            ) : null}
          </ScrollView>

          {/* Controls */}
          {!isComplete && (
            <View style={styles.controls}>
              {/* Prev */}
              <TouchableOpacity
                style={[styles.controlBtn, currentSlide === 0 && { opacity: 0.35 }]}
                onPress={handlePrev}
                disabled={currentSlide === 0}
                activeOpacity={0.7}
              >
                <Ionicons name="play-skip-back" size={22} color="#d8ddf5" />
              </TouchableOpacity>

              {/* Play / Pause */}
              <TouchableOpacity style={styles.playPauseBtn} onPress={handlePlayPause} activeOpacity={0.8}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#fff" />
              </TouchableOpacity>

              {/* Next */}
              <TouchableOpacity
                style={styles.controlBtn}
                onPress={handleNext}
                activeOpacity={0.7}
              >
                <Ionicons name="play-skip-forward" size={22} color="#d8ddf5" />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}
