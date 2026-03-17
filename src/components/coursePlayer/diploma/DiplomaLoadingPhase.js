import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import styles from '../../../styles/coursePlayer/DiplomaModal.styles';

export default function DiplomaLoadingPhase({ phase }) {
  const isDownloading = phase === 'downloading';
  return (
    <View style={styles.centeredBody}>
      <ActivityIndicator size="large" color={isDownloading ? '#2ecc71' : '#4f6ef7'} />
      <Text style={styles.bodyText}>
        {isDownloading ? 'Loading please wait…' : 'Loading diploma info…'}
      </Text>
    </View>
  );
}
