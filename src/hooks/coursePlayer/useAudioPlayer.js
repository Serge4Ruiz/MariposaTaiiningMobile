import { useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { adjustProgress, completeViewing } from '../../services/courseService';

export function useAudioPlayer({ slidesRef, currentSlideRef, lectureSoidRef, setCurrentSlide, setIsPlaying, setIsComplete }) {
  const soundRef = useRef(null);
  const isPlayingRef = useRef(false);
  const isTransitioningRef = useRef(false);

  const syncIsPlaying = useCallback((val) => {
    isPlayingRef.current = val;
    setIsPlaying(val);
  }, [setIsPlaying]);

  const playSlide = useCallback(async (slideIndex) => {
    const sound = soundRef.current;
    const slide = slidesRef.current[slideIndex];
    if (!slide || !sound) return;
    const startMs = parseFloat(slide.StartTime ?? slide.StartTimeSecD ?? 0) * 1000;
    try {
      await sound.setPositionAsync(startMs);
      await sound.playAsync();
      syncIsPlaying(true);
    } catch (e) {
      console.warn('playSlide error:', e);
    }
  }, [slidesRef, syncIsPlaying]);

  const advanceSlide = useCallback(async () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const idx = currentSlideRef.current;
    const lsoid = lectureSoidRef.current;
    const slide = slidesRef.current[idx];
    const sound = soundRef.current;

    if (lsoid && slide) {
      try {
        const endTime =
          parseFloat(slide.StartTime ?? slide.StartTimeSecD ?? 0) +
          parseFloat(slide.Duration ?? slide.DurationSecD ?? 0);
        await adjustProgress(lsoid, idx + 1, endTime);
      } catch (e) {
        console.warn('adjustProgress error (non-fatal):', e);
      }
    }

    const nextIdx = idx + 1;
    if (nextIdx >= slidesRef.current.length) {
      if (sound) { try { await sound.stopAsync(); } catch (_) {} }
      syncIsPlaying(false);
      if (lsoid) {
        try { await completeViewing(lsoid); } catch (e) {
          console.warn('completeViewing error (non-fatal):', e);
        }
      }
      setIsComplete(true);
      isTransitioningRef.current = false;
      return;
    }

    setCurrentSlide(nextIdx);
    currentSlideRef.current = nextIdx;
    isTransitioningRef.current = false;
    await playSlide(nextIdx);
  }, [currentSlideRef, lectureSoidRef, slidesRef, syncIsPlaying, setIsComplete, setCurrentSlide, playSlide]);

  const onPlaybackStatus = useCallback((status) => {
    if (!status.isLoaded) return;
    syncIsPlaying(status.isPlaying);
    if (!status.isPlaying || !isPlayingRef.current) return;

    const slide = slidesRef.current[currentSlideRef.current];
    if (!slide) return;

    const startSec = parseFloat(slide.StartTime ?? slide.StartTimeSecD ?? 0);
    const durationSec = parseFloat(slide.Duration ?? slide.DurationSecD ?? 0);
    const posSec = (status.positionMillis ?? 0) / 1000;

    if (posSec >= startSec + durationSec - 0.25) {
      soundRef.current?.pauseAsync?.();
      advanceSlide();
    }
  }, [slidesRef, currentSlideRef, syncIsPlaying, advanceSlide]);

  const loadAudio = useCallback(async (audioUrl) => {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl }, { shouldPlay: false }, onPlaybackStatus);
    soundRef.current = sound;
    return sound;
  }, [onPlaybackStatus]);

  const handlePlayPause = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound) return;
    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;
      if (status.isPlaying) {
        await sound.pauseAsync();
      } else {
        const slide = slidesRef.current[currentSlideRef.current];
        const startSec = parseFloat(slide?.StartTime ?? slide?.StartTimeSecD ?? 0);
        const durationSec = parseFloat(slide?.Duration ?? slide?.DurationSecD ?? 0);
        const posSec = (status.positionMillis ?? 0) / 1000;
        if (posSec >= startSec + durationSec - 0.5) {
          await playSlide(currentSlideRef.current);
        } else {
          await sound.playAsync();
        }
      }
    } catch (e) {
      console.warn('play/pause error:', e);
    }
  }, [slidesRef, currentSlideRef, playSlide]);

  const handlePrev = useCallback(async () => {
    const idx = currentSlideRef.current;
    if (idx === 0) return;
    const prev = idx - 1;
    try { await soundRef.current?.pauseAsync(); } catch (_) {}
    currentSlideRef.current = prev;
    setCurrentSlide(prev);
    await playSlide(prev);
  }, [currentSlideRef, setCurrentSlide, playSlide]);

  const handleNext = useCallback(async (isComplete) => {
    if (isComplete) return;
    await advanceSlide();
  }, [advanceSlide]);

  return { soundRef, loadAudio, playSlide, advanceSlide, handlePlayPause, handlePrev, handleNext };
}
