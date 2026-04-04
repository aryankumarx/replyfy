// src/styles/App.styles.ts
import { StyleSheet } from 'react-native';
import { C } from '../constants/theme';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Toast
  toast: { position: 'absolute', top: 48, left: 24, right: 24, zIndex: 999, backgroundColor: C.surfaceHighest, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(99,102,241,0.15)' },
  toastText: { color: C.onSurface, fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 18, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.white10 },
  headerBolt: { fontSize: 18, marginRight: 10 },
  headerTitle: { color: C.onSurface, fontSize: 15, fontWeight: '800', letterSpacing: 2 },

  scroll: { paddingHorizontal: 24, paddingTop: 28 },

  // Radar
  radarWrap: { alignItems: 'center', marginBottom: 36, marginTop: 8 },
  radarBox: { width: 180, height: 180, justifyContent: 'center', alignItems: 'center' },
  radarDash: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 2, borderColor: 'rgba(99,102,241,0.25)', borderStyle: 'dashed' },
  radarGlow: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(99,102,241,0.12)', borderWidth: 2, borderColor: 'rgba(99,102,241,0.08)' },
  radarOuter: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(99,102,241,0.08)', borderWidth: 1, borderColor: 'rgba(99,102,241,0.18)', justifyContent: 'center', alignItems: 'center' },
  radarCore: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(99,102,241,0.18)', justifyContent: 'center', alignItems: 'center' },
  radarLabel: { color: C.primaryDim, fontSize: 11, fontWeight: '800', letterSpacing: 2.5, marginTop: 28 },
  radarSub: { color: C.onSurfaceVar, fontSize: 12, marginTop: 4 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 36 },
  statCard: { flex: 1, backgroundColor: C.surface, paddingVertical: 18, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: C.white10 },
  statCaption: { color: C.onSurfaceVar, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 6 },
  statValue: { color: C.onSurface, fontSize: 20, fontWeight: '800' },

  // Section
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  sectionTitle: { color: C.onSurface, fontSize: 15, fontWeight: '600' },
  sectionTag: { color: C.white40, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginTop: 3 },

  // Feed
  feedCard: { backgroundColor: C.surface, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: C.white10, marginBottom: 28, position: 'relative' },
  feedIconBox: { backgroundColor: C.white10, width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  feedLabel: { color: C.onSurfaceVar, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  feedText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 22, fontStyle: 'italic' },
  feedCopyBtn: { position: 'absolute', top: 16, right: 16 },

  // Generate
  generateBtn: { borderRadius: 999, paddingVertical: 18, alignItems: 'center', marginBottom: 36, overflow: 'hidden', backgroundColor: C.primaryDim, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.45, shadowRadius: 24, elevation: 10 },
  generateInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  generateText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 2 },

  // Reply Cards
  replyCard: { backgroundColor: C.surface, borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(99,102,241,0.15)' },
  replyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  replyTag: { color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  replyHint: { color: C.outline, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  replyText: { color: C.onSurface, fontSize: 15, lineHeight: 23 },

  // Page Titles
  pageTitle: { color: C.onSurface, fontSize: 24, fontWeight: '800', marginBottom: 6 },
  pageSub: { color: C.onSurfaceVar, fontSize: 13, lineHeight: 20, marginBottom: 8 },

  // Tone Cards
  toneBadge: { backgroundColor: C.surfaceHighest, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: C.white10 },
  toneBadgeText: { color: C.onSurface, fontSize: 16, fontWeight: '800' },
  toneBadgeSub: { color: C.onSurfaceVar, fontSize: 9, fontWeight: '700', letterSpacing: 1.2, marginTop: 2 },

  toneCard: { backgroundColor: C.surface, borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1.5, borderColor: 'transparent' },
  toneCardActive: { borderColor: 'rgba(99,102,241,0.35)', backgroundColor: C.surfaceHigh },

  toneIconBox: { width: 42, height: 42, borderRadius: 14, backgroundColor: C.white10, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  toneIcon: { color: C.onSurfaceVar, fontSize: 18, fontWeight: '700' },
  toneLabel: { color: C.onSurface, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  toneDesc: { color: C.onSurfaceVar, fontSize: 12, lineHeight: 17 },

  toneToggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: C.outlineVar, justifyContent: 'center', paddingHorizontal: 3 },
  toneToggleActive: { backgroundColor: C.primaryDim },
  toneToggleDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#888' },
  toneToggleDotActive: { backgroundColor: '#fff', alignSelf: 'flex-end' },

  saveBtn: { backgroundColor: C.primaryDim, borderRadius: 999, paddingVertical: 18, alignItems: 'center', marginTop: 8, shadowColor: C.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  saveBtnText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 2 },

  // System
  groupLabel: { color: C.primaryDim, fontSize: 11, fontWeight: '800', letterSpacing: 1.8, marginBottom: 10, marginTop: 8 },
  groupCard: { backgroundColor: C.surface, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 6, marginBottom: 24, borderWidth: 1, borderColor: C.white10 },
  divider: { height: 1, backgroundColor: C.white10, marginVertical: 2 },

  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  toggleIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.white10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  toggleLabel: { color: C.onSurface, fontSize: 14, fontWeight: '600' },
  toggleSub: { color: C.onSurfaceVar, fontSize: 11, marginTop: 3, paddingRight: 16 },

  // About
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  aboutName: { color: C.onSurface, fontSize: 20, fontWeight: '800' },
  aboutVer: { color: C.onSurfaceVar, fontSize: 12, marginTop: 2 },
  aboutBadge: { backgroundColor: C.surfaceHighest, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: C.white10 },
  aboutBadgeText: { color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  aboutCaption: { color: C.onSurfaceVar, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  aboutCredit: { color: C.onSurface, fontSize: 13 },
  aboutStatsRow: { flexDirection: 'row', gap: 12, paddingVertical: 16 },
  aboutStatBox: { flex: 1, backgroundColor: C.surfaceLow, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.white10 },
  aboutStatCaption: { color: C.onSurfaceVar, fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginBottom: 6 },
  aboutStatVal: { color: C.onSurface, fontSize: 18, fontWeight: '800' },

  // Nav
  nav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 82, backgroundColor: C.surfaceLow, borderTopWidth: 1, borderTopColor: C.white10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', paddingTop: 12 },
  navTab: { alignItems: 'center', flex: 1 },
  navIconWrap: { width: 44, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  navIconWrapActive: { backgroundColor: 'rgba(99,102,241,0.15)' },
  navLabel: { color: C.outline, fontSize: 9, fontWeight: '800', letterSpacing: 1.2, marginTop: 5, opacity: 0.4 },
});
