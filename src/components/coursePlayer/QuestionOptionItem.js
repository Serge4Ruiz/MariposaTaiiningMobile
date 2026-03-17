import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import styles from '../../styles/coursePlayer/coursePlayer.styles';

export default function QuestionOptionItem({ option, isSelected, isDisabled, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.optionChip, isSelected && styles.optionChipSelected]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
    >
      <View style={[styles.optionDot, isSelected && styles.optionDotSelected]}>
        {isSelected && <View style={styles.optionDotInner} />}
      </View>
      <Text style={[styles.optionBody, isSelected && styles.optionBodySelected]}>
        {option.Body}
      </Text>
    </TouchableOpacity>
  );
}
