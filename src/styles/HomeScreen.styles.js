import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1f3c' },

  // Header
  header: {
    backgroundColor: '#242a4e',
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4f6ef7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  logoutBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1a1f3c',
    borderRadius: 20,
  },
  logoutText: { color: '#9099b2', fontSize: 13, fontWeight: '600' },
  greeting: { color: '#9099b2', fontSize: 15 },
  name: { color: '#ffffff', fontSize: 24, fontWeight: '800', marginTop: 2 },
  org: { color: '#4f6ef7', fontSize: 13, marginTop: 4, fontWeight: '600' },

  body: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: {
    flex: 1,
    backgroundColor: '#242a4e',
    borderRadius: 14,
    padding: 16,
    borderTopWidth: 3,
    alignItems: 'center',
  },
  statNumber: { color: '#fff', fontSize: 26, fontWeight: '800' },
  statLabel: { color: '#9099b2', fontSize: 11, marginTop: 4, textAlign: 'center' },

  // Section
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },

  // Course Cards
  courseCard: {
    backgroundColor: '#242a4e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  courseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  courseName: {
    color: '#d8ddf5',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { color: '#9099b2', fontSize: 11, fontWeight: '600' },

  emptyBox: {
    backgroundColor: '#242a4e',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: { color: '#9099b2', fontSize: 14 },
});
