// components/WorkoutScheduler.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import CalendarService from '../services/CalendarService';
import useGoogleAuth from '../hooks/useGoogleAuth';

// Type definitions
interface WorkoutSlot {
  start: Date;
  end: Date;
  duration: number; // in minutes
}

interface GoogleAuthHook {
  accessToken: string | null;
  isAuthenticated: boolean;
}

const WorkoutScheduler: React.FC = () => {
  const { accessToken, isAuthenticated }: GoogleAuthHook = useGoogleAuth();
  const [workoutSlots, setWorkoutSlots] = useState<WorkoutSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<WorkoutSlot | null>(null);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      findWorkoutOpportunities();
    }
  }, [isAuthenticated, accessToken]);

  const findWorkoutOpportunities = async (): Promise<void> => {
    setLoading(true);
    try {
      // Find available workout slots for today
      const slots: WorkoutSlot[] = await CalendarService.findTodaysWorkoutSlots(accessToken!, 30); // Minimum 30 minutes
      setWorkoutSlots(slots);
    } catch (error) {
      console.error('Error finding workout opportunities:', error);
      Alert.alert('Error', 'Failed to analyze your calendar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getWorkoutSuggestion = (duration: number): string => {
    if (duration < 30) return 'Quick stretch or walk';
    if (duration < 45) return 'Cardio session';
    if (duration < 60) return 'Strength training';
    return 'Full workout session';
  };

  const handleSlotSelection = (slot: WorkoutSlot): void => {
    setSelectedSlot(slot);
    // Here you would navigate to workout planning screen
    // or integrate with your AI workout generator
    Alert.alert(
      'Workout Time Selected',
      `You selected ${formatTime(slot.start)} - ${formatTime(slot.end)}\n\nSuggested workout: ${getWorkoutSuggestion(slot.duration)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Plan Workout', onPress: () => planWorkout(slot) }
      ]
    );
  };

  const planWorkout = (slot: WorkoutSlot): void => {
    // This is where you'd integrate with OpenAI to generate a workout
    // based on the available time and nearby Cornell gym facilities
    console.log('Planning workout for slot:', slot);
    // Navigate to workout planning screen or call AI service
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please sign in to view your workout opportunities</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Workout Opportunities</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={findWorkoutOpportunities}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loading}>Analyzing your calendar...</Text>
      ) : workoutSlots.length === 0 ? (
        <View style={styles.noSlots}>
          <Text style={styles.noSlotsText}>No workout opportunities found for today</Text>
          <Text style={styles.noSlotsSubtext}>Your schedule looks pretty packed!</Text>
        </View>
      ) : (
        <View style={styles.slotsContainer}>
          {workoutSlots.map((slot: WorkoutSlot, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.slotCard,
                selectedSlot === slot && styles.selectedSlot
              ]}
              onPress={() => handleSlotSelection(slot)}
            >
              <View style={styles.slotHeader}>
                <Text style={styles.slotTime}>
                  {formatTime(slot.start)} - {formatTime(slot.end)}
                </Text>
                <Text style={styles.slotDuration}>
                  {formatDuration(slot.duration)}
                </Text>
              </View>
              <Text style={styles.workoutSuggestion}>
                {getWorkoutSuggestion(slot.duration)}
              </Text>
              <View style={styles.slotFooter}>
                <Text style={styles.availableText}>Available now</Text>
                <Text style={styles.tapText}>Tap to plan workout</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#4285f4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshText: {
    color: 'white',
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 50,
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  noSlots: {
    alignItems: 'center',
    marginTop: 50,
  },
  noSlotsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  noSlotsSubtext: {
    fontSize: 14,
    color: '#999',
  },
  slotsContainer: {
    gap: 12,
  },
  slotCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedSlot: {
    borderColor: '#4285f4',
    borderWidth: 2,
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  slotTime: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  slotDuration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4285f4',
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  workoutSuggestion: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  slotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availableText: {
    fontSize: 12,
    color: '#34a853',
    fontWeight: '500',
  },
  tapText: {
    fontSize: 12,
    color: '#999',
  },
});

export default WorkoutScheduler;