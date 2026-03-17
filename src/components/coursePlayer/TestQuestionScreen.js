import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import PlayerHeader from './PlayerHeader';
import QuestionOptionItem from './QuestionOptionItem';
import QuestionNavBar from './QuestionNavBar';
import styles from '../../styles/coursePlayer/coursePlayer.styles';

export default function TestQuestionScreen({
  courseName,
  testData,
  currentQuestionIndex,
  selectedAnswers,
  isSubmitting,
  onBack,
  onSelectOption,
  onPrev,
  onNext,
  onSubmit,
}) {
  const questions = testData?.Questions ?? [];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const currentQuestion = questions[currentQuestionIndex] ?? null;
  const currentAnswered = currentQuestion ? !!selectedAnswers[currentQuestion.Soid] : false;

  return (
    <View style={styles.container}>
      <PlayerHeader
        onBack={onBack}
        courseName={courseName}
        subtitle={`Final Test · Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
      />

      {/* Progress dots */}
      <View style={styles.questionDotsRow}>
        {questions.map((q, i) => (
          <View
            key={i}
            style={[
              styles.questionDot,
              i === currentQuestionIndex && styles.questionDotActive,
              selectedAnswers[q.Soid] && styles.questionDotAnswered,
            ]}
          />
        ))}
      </View>

      {/* Question + options */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        key={currentQuestionIndex}
      >
        {currentQuestion && (
          <View style={styles.questionCard}>
            <Text style={styles.questionIndex}>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </Text>
            <Text style={styles.questionBody}>{currentQuestion.Body}</Text>

            {currentQuestion.Options?.map((opt) => (
              <QuestionOptionItem
                key={opt.Soid}
                option={opt}
                isSelected={selectedAnswers[currentQuestion.Soid] === opt.Soid}
                isDisabled={isSubmitting}
                onPress={() => onSelectOption(currentQuestion.Soid, opt.Soid)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <QuestionNavBar
        currentIndex={currentQuestionIndex}
        isLastQuestion={isLastQuestion}
        currentAnswered={currentAnswered}
        isSubmitting={isSubmitting}
        onPrev={onPrev}
        onNext={onNext}
        onSubmit={onSubmit}
      />
    </View>
  );
}
