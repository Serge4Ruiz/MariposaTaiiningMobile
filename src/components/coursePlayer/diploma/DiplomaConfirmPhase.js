import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../../styles/coursePlayer/DiplomaModal.styles';

export default function DiplomaConfirmPhase({
  memberName,
  courseName,
  typedName,
  setTypedName,
  namesMatch,
  inputRef,
  onConfirm,
  onClose,
}) {
  return (
    <>
      <View style={styles.iconRow}>
        <Ionicons name="school" size={48} color="#4f6ef7" />
      </View>

      <Text style={styles.title}>Get Certificate</Text>

      {!!courseName && (
        <View style={styles.coursePill}>
          <Text style={styles.coursePillLabel}>COURSE</Text>
          <Text style={styles.coursePillValue} numberOfLines={2}>{courseName}</Text>
        </View>
      )}

      <Text style={styles.subtitle}>
        To claim your diploma, please type your full name exactly as shown below to confirm your identity.
      </Text>

      {/* Member name pill */}
      <View style={styles.namePill}>
        <Text style={styles.namePillLabel}>YOUR NAME ON RECORD</Text>
        <Text style={styles.namePillValue}>{memberName}</Text>
      </View>

      <Text style={styles.inputLabel}>Enter your name below</Text>
      <TextInput
        ref={inputRef}
        style={[styles.input, namesMatch && typedName.length > 0 && styles.inputValid]}
        value={typedName}
        onChangeText={setTypedName}
        placeholder="Type your full name…"
        placeholderTextColor="#5a6080"
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={onConfirm}
      />

      {typedName.length > 0 && !namesMatch && (
        <Text style={styles.mismatchHint}>Name doesn't match — please check capitalisation.</Text>
      )}

      {typedName.length > 0 && namesMatch && (
        <Text style={styles.matchHint}>✓ Name confirmed</Text>
      )}

      <TouchableOpacity
        style={[styles.confirmBtn, !namesMatch && styles.confirmBtnDisabled]}
        onPress={onConfirm}
        disabled={!namesMatch}
        activeOpacity={0.8}
      >
        <Ionicons name="cloud-download-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.confirmBtnText}>Get Certificate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </>
  );
}
