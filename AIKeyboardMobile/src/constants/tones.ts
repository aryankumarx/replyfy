// src/constants/tones.ts
export const ALL_TONES = [
  { id: 'genz',         label: 'Gen Z',        desc: 'Internet slang, abbreviations, trending phrases',  icon: '✦' },
  { id: 'sarcastic',    label: 'Sarcastic',     desc: 'Witty comebacks with playful dry humor',           icon: '—' },
  { id: 'sweet',        label: 'Sweet',         desc: 'Warm, affectionate responses',                     icon: '♥' },
  { id: 'professional', label: 'Professional',  desc: 'Polished, business-appropriate replies',           icon: '◆' },
  { id: 'decline',      label: 'Decline',       desc: 'Politely disagree or say no to plans',             icon: '✕' },
  { id: 'quick',        label: 'Quick Reply',   desc: 'Ultra-short 2–5 word responses',                   icon: '⚡' },
];

export const MAX_TONES = 3; // Note: We lifted this restriction in App.tsx but kept the constant for reference or future toggles
