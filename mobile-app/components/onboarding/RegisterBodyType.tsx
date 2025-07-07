import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { styles } from '@/components/onboarding/styles';
import { FormDataType } from './types';
import { goalOptions, experienceOptions, frequencyOptions, timeOptions } from '@/constants/formData';

type RegisterBodyTypeProps = {
  setShowSubmit: (showSubmit: boolean) => void;
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const genderOption = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

export default function RegisterBodyType({ setShowSubmit, setFormData, formData }: RegisterBodyTypeProps) {
    const [isFocus, setIsFocus] = useState(false);

    const handleInputChange = (field: keyof typeof formData, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
                <View style={styles.content}>
                <View style={styles.formContainer}>
                  <TextInput
                    placeholder="Age"
                    onChangeText={(value) => handleInputChange('age', value)}
                    style={styles.textInput}
                    placeholderTextColor="#ccc"
                    keyboardType='numeric'
                  />
                  <Dropdown
                    data={genderOption}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Gender"
                    value={formData.gender}
                    onChange={item => {
                      handleInputChange('gender', item.value);
                    }}
                    style={[styles.dropdown, isFocus && { borderColor: '#fff' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemTextStyle={styles.itemTextStyle}
                    containerStyle={styles.dropdownContainer}
                    activeColor="#fff1"
                  />
                  <TextInput
                    placeholder="Height (cm)"
                    onChangeText={(value) => handleInputChange('height', value)}
                    style={styles.textInput}
                    placeholderTextColor="#ccc" 
                  />
                  <TextInput
                    placeholder="Weight (kg)"
                    onChangeText={(value) => handleInputChange('weight', value)}
                    style={styles.textInput}
                    placeholderTextColor="#ccc"
                  />
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
                  {/* <TouchableOpacity 
                      style={styles.subtleGoBackStyle}
                      onPress={()=>setShowSubmit(true)}
                  >
                    <Text style={styles.subtleGoBackText}>SUBMIT</Text>
                  </TouchableOpacity> */}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )}