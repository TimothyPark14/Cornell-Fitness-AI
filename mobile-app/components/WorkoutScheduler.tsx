// components/WorkoutScheduler.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  StyleSheet 
} from 'react-native';
import useGoogleAuth from '../hooks/useGoogleAuth';
import WorkoutPreferencesModal from './WorkoutPreferencesModal';
import WorkoutPlanModal from './WorkoutPlanModal';
import OpenAIWorkoutService from '../../backend/services/OpenAIWorkoutService';

// Type definitions
interface WorkoutSlot {
  start: Date;
  end: Date;
  duration: number; // in minutes
}

interface WorkoutPreferences {
  goal: string;
  fitnessLevel: string;
  equipment: string[];
  workoutType: string;
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

interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  rest?: string;
  instructions?: string;
}

const WorkoutScheduler: React.FC = () => {
  const { accessToken, isAuthenticated, user } = useGoogleAuth();
  const [workoutSlots, setWorkoutSlots] = useState<WorkoutSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<WorkoutSlot | null>(null);
  const [showPreferencesModal, setShowPreferencesModal] = useState<boolean>(false);
  const [showWorkoutPlanModal, setShowWorkoutPlanModal] = useState<boolean>(false);
  const [generatedWorkoutPlan, setGeneratedWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState<boolean>(false);

  console.log('🏃 WorkoutScheduler - Auth state:', { 
    isAuthenticated, 
    hasToken: !!accessToken, 
    user: user?.name 
  });

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      findWorkoutOpportunities();
    }
  }, [isAuthenticated, accessToken]);

  // Also trigger workout finding on component mount for debugging
  useEffect(() => {
    console.log('🚀 Component mounted, finding workouts regardless of auth state');
    findWorkoutOpportunities();
  }, []);

  const findWorkoutOpportunities = async (): Promise<void> => {
    setLoading(true);
    try {
      console.log('🔍 Finding workout opportunities...');
      console.log('🔑 Access token exists:', !!accessToken);
      console.log('🔑 Token type:', accessToken?.substring(0, 20) + '...');
      
      // Check if we have a real Google token (web) or mock token (mobile)
      if (accessToken && !accessToken.includes('mobile_demo_token') && !accessToken.includes('dev_mock_token')) {
        console.log('🌐 Using REAL calendar integration for web!');
        console.log('📞 About to call Google Calendar API...');
        
        // Import CalendarService for real calendar integration
        const CalendarService = (await import('../../backend/services/CalendarService')).default;
        
        try {
          console.log('📅 Calling CalendarService.findTodaysWorkoutSlots...');
          // Get real workout slots from your actual Google calendar!
          const realSlots: WorkoutSlot[] = await CalendarService.findTodaysWorkoutSlots(accessToken, 30);
          
          console.log('📊 CalendarService returned:', realSlots);
          
          if (realSlots.length > 0) {
            setWorkoutSlots(realSlots);
            console.log('✅ Real calendar workout opportunities found:', realSlots.length);
            console.log('📅 Your actual free times:', realSlots);
          } else {
            console.log('📅 No free time found in your real calendar, showing demo slots');
            // Fall back to demo slots if calendar is completely packed
            createDemoSlots();
          }
        } catch (calendarError) {
          console.error('❌ Calendar API error:', calendarError);
          console.error('❌ Full error details:', calendarError);
          createDemoSlots();
        }
      } else {
        console.log('📱 Using demo slots for mobile/development');
        console.log('📱 Token includes mobile_demo:', accessToken?.includes('mobile_demo_token'));
        createDemoSlots();
      }
    } catch (error) {
      console.error('❌ Error finding workout opportunities:', error);
      Alert.alert('Error', 'Failed to analyze your calendar. Please try again.');
      createDemoSlots(); // Fallback to demo
    } finally {
      setLoading(false);
    }
  };

  const createDemoSlots = (): void => {
    console.log('📱 Creating demo workout slots');
    const now = new Date();
    const mockSlots: WorkoutSlot[] = [
      {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 30, 0),
        duration: 90
      },
      {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0, 0),
        duration: 60
      },
      {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 30, 0),
        duration: 90
      }
    ];
    
    setWorkoutSlots(mockSlots);
    console.log('✅ Demo workout opportunities created:', mockSlots.length);
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
    setShowPreferencesModal(true);
  };

  const handleGenerateWorkout = async (preferences: WorkoutPreferences): Promise<void> => {
    console.log('🎯 handleGenerateWorkout called!');
    console.log('📋 Preferences received:', preferences);
    console.log('⏰ Selected slot:', selectedSlot);
    
    if (!selectedSlot) {
      console.log('❌ No selected slot!');
      return;
    }
    
    console.log('✅ Starting workout generation...');
    
    setShowPreferencesModal(false);
    setIsGeneratingWorkout(true);
    console.log('🔄 Modal closed, loading overlay should show...');
    
    try {
      console.log('🧠 Calling OpenAI Workout Service...');
      // Now using the real AI service!
      const workoutPlan = await OpenAIWorkoutService.generateWorkout(preferences, selectedSlot);
      
      console.log('✅ Workout generated successfully:', workoutPlan.title);
      
      setGeneratedWorkoutPlan(workoutPlan);
      setShowWorkoutPlanModal(true);
      
    } catch (error) {
      console.error('❌ Error generating workout:', error);
      Alert.alert('Error', 'Failed to generate workout. Please try again.');
    } finally {
      console.log('🏁 Setting isGeneratingWorkout to false...');
      setIsGeneratingWorkout(false);
    }
  };

  const handleStartWorkout = (): void => {
    setShowWorkoutPlanModal(false);
    Alert.alert(
      'Workout Started! 💪',
      'Great! Your workout is ready to begin. Have an amazing session!',
      [
        { text: 'Let\'s Go!', onPress: () => console.log('Starting workout tracking...') }
      ]
    );
  };

  const handleCloseWorkoutPlan = (): void => {
    setShowWorkoutPlanModal(false);
    setGeneratedWorkoutPlan(null);
  };

  const handleCloseModal = (): void => {
    setShowPreferencesModal(false);
    setSelectedSlot(null);
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

      {/* Loading overlay for workout generation */}
      {isGeneratingWorkout && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <Text style={styles.loadingTitle}>🧠 Generating Your Workout</Text>
            <Text style={styles.loadingText}>Creating a personalized plan just for you...</Text>
          </View>
        </View>
      )}

      <WorkoutPreferencesModal
        visible={showPreferencesModal}
        slot={selectedSlot}
        onClose={handleCloseModal}
        onGenerateWorkout={handleGenerateWorkout}
      />

      <WorkoutPlanModal
        visible={showWorkoutPlanModal}
        workoutPlan={generatedWorkoutPlan}
        onClose={handleCloseWorkoutPlan}
        onStartWorkout={handleStartWorkout}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    color: '#fff',
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
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
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
    color: '#fff',
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
    color: '#ccc',
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default WorkoutScheduler;