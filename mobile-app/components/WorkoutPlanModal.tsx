import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  rest?: string;
  instructions?: string;
}

interface WorkoutPlan {
  title: string;
  description: string;
  duration: number;
  estimatedCalories: number;
  warmup: Exercise[];
  mainWorkout: Exercise[];
  cooldown: Exercise[];
  tips: string[];
}

interface WorkoutPlanModalProps {
  visible: boolean;
  workoutPlan: WorkoutPlan | null;
  onClose: () => void;
  onStartWorkout: () => void;
}

const WorkoutPlanModal: React.FC<WorkoutPlanModalProps> = ({
  visible,
  workoutPlan,
  onClose,
  onStartWorkout,
}) => {
  if (!workoutPlan) return null;

  const renderExercise = (exercise: Exercise, index: number) => (
    <View key={index} style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.exerciseDetails}>
          {exercise.sets && (
            <Text style={styles.exerciseDetail}>{exercise.sets} sets</Text>
          )}
          {exercise.reps && (
            <Text style={styles.exerciseDetail}>• {exercise.reps} reps</Text>
          )}
          {exercise.duration && (
            <Text style={styles.exerciseDetail}>• {exercise.duration}</Text>
          )}
        </View>
      </View>
      
      {exercise.instructions && (
        <Text style={styles.exerciseInstructions}>{exercise.instructions}</Text>
      )}
      
      {exercise.rest && (
        <View style={styles.restContainer}>
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text style={styles.restText}>Rest: {exercise.rest}</Text>
        </View>
      )}
    </View>
  );

  const renderSection = (title: string, icon: string, exercises: Exercise[], color: string) => (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, { backgroundColor: color + '20' }]}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
        <Text style={styles.sectionCount}>({exercises.length} exercises)</Text>
      </View>
      
      {exercises.map((exercise, index) => renderExercise(exercise, index))}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Workout Plan</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Workout Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.workoutTitle}>{workoutPlan.title}</Text>
            <Text style={styles.workoutDescription}>{workoutPlan.description}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={20} color="#3b82f6" />
                <Text style={styles.statValue}>{workoutPlan.duration}</Text>
                <Text style={styles.statLabel}>minutes</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="flame-outline" size={20} color="#ef4444" />
                <Text style={styles.statValue}>{workoutPlan.estimatedCalories}</Text>
                <Text style={styles.statLabel}>calories</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="location-outline" size={20} color="#10b981" />
                <Text style={styles.statValue}>Helen Newman</Text>
                <Text style={styles.statLabel}>5 min walk</Text>
              </View>
            </View>
          </View>

          {/* Warmup Section */}
          {workoutPlan.warmup.length > 0 && renderSection(
            "WARMUP", "🔥", workoutPlan.warmup, "#f59e0b"
          )}

          {/* Main Workout Section */}
          {workoutPlan.mainWorkout.length > 0 && renderSection(
            "MAIN WORKOUT", "💪", workoutPlan.mainWorkout, "#3b82f6"
          )}

          {/* Cooldown Section */}
          {workoutPlan.cooldown.length > 0 && renderSection(
            "COOLDOWN", "🧘", workoutPlan.cooldown, "#10b981"
          )}

          {/* Tips Section */}
          {workoutPlan.tips.length > 0 && (
            <View style={styles.section}>
              <View style={[styles.sectionHeader, { backgroundColor: '#8b5cf620' }]}>
                <Text style={styles.sectionIcon}>💡</Text>
                <Text style={[styles.sectionTitle, { color: '#8b5cf6' }]}>TIPS FOR SUCCESS</Text>
              </View>
              
              {workoutPlan.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton}>
            <Ionicons name="bookmark-outline" size={20} color="#6b7280" />
            <Text style={styles.saveButtonText}>Save for Later</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.startButton} onPress={onStartWorkout}>
            <Ionicons name="play" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  workoutDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  sectionCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  exerciseHeader: {
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#3b82f6',
    marginRight: 8,
    fontWeight: '500',
  },
  exerciseInstructions: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  restContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  restText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#8b5cf6',
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  startButton: {
    flex: 2,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutPlanModal;