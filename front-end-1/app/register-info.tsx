import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CornellSignUp: React.FC = () => {
  const [formData, setFormData] = useState<{
    username: string;
    age: string;
    height: string;
    weight: string;
  }>({
    username: '',
    age: '',
    height: '',
    weight: ''
  });

  const [focusedField, setFocusedField] = useState<string>('');
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
    Animated.spring(scaleAnimation, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setFocusedField('');
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  interface InputFieldProps {
    field: keyof typeof formData;
    placeholder: string;
    icon: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    value: any;
  }

  const InputField: React.FC<InputFieldProps> = ({ field, placeholder, icon, keyboardType = 'default' }) => {
    const isFocused = focusedField === field;

    return (
      <Animated.View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          { transform: [{ scale: isFocused ? scaleAnimation : 1 }] }
        ]}
      >
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, isFocused && styles.iconFocused]}>
            {icon}
          </Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          onFocus={() => handleFocus(field)}
          onBlur={handleBlur}
          keyboardType={keyboardType}
        />
      </Animated.View>
    );
  };

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
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>C</Text>
            </View>
            <Text style={styles.title}>Cornell Fitness AI</Text>
            <Text style={styles.subtitle}>Your personal gym planner this semester</Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Username"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
            />

            <InputField
              field="age"
              placeholder="Age"
              icon="📅"
              keyboardType="numeric"
              value={formData.age}
            />

            <InputField
              field="height"
              placeholder="Height (e.g., 5'8)"
              icon="📏"
              value="{formData.height}"
            />

            <InputField
              field="weight"
              placeholder="Weight (e.g., 150 lbs)"
              icon="⚖️"
              value={formData.weight}
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#ffffff', '#fef2f2']}
                style={styles.submitGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.submitText}>Next</Text>
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
});

export default CornellSignUp;