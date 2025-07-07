import { Calendar } from 'react-native-big-calendar';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import week_events from '@/assets/data/weekly-schedule'

export default function CalendarView() {
  return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#7f1d1d', '#991b1b', '#374151']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.backgroundDecoration}>
              <View style={[styles.circle, styles.circle1]} />
              <View style={[styles.circle, styles.circle2]} />
              <View style={[styles.circle, styles.circle3]} />
            </View>
  
            <View style={styles.content}>
              <Calendar
                events={week_events}
                height={600}
                mode="week"
                minHour={7}
                maxHour={21}
                onPressEvent={(event)=>{
                  console.log('Event pressed:', event);
                }}
                eventCellStyle={{
                  backgroundColor: 'rgba(204, 204, 204, 0.3)'}}
              />
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
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
