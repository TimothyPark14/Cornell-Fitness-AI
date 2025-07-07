import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { styles } from "@/components/onboarding/styles";
import RegisterBodyType from '@/components/onboarding/RegisterBodyType'

const Onboarding: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<{
    age: number;
    gender: string;
    height: number;
    weight: number;
    goal: string;
    experience: string;
    frequency: number;
    time: Date;
  }>({
    age: 0,
    gender: '',
    height: 0,
    weight: 0,
    goal: '',
    experience: '',
    frequency: 0,
    time: new Date(),
  });
  const [showSubmit, setShowSubmit] = useState(true);

  // const handleSubmit = () => {
  //   const { age, gender, height, weight, goal, experience, frequency, time } = formData;

  //   // Convert height/weight to numbers
  //   const parsedAge = Number(age);
  //   const parsedHeight = Number(height);
  //   const parsedWeight = Number(weight);

  //   // ✅ Basic validation
  //   if (!parsedAge || !parsedHeight || !parsedWeight || !gender) {
  //     alert("Please fill out all fields correctly.");
  //     return;
  //   }
  //   if (!user || !user.email) {
  //     alert("Something went wrong. User not found.");
  //     return;}
  //   // ✅ Now update the user object
    
  //   setUser({
  //     ...(user ?? {}),
  //     age: parsedAge,
  //     gender: gender as 'male' | 'female',
  //     height: parsedHeight,
  //     weight: parsedWeight,
  //   });
  //   console.log("User updated in context:", user.email, user.age, user.gender, user.height, user.weight); 
  // };

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
          <View style={styles.header}>
            <Text style={styles.title}>Cornell Fitness AI</Text>
            <Text style={styles.subtitle}>Never think twice about your workout</Text>
          </View>

            <RegisterBodyType
              setShowSubmit={setShowSubmit}
              setFormData={setFormData}
              formData={formData}
            />

          {showSubmit && 
            <TouchableOpacity
                style={styles.submitButton}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#ffffff', '#fef2f2']}
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.submitText}>SUBMIT</Text>
                </LinearGradient>
              </TouchableOpacity>}

          <View style={styles.footer}>
            <Text style={styles.prideText}>BIG RED PRIDE</Text>
          </View>
        </View>

        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// styles stay the same

export default Onboarding;