import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
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
    marginBottom: 40,
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
    borderRadius: 10,
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
  },
  buttonNext: {
    backgroundColor: 'rgba(195, 98, 98, 0.41)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '300',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
},
subtleGoBackStyle: {
  backgroundColor: 'rgba(255, 255, 255, 0.15)', // More translucent
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 24,
  marginTop: 16,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.2)',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
},
subtleGoBackText: {
  color: 'rgba(255, 255, 255, 0.8)', // Slightly muted white
  fontSize: 16,
  fontWeight: '500',
  textAlign: 'center',
  letterSpacing: 0.5,
}
});