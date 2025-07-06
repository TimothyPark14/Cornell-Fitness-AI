import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CornellLogo = ({ size = 120 }) => {
  const logoSize = size;
  const shieldHeight = logoSize * 0.7;
  const shieldWidth = logoSize * 0.6;
  
  return (
    <View style={[styles.logoContainer, { width: logoSize, height: logoSize * 0.8 }]}>
      {/* Shield Background */}
      <View style={[
        styles.shield,
        {
          width: shieldWidth,
          height: shieldHeight,
          borderRadius: shieldWidth * 0.1,
        }
      ]}>
        {/* Inner shield glow */}
        <View style={[
          styles.innerShield,
          {
            width: shieldWidth * 0.8,
            height: shieldHeight * 0.8,
            borderRadius: shieldWidth * 0.08,
          }
        ]} />
        
        {/* Cornell "C" */}
        <Text style={[
          styles.cornellC,
          { fontSize: logoSize * 0.25 }
        ]}>
          C
        </Text>
        
        {/* Decorative dots */}
        <View style={[
          styles.topDot,
          {
            width: logoSize * 0.05,
            height: logoSize * 0.05,
            borderRadius: logoSize * 0.025,
            top: shieldHeight * 0.2,
          }
        ]} />
        <View style={[
          styles.bottomDot,
          {
            width: logoSize * 0.05,
            height: logoSize * 0.05,
            borderRadius: logoSize * 0.025,
            bottom: shieldHeight * 0.2,
          }
        ]} />
      </View>
      
      {/* Cornell text */}
      <Text style={[
        styles.cornellText,
        { fontSize: logoSize * 0.08, marginTop: logoSize * 0.05 }
      ]}>
        CORNELL
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shield: {
    backgroundColor: '#B31B1B',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  innerShield: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
  },
  cornellC: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'serif',
    textAlign: 'center',
    zIndex: 1,
  },
  topDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
    alignSelf: 'center',
  },
  bottomDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
    alignSelf: 'center',
  },
  cornellText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default CornellLogo;