import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13172e' },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#1a1f3c',
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#242a4e',
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerTitleCol: { flex: 1 },
  headerCourseName: {
    color: '#d8ddf5',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  headerSubtitle: {
    color: '#9099b2',
    fontSize: 12,
    marginTop: 2,
  },

  // ── Loading / Error ──────────────────────────────────────────────────────────
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#9099b2', fontSize: 14 },
  errorText: {
    color: '#e05c7a',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: '#4f6ef7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // ── Progress bar ─────────────────────────────────────────────────────────────
  progressBarWrap: {
    backgroundColor: '#1a1f3c',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#242a4e',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: { color: '#9099b2', fontSize: 12 },
  progressPercent: { color: '#4f6ef7', fontSize: 12, fontWeight: '700' },
  progressTrack: {
    height: 4,
    backgroundColor: '#242a4e',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: '#4f6ef7',
    borderRadius: 2,
  },

  // ── Slide area ───────────────────────────────────────────────────────────────
  scrollContent: { padding: 20, paddingBottom: 40 },

  // ── Slide image ───────────────────────────────────────────────────────────────
  slideImageWrapper: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#0d1124',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#242a4e',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },

  // ── Slide number badge ────────────────────────────────────────────────────────
  slideNumberBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#242a4e',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slideNumberText: { color: '#9099b2', fontSize: 12, fontWeight: '600' },

  transcriptCard: {
    backgroundColor: '#1a1f3c',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#242a4e',
    padding: 20,
    marginBottom: 24,
  },
  transcriptLabel: {
    color: '#4f6ef7',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  transcriptText: {
    color: '#d8ddf5',
    fontSize: 16,
    lineHeight: 26,
  },

  // ── Controls ─────────────────────────────────────────────────────────────────
  controls: {
    backgroundColor: '#1a1f3c',
    borderTopWidth: 1,
    borderTopColor: '#242a4e',
    paddingHorizontal: 24,
    paddingVertical: 18,
    paddingBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  controlBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#242a4e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4f6ef7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f6ef7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  // ── Time indicator ────────────────────────────────────────────────────────────
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#13172e',
  },
  timeText: { color: '#5a6080', fontSize: 11 },

  // ── Complete state ────────────────────────────────────────────────────────────
  completeCard: {
    backgroundColor: '#1b3d2e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2ecc71',
    padding: 28,
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  completeTitle: {
    color: '#2ecc71',
    fontSize: 22,
    fontWeight: '800',
  },
  completeSubtitle: {
    color: '#9099b2',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
