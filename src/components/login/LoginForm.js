import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/LoginScreen.styles';

export default function LoginForm({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onTogglePassword,
  isLoading,
  error,
  onSubmit,
  onFocusField,
}) {
  const emailGroupY = useRef(0);
  const passwordGroupY = useRef(0);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Welcome Back</Text>
      <Text style={styles.cardSubtitle}>Sign in to access your courses</Text>

      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={18} color="#e05c7a" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View
        style={styles.inputGroup}
        onLayout={(e) => { emailGroupY.current = e.nativeEvent.layout.y; }}
      >
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={18} color="#9099b2" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#9099b2"
            value={email}
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onFocus={() => onFocusField?.(emailGroupY.current)}
          />
        </View>
      </View>

      <View
        style={styles.inputGroup}
        onLayout={(e) => { passwordGroupY.current = e.nativeEvent.layout.y; }}
      >
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={18} color="#9099b2" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#9099b2"
            value={password}
            onChangeText={onPasswordChange}
            secureTextEntry={!showPassword}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            onFocus={() => onFocusField?.(passwordGroupY.current)}
          />
          <TouchableOpacity onPress={onTogglePassword} style={styles.eyeButton}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#9099b2"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
