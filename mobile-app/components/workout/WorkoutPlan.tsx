import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Clock, MapPin, Dumbbell, CheckCircle, Trophy, Play, Minimize2 } from 'lucide-react-native';
import styles from '@/components/workout/style'

type WorkoutViewType = {
  setShowWorkout: (showWorkout: boolean) => void;
}

const CornellWorkoutPlan = ({
  workoutTitle = "Full Body Strength Training",
  location = "Helen Newman Gym",
  duration = 45,
  equipment = ["Dumbbells", "Resistance Bands", "Yoga Mat"],
  onFinishWorkout = () => {},
  setShowWorkout, // <-- include here!
}: WorkoutViewType & {
  workoutTitle?: string;
  location?: string;
  duration?: number;
  equipment?: string[];
  onFinishWorkout?: () => void;
}) => {
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [semesterWorkouts, setSemesterWorkouts] = useState(12); // Example count

  // Generate workout based on equipment and duration
  const generateWorkout = () => {
    const exercises = [];
    
    if (equipment.includes("Dumbbells")) {
      exercises.push(
        { id: 1, name: "Dumbbell Chest Press", sets: 3, reps: "8-12", rest: "60s" },
        { id: 2, name: "Dumbbell Rows", sets: 3, reps: "8-12", rest: "60s" },
        { id: 3, name: "Dumbbell Squats", sets: 3, reps: "12-15", rest: "60s" },
        { id: 4, name: "Dumbbell Shoulder Press", sets: 3, reps: "8-12", rest: "60s" }
      );
    }
    
    if (equipment.includes("Resistance Bands")) {
      exercises.push(
        { id: 5, name: "Band Pull-Aparts", sets: 3, reps: "15-20", rest: "45s" },
        { id: 6, name: "Band Squats", sets: 3, reps: "12-15", rest: "45s" }
      );
    }
    
    if (equipment.includes("Yoga Mat")) {
      exercises.push(
        { id: 7, name: "Push-ups", sets: 3, reps: "8-15", rest: "60s" },
        { id: 8, name: "Plank", sets: 3, reps: "30-60s", rest: "45s" },
        { id: 9, name: "Mountain Climbers", sets: 3, reps: "20", rest: "45s" }
      );
    }
    
    return exercises.slice(0, Math.floor(duration / 5)); // Roughly 5 minutes per exercise
  };

  const exercises = generateWorkout();

  const toggleExerciseComplete = () => {
    console.log('finished workout!')
  };

  const handleFinishWorkout = () => {
    if (completedExercises.size === exercises.length) {
      // Simulate saving to database
      setSemesterWorkouts(prev => prev + 1);
      Alert.alert(
        "Workout Complete! 🎉",
        `Great job finishing your workout!\nTotal workouts this semester: ${semesterWorkouts + 1}`,
        [{ text: "OK", onPress: () => onFinishWorkout() }]
      );
    } else {
      Alert.alert(
        "Workout Incomplete",
        `You've completed ${completedExercises.size} of ${exercises.length} exercises. Are you sure you want to finish?`,
        [
          { text: "Continue Workout", style: "cancel" },
          { 
            text: "Finish Anyway", 
            onPress: () => {
              setSemesterWorkouts(prev => prev + 1);
              onFinishWorkout();
            }
          }
        ]
      );
    }
  };

  const progressPercentage = (completedExercises.size / exercises.length) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{workoutTitle}</Text>
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>Cornell Fitness AI</Text>
        </View>
      </View>

      {/* Workout Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <MapPin color="#B31B1B" size={20} />
          <Text style={styles.infoText}>{location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock color="#B31B1B" size={20} />
          <Text style={styles.infoText}>{duration} minutes</Text>
        </View>
        <View style={styles.infoRow}>
          <Dumbbell color="#B31B1B" size={20} />
          <Text style={styles.infoText}>{equipment.join(", ")}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Progress: {completedExercises.size} / {exercises.length} exercises
          </Text>
          <Text style={styles.semesterText}>
            {semesterWorkouts} workouts this semester
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%` }
            ]}
          />
        </View>
      </View>

      {/* Start Workout Button */}
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
          onPress={() => setShowWorkout(false)}
          style={styles.exitButton}
        >
          <Minimize2 color="white" size={24} />
          <Text style={styles.startButtonText}>Back to Calendar</Text>
        </TouchableOpacity>

      {/* Exercise List */}
      {workoutStarted && (
        <View style={styles.exerciseContainer}>
          <Text style={styles.sectionTitle}>Today's Exercises</Text>
          {exercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              onPress={() => toggleExerciseComplete(exercise.id)}
              style={[
                styles.exerciseCard,
                completedExercises.has(exercise.id) && styles.exerciseCardCompleted
              ]}
            >
              <View style={styles.exerciseHeader}>
                <Text style={[
                  styles.exerciseName,
                  completedExercises.has(exercise.id) && styles.exerciseNameCompleted
                ]}>
                  {exercise.name}
                </Text>
                {completedExercises.has(exercise.id) && (
                  <CheckCircle color="#B31B1B" size={24} />
                )}
              </View>
              <View style={styles.exerciseDetails}>
                <Text style={styles.exerciseDetail}>Sets: {exercise.sets}</Text>
                <Text style={styles.exerciseDetail}>Reps: {exercise.reps}</Text>
                <Text style={styles.exerciseDetail}>Rest: {exercise.rest}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Finish Workout Button */}
      {workoutStarted && (
        <TouchableOpacity
          onPress={handleFinishWorkout}
          style={[
            styles.finishButton,
            completedExercises.size === exercises.length 
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
  );
};

export default CornellWorkoutPlan;