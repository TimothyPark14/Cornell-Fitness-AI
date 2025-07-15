import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const ProfileDashboard = () => {
  // Mock data - replace with actual user data
  const user = {
    name: "Yongjin Lee",
    email: "tkp26@cornell.edu",
    currentWeek: 8,
    totalWeeks: 16,
    workoutsCompleted: 24,
    weeklyGoal: 4
  };

  const weekProgress = (user.currentWeek / user.totalWeeks) * 100;
  const weeklyProgress = (user.workoutsCompleted % user.weeklyGoal) / user.weeklyGoal * 100;

  // Calculate circle progress for semester weeks
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (weekProgress / 100) * circumference;

  const CircularProgress = ({ progress }: { progress: number }) => (
    <View style={styles.circularProgressContainer}>
      <Svg width={120} height={120} viewBox="0 0 120 120">
        {/* Background circle */}
        <Circle
          cx="60"
          cy="60"
          r={radius}
          stroke="rgba(239, 68, 68, 0.3)"
          strokeWidth="6"
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#f8fafc"
          strokeWidth="6"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </Svg>
      <View style={styles.circularProgressText}>
        <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        <Text style={styles.progressLabel}>Complete</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#991b1b', '#b91c1c', '#dc2626']}
        style={styles.gradient}
      />
      
      {/* Decorative Circles */}
      <View style={[styles.decorativeCircle, styles.circle1]} />
      <View style={[styles.decorativeCircle, styles.circle2]} />
      <View style={[styles.decorativeCircle, styles.circle3]} />
      <View style={[styles.decorativeCircle, styles.circle4]} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>CF</Text>
          </View>
          <Text style={styles.title}>Cornell Fitness AI</Text>
          <Text style={styles.subtitle}>Train smarter. Push harder.</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>👤</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        </View>

        {/* Semester Progress Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Text style={styles.cardIcon}>📅</Text>
              <Text style={styles.cardTitle}>Semester Progress</Text>
            </View>
            <Text style={styles.cardSubtitle}>Week {user.currentWeek}/{user.totalWeeks}</Text>
          </View>
          
          {/* Circular Progress */}
          <View style={styles.progressSection}>
            <CircularProgress progress={weekProgress} />
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill,
                  { width: `${weekProgress}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {user.totalWeeks - user.currentWeek} weeks remaining
            </Text>
          </View>
        </View>

        {/* Workout Stats Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Text style={styles.cardIcon}>🏋️</Text>
              <Text style={styles.cardTitle}>Workout Stats</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.workoutsCompleted}</Text>
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.weeklyGoal}</Text>
              <Text style={styles.statLabel}>Weekly Goal</Text>
            </View>
          </View>
          
          {/* Weekly Progress */}
          <View style={styles.weeklyProgress}>
            <View style={styles.weeklyProgressHeader}>
              <Text style={styles.weeklyProgressText}>This Week</Text>
              <Text style={styles.weeklyProgressText}>
                {user.workoutsCompleted % user.weeklyGoal}/{user.weeklyGoal}
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill,
                  { width: `${weeklyProgress}%` }
                ]}
              />
            </View>
          </View>
        </View>

        {/* Achievement Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Text style={styles.cardIcon}>🎯</Text>
              <Text style={styles.cardTitle}>Achievement</Text>
            </View>
            <Text style={styles.achievementEmoji}>🔥</Text>
          </View>
          <Text style={styles.achievementText}>
            {user.workoutsCompleted >= 20 ? "Consistency Champion!" : "Keep pushing forward!"}
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton}>
          <LinearGradient
            colors={['#dc2626', '#b91c1c']}
            style={styles.actionButtonGradient}
          >
            <Text style={styles.actionButtonText}>START TODAY'S WORKOUT</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#991b1b',
    paddingBottom: 60,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  decorativeCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 9999,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  circle1: {
    width: 120,
    height: 120,
    top: 80,
    left: 30,
    borderColor: 'rgba(220, 38, 38, 0.3)',
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
  logoContainer: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(220, 38, 38, 0.4)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fecaca',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(153, 27, 27, 0.4)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(220, 38, 38, 0.5)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  userAvatarText: {
    fontSize: 20,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#fecaca',
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
  cardIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#fecaca',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgressText: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressLabel: {
    fontSize: 10,
    color: '#fecaca',
  },
  progressBarContainer: {
    marginTop: 10,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(127, 29, 29, 0.5)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#f87171',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#fecaca',
    textAlign: 'center',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#fecaca',
  },
  weeklyProgress: {
    marginTop: 10,
  },
  weeklyProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weeklyProgressText: {
    fontSize: 12,
    color: '#fecaca',
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementText: {
    fontSize: 12,
    color: '#fecaca',
    marginTop: 8,
  },
  actionButton: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});

export default ProfileDashboard;