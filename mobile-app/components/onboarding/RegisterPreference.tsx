import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FormDataType } from './types';
import { styles } from '@/components/onboarding/styles' 

type RegisterBodyTypeProps = {
  setShowSubmit: (showSubmit: boolean) => void;
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const RegisterPreference = ({ setShowSubmit, setFormData, formData }: RegisterBodyTypeProps) => {
  const [isFocus, setIsFocus] = useState(false);


  // Form update handlers
    const handleInputChange = (field: keyof typeof formData, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

//   const handleSubmit = async () => {
//     console.log('Form submitted:', formData);
//     const { goal, experience, frequency } = formData;

//     const parsedFrequency = Number(frequency);

//     // Basic validation
//     if (!goal || !experience || !parsedFrequency) {
//       alert("Please fill out all fields correctly.");
//       return;
//     }
//     if (!user || !user.email) {
//       alert("Something went wrong. User not found.");
//       return;
//     }
//     // Update the user object
//     const newUser = {
//       ...user,
//       goal: goal as 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength',
//       experience: experience as 'beginner' | 'intermediate' | 'advanced',
//       frequency: parsedFrequency,
//     };

//     // ✅ Update context
//     setUser(newUser);
//     console.log("User updated in context:", user.email, user.goal, user.experience, user.frequency);

//     try {
//         const response = await fetch("http://localhost:3000/api/", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(newUser),
//         });
//     const data = await response.json();
//     console.log("Server response:", data);
//     router.push("/calendarView");
//     // Optionally handle navigation or show a success message here
//     } catch (error) {
//         console.error("Error submitting form:", error);
//   }
//   };


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

  const timeOptions = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 6; // 6 AM to 8 PM
    const date = new Date(2025, 0, 1, hour, 0); // January 1, 2025, HH:00
    const label = date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

      return {
        label,
        value: label,
      };
  });


  return (
    <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
        <View style={styles.content}>
          {/* Form Container */}
            <View style={styles.formContainer}>
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
              <Dropdown
                data={timeOptions}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Preferred Time"
                value={formData.time}
                onChange={item => {
                  handleInputChange('time', item.value);
                }}
                style={[styles.dropdown, isFocus && { borderColor: '#fff' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.itemTextStyle}
                containerStyle={styles.dropdownContainer}
                activeColor="#fff1"
              />
        </View>
        </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterPreference;