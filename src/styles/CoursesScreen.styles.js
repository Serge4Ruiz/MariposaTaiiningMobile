import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13172e' },

  // Header
  header: {
    backgroundColor: '#1a1f3c',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#242a4e',
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { color: '#9099b2', fontSize: 13 },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800', marginTop: 2 },
  logoutBtn: { padding: 8 },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13172e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2e3560',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  resultCount: {
    color: '#5a6080',
    fontSize: 12,
    fontWeight: '600',
  },

  // List
  listContent: { padding: 16, paddingBottom: 32 },

  // Course Card — horizontal row layout
  card: {
    backgroundColor: '#1a1f3c',
    borderRadius: 14,
    flexDirection: 'row',
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#242a4e',
    alignItems: 'center',
    minHeight: 80,
  },
  thumbnailWrapper: {
    width: 90,
    height: 72,
    flexShrink: 0,
  },
  thumbnail: {
    width: 90,
    height: 72,
  },
  thumbnailLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 90,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242a4e',
  },
  thumbnailPlaceholder: {
    width: 90,
    height: 72,
    backgroundColor: '#242a4e',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  cardRight: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 11,
  },
  courseName: {
    color: '#d8ddf5',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaText: { color: '#9099b2', fontSize: 12, flex: 1, marginLeft: 4 },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242a4e',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  pillText: { color: '#9099b2', fontSize: 10, fontWeight: '600', marginLeft: 3 },

  // Action Buttons
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  watchBtn: { backgroundColor: '#4f6ef7' },
  testBtn: { backgroundColor: '#f7a94f' },
  printBtn: { backgroundColor: '#2ecc71' },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },

  // States
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#9099b2', fontSize: 14 },
  errorText: { color: '#e05c7a', fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
  emptyBox: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyTitle: { color: '#5a6080', fontSize: 16, fontWeight: '700' },
  emptySubtitle: { color: '#3d4466', fontSize: 13, textAlign: 'center' },
});
