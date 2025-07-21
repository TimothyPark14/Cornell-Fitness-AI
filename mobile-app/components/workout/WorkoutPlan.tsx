import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { CheckCircle, Trophy, Play, Minimize2 } from 'lucide-react-native';
import { StyleSheet } from 'react-native'
import { ScheduleResponse } from '@/types/workout'

type WorkoutModalProps = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  equipment?: string[];
  onFinishWorkout?: () => void;
  selectedWorkout: ScheduleResponse;
};

const CornellWorkoutModal = ({
  onFinishWorkout = () => {},
  showModal,
  setShowModal,
  selectedWorkout
}: WorkoutModalProps) => {
  const [completedExercises, setCompletedExercises] = useState(new Set<string>());
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const toggleExerciseComplete = (id: string) => {
    const updated = new Set(completedExercises);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setCompletedExercises(updated);
  };

  const handleFinishWorkout = () => {
    if (completedExercises.size === selectedWorkout.exercises.length) {
      Alert.alert(
        "Workout Complete! 🎉",
        `Great job finishing your workout!`,
        [{ text: "OK", onPress: () => {
          onFinishWorkout()
          setShowModal(false)
        } }]
      );
    } else {
      Alert.alert(
        "Workout Incomplete",
        `You've completed ${completedExercises.size} of ${selectedWorkout.exercises.length} exercises. Finish anyway?`,
        [
          { text: "Continue Workout", style: "cancel" },
          {
            text: "Finish Anyway",
            onPress: () => {
              setShowModal(false)
            }
          }
        ]
      );
    }
    
  };

  return (
    <Modal visible={showModal} animationType="slide" onRequestClose={()=>setShowModal(false)}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{selectedWorkout.title}</Text>
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>Cornell Fitness AI</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.title}>{selectedWorkout.title}</Text>
          </View>
        </View>

        {/* Start + Exit */}
        {!workoutStarted && (
          <TouchableOpacity
            onPress={() => setWorkoutStarted(true)}
            style={styles.startButton}
          >
            <Play color="white" size={24} />
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={()=>{
            setWorkoutStarted(false)
            setShowModal(false)}
          }
          style={styles.exitButton}
        >
          <Minimize2 color="white" size={24} />
          <Text style={styles.startButtonText}>Back to Schedule</Text>
        </TouchableOpacity>

        {/* Exercises */}
        {workoutStarted && (
          <View style={styles.exerciseContainer}>
            <Text style={styles.sectionTitle}>Today's Exercises</Text>
            {selectedWorkout.exercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.name}
                onPress={() => toggleExerciseComplete(exercise.name)}
                style={[
                  styles.exerciseCard,
                  completedExercises.has(exercise.name) && styles.exerciseCardCompleted
                ]}
              >
                <View style={styles.exerciseHeader}>
                  <Text style={[
                    styles.exerciseName,
                    completedExercises.has(exercise.name) && styles.exerciseNameCompleted
                  ]}>
                    {exercise.name}
                  </Text>
                  {completedExercises.has(exercise.name) && (
                    <CheckCircle color="#B31B1B" size={24} />
                  )}
                </View>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseDetail}>Sets: {exercise.set}</Text>
                  <Text style={styles.exerciseDetail}>Reps: {exercise.reps}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Finish */}
        {workoutStarted && (
          <TouchableOpacity
            onPress={handleFinishWorkout}
            style={[
              styles.finishButton,
              completedExercises.size === selectedWorkout.exercises.length
                ? styles.finishButtonActive
                : styles.finishButtonInactive
            ]}
          >
            <Trophy color="white" size={24} />
            <Text style={styles.finishButtonText}>Finish Workout</Text>
          </TouchableOpacity>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Stay strong, Big Red! 🐻</Text>
        </View>
      </ScrollView>
    </Modal>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#B31B1B',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#B31B1B',
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 0,
  },
  infoText: {
    color: '#374151',
    fontWeight: '800',
    marginLeft: 12,
    flex: 1,
  },
  progressContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    color: '#374151',
    fontWeight: '600',
  },
  semesterText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#B31B1B',
    borderRadius: 4,
  },
  startButton: {
    backgroundColor: '#B31B1B',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  exerciseContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB',
  },
  exerciseCardCompleted: {
    borderLeftColor: '#B31B1B',
    backgroundColor: '#FEF2F2',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  exerciseNameCompleted: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  finishButton: {
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  finishButtonInactive: {
    backgroundColor: '#9CA3AF',
  },
  finishButtonActive: {
    backgroundColor: '#B31B1B',
  },
  finishButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontStyle: 'italic',
    color: '#6B7280',
  },
  exitButton: {
    backgroundColor: 'gray',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  }
});


export default CornellWorkoutModal;