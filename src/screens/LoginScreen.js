import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Platform,
  ScrollView,
  StatusBar,
  Keyboard,
} from 'react-native';
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollViewRef = useRef(null);
  const focusedOffsetRef = useRef(0);

  useEffect(() => {
    // 'Will' events on iOS are smoother; Android only fires 'Did' events
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const kbHeight = e.endCoordinates.height;
      setKeyboardHeight(kbHeight);
      // Wait a tick for paddingBottom to apply, then scroll to focused field
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: focusedOffsetRef.current,
          animated: true,
        });
      }, 100);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Called by LoginForm when a field is focused — store its Y position
  const handleFocusOffset = (yOffset) => {
    focusedOffsetRef.current = yOffset;
    // If keyboard is already visible (switching between fields), scroll now
    if (keyboardHeight > 0) {
      scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
    }
  };

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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1f3c" />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          // Expand bottom padding by keyboard height so all content stays scrollable
          { paddingBottom: styles.scrollContent.paddingVertical + keyboardHeight },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
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
          onFocusField={handleFocusOffset}
        />
        <Text style={styles.footer}>
          © {new Date().getFullYear()} Mariposa Training. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
}
