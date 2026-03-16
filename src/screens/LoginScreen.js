import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import BrandArea from '../components/login/BrandArea';
import LoginForm from '../components/login/LoginForm';
import styles from '../styles/LoginScreen.styles';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) { setError('Please enter a valid email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
        e?.response?.data?.Message ||
        'Invalid email or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a1f3c" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BrandArea />
        <LoginForm
          email={email}
          onEmailChange={(t) => { setEmail(t); setError(''); }}
          password={password}
          onPasswordChange={(t) => { setPassword(t); setError(''); }}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          isLoading={isLoading}
          error={error}
          onSubmit={handleLogin}
        />
        <Text style={styles.footer}>
          © {new Date().getFullYear()} Mariposa Training. All rights reserved.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
