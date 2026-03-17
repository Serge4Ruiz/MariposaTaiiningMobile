import { useState } from 'react';
import { Alert } from 'react-native';
import { getLectureTest, answerQuestions, gradeTest } from '../../services/courseService';

export function useTestManager(initialPhase = 'none') {
  const [testPhase, setTestPhase] = useState(initialPhase);
  const [testData, setTestData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testPassed, setTestPassed] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const resetTest = () => {
    setSelectedAnswers({});
    setTestPassed(null);
    setCurrentQuestionIndex(0);
  };

  const handleTakeTest = async (lectureSoidRef) => {
    const lsoid = lectureSoidRef.current;
    if (!lsoid) return;
    setTestPhase('loading');
    try {
      const data = await getLectureTest(lsoid);
      setTestData(data);
      resetTest();
      setTestPhase('taking');
    } catch (e) {
      console.error('getLectureTest error:', e);
      Alert.alert('Error', 'Could not load the test. Please try again.');
      setTestPhase('none');
    }
  };

  const handleSelectOption = (questionSoid, optionSoid) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionSoid]: optionSoid }));
  };

  const handleSubmitTest = async (lectureSoidRef) => {
    const lsoid = lectureSoidRef.current;
    if (!testData || !lsoid) return;

    const allAnswered = testData.Questions.every((q) => selectedAnswers[q.Soid]);
    if (!allAnswered) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting.');
      return;
    }

    setTestPhase('submitting');
    try {
      const answers = testData.Questions.map((q) => ({
        LectureSoid: lsoid,
        TestSoid: testData.Soid,
        QuestionSoid: q.Soid,
        OptionSoid: selectedAnswers[q.Soid],
      }));
      await answerQuestions(lsoid, answers);
      const passed = await gradeTest(lsoid);
      setTestPassed(passed);
      setTestPhase('result');
    } catch (e) {
      console.error('submitTest error:', e);
      Alert.alert('Error', 'Could not submit the test. Please try again.');
      setTestPhase('taking');
    }
  };

  const handleRetakeTest = () => {
    resetTest();
    setTestPhase('taking');
  };

  return { testPhase, testData, selectedAnswers, testPassed, currentQuestionIndex, setTestPhase, setCurrentQuestionIndex, handleTakeTest, handleSelectOption, handleSubmitTest, handleRetakeTest };
}
