// components/workout/EmptyWorkoutFallback.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface Props {
  onGenerate: () => void;
  loading: boolean | null;
}

const EmptyWorkoutFallback = ({ onGenerate, loading }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No Workouts Found</Text>
      <Text style={styles.subtitle}>Looks like your week is empty.</Text>
      <Pressable onPress={onGenerate} style={styles.button}>
        <Text style={styles.buttonText}>{!loading ? "Generate AI Workout": "Generating AI Workout..."}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 100,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e5e7eb',
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EmptyWorkoutFallback;
