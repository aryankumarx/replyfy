// src/components/Icons.tsx
import React from 'react';
import { View, Text } from 'react-native';

export const SparkleIcon = () => (
  <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ position: 'absolute', width: 3, height: 14, backgroundColor: '#fff', borderRadius: 1.5 }} />
    <View style={{ position: 'absolute', width: 14, height: 3, backgroundColor: '#fff', borderRadius: 1.5 }} />
    <View style={{ position: 'absolute', width: 3, height: 10, backgroundColor: '#fff', borderRadius: 1.5, transform: [{ rotate: '45deg' }] }} />
    <View style={{ position: 'absolute', width: 10, height: 3, backgroundColor: '#fff', borderRadius: 1.5, transform: [{ rotate: '45deg' }] }} />
    <View style={{ position: 'absolute', top: 0, right: 0, width: 1.5, height: 6, backgroundColor: '#fff', borderRadius: 1 }} />
    <View style={{ position: 'absolute', top: 2, right: -2, width: 6, height: 1.5, backgroundColor: '#fff', borderRadius: 1 }} />
  </View>
);

export const HomeIcon = ({ color }: { color: string }) => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'flex-end' }}>
    <View style={{ position: 'absolute', top: 0, width: 0, height: 0, borderLeftWidth: 11, borderRightWidth: 11, borderBottomWidth: 9, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color }} />
    <View style={{ width: 16, height: 11, borderWidth: 2, borderColor: color, borderTopWidth: 0, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }}>
      <View style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: 5, height: 6, backgroundColor: color, borderTopLeftRadius: 2, borderTopRightRadius: 2 }} />
    </View>
  </View>
);

export const PaletteIcon = ({ color }: { color: string }) => (
  <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 22, height: 20, borderRadius: 10, borderWidth: 2, borderColor: color, justifyContent: 'center', alignItems: 'center' }} />
    <View style={{ position: 'absolute', bottom: 2, right: 2, width: 5, height: 5, borderRadius: 2.5, borderWidth: 1.5, borderColor: color, backgroundColor: 'transparent' }} />
    <View style={{ position: 'absolute', top: 4, left: 5, width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: color }} />
    <View style={{ position: 'absolute', top: 3.5, right: 5.5, width: 3, height: 3, borderRadius: 1.5, backgroundColor: color, opacity: 0.7 }} />
    <View style={{ position: 'absolute', bottom: 5.5, left: 4, width: 3, height: 3, borderRadius: 1.5, backgroundColor: color, opacity: 0.5 }} />
  </View>
);

export const GearIcon = ({ color }: { color: string }) => (
  <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: color }} />
    <View style={{ position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
    <View style={{ position: 'absolute', top: 0, width: 2.5, height: 5, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', bottom: 0, width: 2.5, height: 5, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', left: 0, width: 5, height: 2.5, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', right: 0, width: 5, height: 2.5, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

export const PipIcon = ({ color }: { color: string }) => (
  <View style={{ width: 20, height: 16, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 20, height: 14, borderRadius: 2, borderWidth: 1.8, borderColor: color }} />
    <View style={{ position: 'absolute', bottom: 2.5, right: 2, width: 8, height: 6, borderRadius: 1.5, backgroundColor: color }} />
  </View>
);

export const ClipboardIcon = ({ color }: { color: string }) => (
  <View style={{ width: 16, height: 20, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 16, height: 18, borderRadius: 2.5, borderWidth: 1.8, borderColor: color, marginTop: 2 }} />
    <View style={{ position: 'absolute', top: 0, width: 8, height: 4, borderRadius: 1.5, borderWidth: 1.5, borderColor: color, backgroundColor: 'transparent' }} />
    <View style={{ position: 'absolute', top: 9, left: 4, width: 8, height: 1.4, backgroundColor: color, borderRadius: 1, opacity: 0.6 }} />
    <View style={{ position: 'absolute', top: 12.5, left: 4, width: 6, height: 1.4, backgroundColor: color, borderRadius: 1, opacity: 0.4 }} />
  </View>
);
