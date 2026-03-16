import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/HomeScreen.styles';

export default function StatsRow({ completed, incomplete, scheduled }) {
  return (
    <View style={styles.statsRow}>
      <View style={[styles.statCard, { borderTopColor: '#4f6ef7' }]}>
        <Text style={styles.statNumber}>{completed}</Text>
        <Text style={styles.statLabel}>Completed</Text>
      </View>
      <View style={[styles.statCard, { borderTopColor: '#f7c34f' }]}>
        <Text style={styles.statNumber}>{incomplete}</Text>
        <Text style={styles.statLabel}>In Progress</Text>
      </View>
      <View style={[styles.statCard, { borderTopColor: '#4ff7a0' }]}>
        <Text style={styles.statNumber}>{scheduled}</Text>
        <Text style={styles.statLabel}>Scheduled</Text>
      </View>
    </View>
  );
}
