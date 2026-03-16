import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/LoginScreen.styles';

export default function BrandArea() {
  return (
    <View style={styles.brandArea}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>M</Text>
      </View>
      <Text style={styles.brandName}>Mariposa Training</Text>
      <Text style={styles.brandTagline}>Student Learning Portal</Text>
    </View>
  );
}
