import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: '#1a1f3c',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#2e3560',
  },
  label: {
    color: '#9099b2',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  name: {
    color: '#d8ddf5',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 20,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#4f6ef7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
