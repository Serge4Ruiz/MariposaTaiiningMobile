import React from 'react';
import { View, Image } from 'react-native';
import styles from '../../styles/LoginScreen.styles';

export default function BrandArea() {
  return (
    <View style={styles.brandArea}>
      <Image
        source={require('../../../assets/transparentlogo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
}
