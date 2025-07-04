import React, { useState } from 'react';
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

interface WorkoutSlot {
  start: Date;
  end: Date;
  duration: number;
}

interface WorkoutPreferences {
  goal: string;
  fitnessLevel: string;
  equipment: string[];
  workoutType: string;
}

interface WorkoutPreferencesModalProps {
  visible: boolean;
  slot: WorkoutSlot | null;
  onClose: () => void;
  onGenerateWorkout: (preferences: WorkoutPreferences) => void;
}

const WorkoutPreferencesModal: React.FC<WorkoutPreferencesModalProps> = ({
  visible,
  slot,
  onClose,
  onGenerateWorkout,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string>('strength');
  const [selectedLevel, setSelectedLevel] = useState<string>('intermediate');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['dumbbells', 'machines']);

  if (!slot) return null;

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getWorkoutType = (duration: number): string => {
    if (duration < 30) return 'quick';
    if (duration < 45) return 'cardio';
    if (duration < 60) return 'focused';
    return 'full';
  };

  const goals = [
    { id: 'strength', label: 'Strength Training', icon: '💪', description: 'Build muscle & power' },
    { id: 'cardio', label: 'Cardio & Endurance', icon: '🏃', description: 'Improve heart health' },
    { id: 'fullbody', label: 'Full Body Workout', icon: '🎯', description: 'Complete fitness' },
    { id: 'hiit', label: 'HIIT Training', icon: '⚡', description: 'High intensity intervals' },
  ];

  const fitnessLevels = [
    { id: 'beginner', label: 'Beginner', description: 'New to fitness' },
    { id: 'intermediate', label: 'Intermediate', description: 'Regular exerciser' },
    { id: 'advanced', label: 'Advanced', description: 'Experienced athlete' },
  ];

  const equipmentOptions = [
    { id: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
    { id: 'machines', label: 'Machines', icon: '⚙️' },
    { id: 'cardio', label: 'Cardio Equipment', icon: '🚴' },
    { id: 'bodyweight', label: 'Bodyweight Only', icon: '🤸' },
    { id: 'resistance', label: 'Resistance Bands', icon: '🔧' },
    { id: 'kettlebells', label: 'Kettlebells', icon: '⚫' },
  ];

  const toggleEquipment = (equipmentId: string) => {
    if (selectedEquipment.includes(equipmentId)) {
      setSelectedEquipment(selectedEquipment.filter(id => id !== equipmentId));
    } else {
      setSelectedEquipment([...selectedEquipment, equipmentId]);
    }
  };

  const handleGenerateWorkout = () => {
    const preferences: WorkoutPreferences = {
      goal: selectedGoal,
      fitnessLevel: selectedLevel,
      equipment: selectedEquipment,
      workoutType: getWorkoutType(slot.duration),
    };
    
    onGenerateWorkout(preferences);
  };

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
          <Text style={styles.headerTitle}>Plan Your Workout</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Workout Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTime}>
              {formatTime(slot.start)} - {formatTime(slot.end)}
            </Text>
            <Text style={styles.summaryDuration}>
              {slot.duration} minutes available
            </Text>
            <Text style={styles.summaryLocation}>
              📍 Helen Newman Hall • 5 min walk
            </Text>
          </View>

          {/* Workout Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 What's your goal today?</Text>
            <View style={styles.optionsGrid}>
              {goals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalOption,
                    selectedGoal === goal.id && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedGoal(goal.id)}
                >
                  <Text style={styles.goalIcon}>{goal.icon}</Text>
                  <Text style={[
                    styles.goalLabel,
                    selectedGoal === goal.id && styles.selectedLabel
                  ]}>
                    {goal.label}
                  </Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Fitness Level */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💪 Your fitness level</Text>
            <View style={styles.levelOptions}>
              {fitnessLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.levelOption,
                    selectedLevel === level.id && styles.selectedLevelOption,
                  ]}
                  onPress={() => setSelectedLevel(level.id)}
                >
                  <Text style={[
                    styles.levelLabel,
                    selectedLevel === level.id && styles.selectedLevelLabel
                  ]}>
                    {level.label}
                  </Text>
                  <Text style={styles.levelDescription}>{level.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Equipment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏋️ Equipment you want to use</Text>
            <View style={styles.equipmentGrid}>
              {equipmentOptions.map((equipment) => (
                <TouchableOpacity
                  key={equipment.id}
                  style={[
                    styles.equipmentOption,
                    selectedEquipment.includes(equipment.id) && styles.selectedEquipment,
                  ]}
                  onPress={() => toggleEquipment(equipment.id)}
                >
                  <Text style={styles.equipmentIcon}>{equipment.icon}</Text>
                  <Text style={[
                    styles.equipmentLabel,
                    selectedEquipment.includes(equipment.id) && styles.selectedEquipmentLabel
                  ]}>
                    {equipment.label}
                  </Text>
                  {selectedEquipment.includes(equipment.id) && (
                    <Ionicons name="checkmark-circle" size={20} color="#22c55e" style={styles.checkmark} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Generate Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateWorkout}
          >
            <Ionicons name="fitness" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.generateButtonText}>
              Generate My {slot.duration}-Minute Workout
            </Text>
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
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTime: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  summaryDuration: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  summaryLocation: {
    fontSize: 14,
    color: '#059669',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  goalOption: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedOption: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  goalIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedLabel: {
    color: '#1d4ed8',
  },
  goalDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  levelOptions: {
    gap: 8,
  },
  levelOption: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedLevelOption: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  selectedLevelLabel: {
    color: '#1d4ed8',
  },
  levelDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentOption: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
    width: '48%',
  },
  selectedEquipment: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  equipmentIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  equipmentLabel: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  selectedEquipmentLabel: {
    color: '#059669',
    fontWeight: '500',
  },
  checkmark: {
    marginLeft: 4,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  generateButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
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
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutPreferencesModal;