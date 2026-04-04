// src/components/Shared.tsx
import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { C } from '../constants/theme';
import { styles as s } from '../styles/App.styles';

export const ToggleRow = ({ icon, label, sub, value, onChange, color }: any) => (
  <View style={s.toggleRow}>
    <View style={s.toggleIcon}>
      {typeof icon === 'string' ? <Text style={{ fontSize: 16 }}>{icon}</Text> : icon}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={s.toggleLabel}>{label}</Text>
      <Text style={s.toggleSub}>{sub}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: C.outlineVar, true: color }}
      thumbColor="#fff"
    />
  </View>
);

export const NavTab = ({ id, label, icon: IconComp, active, onPress }: any) => {
  const isActive = active === id;
  const iconColor = isActive ? C.primary : C.outline;
  return (
    <TouchableOpacity style={s.navTab} activeOpacity={0.7} onPress={() => onPress(id)}>
      <View style={[s.navIconWrap, isActive && s.navIconWrapActive]}>
        <IconComp color={iconColor} />
      </View>
      <Text style={[s.navLabel, isActive && { color: C.primary, opacity: 1 }]}>{label}</Text>
    </TouchableOpacity>
  );
};
