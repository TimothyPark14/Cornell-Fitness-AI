import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { LinearGradient } from 'expo-linear-gradient';
import CornellWorkoutModal from '@/components/workout/WorkoutPlan';
import { getWorkout } from '@/scripts/getWorkout'
import EmptyWorkoutFallback from '@/components/workout/EmptyWorkoutList'
import { ScheduleResponse } from '@/types/workout' 

const WeeklyWorkout = () => {
  const [workoutsList, setWorkoutsList] = useState<ScheduleResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState<ScheduleResponse | undefined>(undefined);

  const generateWorkouts = async () => {
    setLoading(true);
    try {
      const newWorkouts = await getWorkout();   // returns WorkoutSession[]
      setWorkoutsList(newWorkouts);
    } catch (err) {
      console.error("Failed to fetch AI workouts", err);
      // optionally show error UI
    } finally {
      setLoading(false);
    }
  };


  const renderWorkoutItem = ({ item }: { item: ScheduleResponse }) => (
    <View style={styles.cardContainer}>
      <Pressable
        style={styles.card}
        onPress={() => {
          setSelectedWorkout(item);
          setShowModal(true);
        }}>
        <Text style={styles.weekHeader}>{item.title}</Text>
        <View style={styles.detailsRow}>
          <FontAwesome6 name="calendar-check" size={18} color="gray" />
          <Text style={styles.detailText}>{item.startTime.toFormat("LLLL d, cccc")}</Text>
        </View>
        <View style={styles.detailsRow}>
          <MaterialCommunityIcons name="map-marker" size={18} color="red" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailsRow}>
          <MaterialCommunityIcons name="clock-time-four" size={18} color="gray" />
          <Text style={styles.detailText}>
            {item.startTime.toFormat("h:mm a")}~{item.endTime.toFormat("h:mm a")}
          </Text>
        </View>
      </Pressable>
      {selectedWorkout && (
        <CornellWorkoutModal
          selectedWorkout={selectedWorkout}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7f1d1d', '#991b1b', '#dc2626']}
        style={styles.gradient}
      />

      {/* Decorative Circles */}
      <View style={[styles.decorativeCircle, styles.circle1]} />
      <View style={[styles.decorativeCircle, styles.circle2]} />
      <View style={[styles.decorativeCircle, styles.circle3]} />
      <View style={[styles.decorativeCircle, styles.circle4]} />
    {
    workoutsList.length === 0 ? (
      <EmptyWorkoutFallback onGenerate={generateWorkouts} loading={loading}/>) : (
    <FlatList
      style={styles.flatList}
      data={workoutsList}
      keyExtractor={(item) => item.startTime.day.toString()}
      renderItem={renderWorkoutItem}
    />
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b91c1b',
    padding: 20,
    paddingTop: 70,
    paddingBottom: 60,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: -10,
  },
  decorativeCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 9999,
    borderColor: 'rgba(220, 38, 38, 0.3)',
    zIndex: -5,
  },
circle1: {
  width: 140,
  height: 140,
  top: 80,
  left: 30,
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  shadowColor: '#ffffff',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 10,
},
  circle2: {
    width: 80,
    height: 80,
    top: 160,
    right: 20,
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  circle3: {
    width: 140,
    height: 140,
    bottom: 200,
    left: 10,
    borderColor: 'rgba(220, 38, 38, 0.25)',
  },
  circle4: {
    width: 100,
    height: 100,
    bottom: 80,
    right: 30,
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
title: {
  fontSize: 34,
  fontWeight: '900',
  color: '#fff',
  marginBottom: 20,
  textAlign: 'center',
  letterSpacing: 1,
},
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#7f1d1d', // Deep Cornell red
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
weekHeader: {
  fontSize: 22,
  fontWeight: '700',
  color: '#7f1d1d',
  marginBottom: 12,
},
  cardContainer: {
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
detailText: {
  marginLeft: 6,
  color: '#1f2937', // slate gray
  fontSize: 15,
},
  flatList: {
    marginTop: 30
  }
});

export default WeeklyWorkout;