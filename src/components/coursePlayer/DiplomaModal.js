import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  View,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLectureInfo, signDiploma, downloadDiplomaStream } from '../../services/courseService';

import styles from '../../styles/coursePlayer/DiplomaModal.styles';
import DiplomaLoadingPhase from './diploma/DiplomaLoadingPhase';
import DiplomaAlreadySignedPhase from './diploma/DiplomaAlreadySignedPhase';
import DiplomaConfirmPhase from './diploma/DiplomaConfirmPhase';
import DiplomaErrorPhase from './diploma/DiplomaErrorPhase';

export default function DiplomaModal({ visible, lectureSoid, onClose }) {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState('idle'); // idle | loading | confirm | downloading | already-signed | error
  const [memberName, setMemberName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [typedName, setTypedName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  // Animated value to lift the sheet above the keyboard
  const sheetLift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(sheetLift, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === 'ios' ? e.duration ?? 250 : 200,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(sheetLift, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? e.duration ?? 250 : 200,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [sheetLift]);

  // Reset and fetch when modal opens
  useEffect(() => {
    if (!visible || !lectureSoid) return;
    setTypedName('');
    setErrorMsg('');
    setPhase('loading');

    (async () => {
      try {
        const info = await getLectureInfo(lectureSoid);
        setMemberName(info.MemberName ?? '');
        setCourseName(info.CourseName ?? '');

        if (info.DiplomaSignedOn) {
          setPhase('already-signed');
        } else {
          setPhase('confirm');
          setTimeout(() => inputRef.current?.focus(), 300);
        }
      } catch (e) {
        console.error('DiplomaModal load error:', e);
        setErrorMsg('Could not load diploma info. Please try again.');
        setPhase('error');
      }
    })();
  }, [visible, lectureSoid]);

  const namesMatch = typedName.trim().toLowerCase() === memberName.trim().toLowerCase();

  const handleClose = () => {
    Keyboard.dismiss();
    setPhase('idle');
    setTypedName('');
    setErrorMsg('');
    setCourseName('');
    onClose();
  };

  const handleConfirm = async () => {
    if (!namesMatch) return;
    Keyboard.dismiss();
    setPhase('downloading');
    setErrorMsg('');
    try {
      await signDiploma(lectureSoid, new Date().toISOString());
      await downloadDiplomaStream(lectureSoid);
      handleClose();
    } catch (e) {
      console.error('DiplomaModal confirm error:', e);
      setErrorMsg(e?.message ?? 'Download failed. Please try again.');
      setPhase('error');
    }
  };

  const handleDownloadSigned = async () => {
    setPhase('downloading');
    setErrorMsg('');
    try {
      await downloadDiplomaStream(lectureSoid);
      handleClose();
    } catch (e) {
      console.error('DiplomaModal download error:', e);
      setErrorMsg(e?.message ?? 'Download failed. Please try again.');
      setPhase('error');
    }
  };

  const renderContent = () => {
    if (phase === 'loading' || phase === 'downloading') {
      return <DiplomaLoadingPhase phase={phase} />;
    }
    if (phase === 'already-signed') {
      return (
        <DiplomaAlreadySignedPhase
          courseName={courseName}
          onDownload={handleDownloadSigned}
          onClose={handleClose}
        />
      );
    }
    if (phase === 'error') {
      return <DiplomaErrorPhase errorMsg={errorMsg} onClose={handleClose} />;
    }
    // phase === 'confirm'
    return (
      <DiplomaConfirmPhase
        memberName={memberName}
        courseName={courseName}
        typedName={typedName}
        setTypedName={setTypedName}
        namesMatch={namesMatch}
        inputRef={inputRef}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );
  };

  const sheetPaddingStyle = { paddingBottom: 48 + insets.bottom };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Full-screen dark backdrop — tap to dismiss keyboard */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* Sheet lifts above keyboard via animated bottom offset */}
      <Animated.View style={[styles.kvWrapper, { bottom: sheetLift }]}>
        <View style={[styles.sheet, sheetPaddingStyle]}>
          <View style={styles.handle} />
          {renderContent()}
        </View>
      </Animated.View>
    </Modal>
  );
}
