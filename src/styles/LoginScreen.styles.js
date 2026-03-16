import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f3c',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },

  // Brand
  brandArea: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4f6ef7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#4f6ef7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  logoText: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
  },
  brandName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  brandTagline: {
    color: '#9099b2',
    fontSize: 13,
    marginTop: 4,
    letterSpacing: 0.3,
  },

  // Card
  card: {
    backgroundColor: '#242a4e',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardSubtitle: {
    color: '#9099b2',
    fontSize: 14,
    marginBottom: 24,
  },

  // Error Banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3d1f2a',
    borderLeftWidth: 4,
    borderLeftColor: '#e05c7a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    color: '#e05c7a',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },

  // Inputs
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    color: '#c0c7df',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1f3c',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#343c68',
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
  },
  eyeButton: {
    padding: 6,
  },

  // Button
  button: {
    backgroundColor: '#4f6ef7',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4f6ef7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Footer
  footer: {
    color: '#4a5070',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 32,
  },
});
