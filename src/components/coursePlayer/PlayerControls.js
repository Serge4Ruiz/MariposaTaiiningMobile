import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/coursePlayer/coursePlayer.styles';

export default function PlayerControls({ isPlaying, canGoPrev, onPrev, onPlayPause, onNext }) {
  return (
    <View style={styles.controls}>
      {/* Previous */}
      <TouchableOpacity
        style={[styles.controlBtn, !canGoPrev && { opacity: 0.35 }]}
        onPress={onPrev}
        disabled={!canGoPrev}
        activeOpacity={0.7}
      >
        <Ionicons name="play-skip-back" size={22} color="#d8ddf5" />
      </TouchableOpacity>

      {/* Play / Pause */}
      <TouchableOpacity style={styles.playPauseBtn} onPress={onPlayPause} activeOpacity={0.8}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#fff" />
      </TouchableOpacity>

      {/* Next */}
      <TouchableOpacity style={styles.controlBtn} onPress={onNext} activeOpacity={0.7}>
        <Ionicons name="play-skip-forward" size={22} color="#d8ddf5" />
      </TouchableOpacity>
    </View>
  );
}
