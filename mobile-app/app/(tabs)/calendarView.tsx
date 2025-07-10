import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import week_events from '@/assets/data/weekly-schedule';
import WorkoutPlan from '@/components/workout/WorkoutPlan';
import { Background } from '@react-navigation/elements';

export default function CalendarView() {
  const [showWorkout, setShowWorkout] = useState(false);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  // Animate slide up when showWorkout becomes true
  useEffect(() => {
    if (showWorkout) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [showWorkout]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Calendar */}
        {!showWorkout && (
          <View style={styles.content}>
            <Calendar
              events={week_events}
              height={600}
              mode="week"
              minHour={6}
              maxHour={21}
              onPressEvent={(event) => {
                console.log('Event pressed:', event);
                if (event.isWorkout) setShowWorkout(true);
              }}
              eventCellStyle={(event) =>
                event.isWorkout
                  ? { backgroundColor: 'rgb(237, 40, 40)' }
                  : { backgroundColor: 'rgb(196, 196, 196)' }
              }
              swipeEnabled={false}
              headerContainerStyle={{ backgroundColor: '#B31B1B' }} // ← changes the header background
              weekDayHeaderHighlightColor="#fff" // optional: highlight current weekday
            />
          </View>
        )}

        {/* Animated Workout View */}
        {showWorkout && (
          <Animated.View
            style={[
              styles.workout_content,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <WorkoutPlan setShowWorkout={setShowWorkout} />
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  backgroundDecoration: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
  },
  circle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 50,
  },
  circle1: { width: 100, height: 100, top: 80, left: 50 },
  circle2: { width: 80, height: 80, bottom: 120, right: 40 },
  circle3: { width: 60, height: 60, top: '50%', left: 20 },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: 'rgb(255, 255, 255)'
  },
  workout_content: {
    flex: 1,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(254,202,202,0.9)',
    fontStyle: 'italic',
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
    paddingHorizontal: 20,
  },

  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  button: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  terms: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  link: {
    color: '#fca5a5',
    textDecorationLine: 'underline',
  },
});
