import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";

const Preference: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    goal: string;
    experience: string;
    frequency: number;
  }>({
    goal: '',
    experience: '',
    frequency: 0,
  });
  const [isFocus, setIsFocus] = useState(false);
  const { user, setUser } = useUser();



  // Form update handlers
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    console.log('Form submitted:', formData);
    const { goal, experience, frequency } = formData;

    const parsedFrequency = Number(frequency);

    // Basic validation
    if (!goal || !experience || !parsedFrequency) {
      alert("Please fill out all fields correctly.");
      return;
    }
    if (!user || !user.email) {
      alert("Something went wrong. User not found.");
      return;
    }
    // Update the user object
    const newUser = {
      ...user,
      goal: goal as 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength',
      experience: experience as 'beginner' | 'intermediate' | 'advanced',
      frequency: parsedFrequency,
    };

    // ✅ Update context
    setUser(newUser);
    console.log("User updated in context:", user.email, user.goal, user.experience, user.frequency);

    try {
        const response = await fetch("http://localhost:3000/api/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });
    const data = await response.json();
    console.log("Server response:", data);
    router.push("/calendarView");
    // Optionally handle navigation or show a success message here
    } catch (error) {
        console.error("Error submitting form:", error);
  }
  };


  // Static options for dropdowns
  const goalOptions = [
    { label: 'Weight Loss', value: 'weight_loss' },
    { label: 'Muscle Gain', value: 'muscle_gain' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Strength', value: 'strength' },
  ];
  const experienceOptions = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ];
  const frequencyOptions = Array.from({ length: 5 }, (_, i) => ({
    label: `${i + 1} day${i > 0 ? 's' : ''}`,
    value: i + 1,
  }));

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
          {/* Header */}
          <View style={styles.header}>

        </View>

          {/* Form Container */}
        <View style={styles.formContainer}>
            <Text style={styles.title}>Your Preferences</Text>
          <Dropdown
            data={goalOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Goal"
            value={formData.goal}
            onChange={item => {
              handleInputChange('goal', item.value);
            }}
            style={[styles.dropdown, isFocus && { borderColor: '#fff' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
            containerStyle={styles.dropdownContainer}
            activeColor="#fff1"
          />
          <Dropdown
            data={experienceOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Experience Level"
            value={formData.experience}
            onChange={item => {
              handleInputChange('experience', item.value);
            }}
            style={[styles.dropdown, isFocus && { borderColor: '#fff' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
            containerStyle={styles.dropdownContainer}
            activeColor="#fff1"
          />
          <Dropdown
            data={frequencyOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Frequency"
            value={formData.frequency}
            onChange={item => {
              handleInputChange('frequency', item.value);
            }}
            style={[styles.dropdown, isFocus && { borderColor: '#fff' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
            containerStyle={styles.dropdownContainer}
            activeColor="#fff1"
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
                handleSubmit()
                router.push("/preference")
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#ffffff', '#fef2f2']}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.submitText}>Get Your Schedule</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

  {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.signInText}>Sign In</Text>
        </Text>
        <Text style={styles.prideText}>BIG RED PRIDE</Text>
      </View>
    </View>

        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// styles stay the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
  circle1: {
    width: 100,
    height: 100,
    top: 80,
    left: 50,
  },
  circle2: {
    width: 80,
    height: 80,
    bottom: 120,
    right: 40,
  },
  circle3: {
    width: 60,
    height: 60,
    top: '50%',
    left: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(254, 202, 202, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  inputContainerFocused: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  iconFocused: {
    color: 'rgba(252, 165, 165, 1)',
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f1d1d',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(254, 202, 202, 0.6)',
    marginBottom: 16,
  },
  signInText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  prideText: {
    fontSize: 12,
    color: 'rgba(252, 165, 165, 0.4)',
    fontWeight: '600',
    letterSpacing: 2,
  },
  dropdown: {
    height: 50,
    borderRadius: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // frosted look
    borderWidth: 1,
    borderColor: 'rgba(111, 95, 95, 0)',
    marginBottom: 16,
  },
  placeholderStyle: {
    color: '#ccc',
    fontSize: 16,
  },
  selectedTextStyle: {
    color: '#fff',
    fontSize: 16,
  },
  itemTextStyle: {
    color: '#000',
  },
  dropdownContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
  }
  
});

export default Preference;