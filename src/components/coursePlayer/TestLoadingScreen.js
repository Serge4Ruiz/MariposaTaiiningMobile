import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import PlayerHeader from './PlayerHeader';
import styles from '../../styles/coursePlayer/coursePlayer.styles';

export default function TestLoadingScreen({ courseName, onBack }) {
  return (
    <View style={styles.container}>
      <PlayerHeader onBack={onBack} courseName={courseName} subtitle="Loading Test…" />
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f6ef7" />
        <Text style={styles.loadingText}>Loading test…</Text>
      </View>
    </View>
  );
}
