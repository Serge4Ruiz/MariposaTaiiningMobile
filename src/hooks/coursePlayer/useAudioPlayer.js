import { useRef, useCallback } from 'react';
import { createAudioPlayer, setAudioModeAsync, setIsAudioActiveAsync } from 'expo-audio';
import { adjustProgress, completeViewing } from '../../services/courseService';

export function useAudioPlayer({ slidesRef, currentSlideRef, lectureSoidRef, setCurrentSlide, setIsPlaying, setIsComplete }) {
  const soundRef = useRef(null);
  const statusSubscriptionRef = useRef(null);
  const isPlayingRef = useRef(false);
  const isTransitioningRef = useRef(false);

  const syncIsPlaying = useCallback((val) => {
    isPlayingRef.current = val;
    setIsPlaying(val);
  }, [setIsPlaying]);

  const playSlide = useCallback(async (slideIndex) => {
    const player = soundRef.current;
    const slide = slidesRef.current[slideIndex];
    if (!slide || !player) return;
    const startMs = parseFloat(slide.StartTime ?? slide.StartTimeSecD ?? 0) * 1000;
    try {
      await player.seekTo(startMs / 1000);
      player.play();
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
    const player = soundRef.current;

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
      if (player) {
        try {
          player.pause();
        } catch (_) { }
      }
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
    syncIsPlaying(status.playing);
    if (!status.playing || !isPlayingRef.current) return;

    const slide = slidesRef.current[currentSlideRef.current];
    if (!slide) return;

    const startSec = parseFloat(slide.StartTime ?? slide.StartTimeSecD ?? 0);
    const durationSec = parseFloat(slide.Duration ?? slide.DurationSecD ?? 0);
    const posSec = status.currentTime ?? 0;

    if (posSec >= startSec + durationSec - 0.25) {
      try {
        soundRef.current?.pause?.();
      } catch (_) { }
      advanceSlide();
    }
  }, [slidesRef, currentSlideRef, syncIsPlaying, advanceSlide]);

  const stopAndRelease = useCallback(async () => {
    syncIsPlaying(false);
    isTransitioningRef.current = false;

    try {
      statusSubscriptionRef.current?.remove?.();
    } catch (_) { }
    statusSubscriptionRef.current = null;

    try {
      soundRef.current?.pause?.();
    } catch (_) { }

    try {
      soundRef.current?.remove?.();
    } catch (_) { }
    soundRef.current = null;

    try {
      await setIsAudioActiveAsync(false);
    } catch (_) { }
  }, [syncIsPlaying]);

  const loadAudio = useCallback(async (audioUrl) => {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      allowsRecording: false,
      interruptionMode: 'doNotMix',
      shouldRouteThroughEarpiece: false,
    });

    await stopAndRelease();
    await setIsAudioActiveAsync(true);

    const player = createAudioPlayer({ uri: audioUrl }, { updateInterval: 200 });
    statusSubscriptionRef.current = player.addListener('playbackStatusUpdate', onPlaybackStatus);
    soundRef.current = player;
    return player;
  }, [onPlaybackStatus, stopAndRelease]);

  const handlePlayPause = useCallback(async () => {
    const player = soundRef.current;
    if (!player) return;
    try {
      if (!player.isLoaded) return;
      if (player.playing) {
        player.pause();
      } else {
        const slide = slidesRef.current[currentSlideRef.current];
        const startSec = parseFloat(slide?.StartTime ?? slide?.StartTimeSecD ?? 0);
        const durationSec = parseFloat(slide?.Duration ?? slide?.DurationSecD ?? 0);
        const posSec = player.currentTime ?? 0;
        if (posSec >= startSec + durationSec - 0.5) {
          await playSlide(currentSlideRef.current);
        } else {
          player.play();
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
    try { soundRef.current?.pause?.(); } catch (_) { }
    currentSlideRef.current = prev;
    setCurrentSlide(prev);
    await playSlide(prev);
  }, [currentSlideRef, setCurrentSlide, playSlide]);

  const handleNext = useCallback(async (isComplete) => {
    if (isComplete) return;
    await advanceSlide();
  }, [advanceSlide]);

  return { soundRef, loadAudio, playSlide, advanceSlide, handlePlayPause, handlePrev, handleNext, stopAndRelease };
}
