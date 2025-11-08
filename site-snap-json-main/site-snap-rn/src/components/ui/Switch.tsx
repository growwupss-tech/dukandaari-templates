import React from 'react';
import { Switch as RNSwitch, StyleSheet, View } from 'react-native';
import { colors } from '../../theme';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, disabled = false }) => {
  return (
    <RNSwitch
      value={checked}
      onValueChange={onCheckedChange}
      disabled={disabled}
      trackColor={{ false: colors.muted, true: colors.primary }}
      thumbColor={checked ? colors.primaryForeground : colors.mutedForeground}
      ios_backgroundColor={colors.muted}
    />
  );
};

