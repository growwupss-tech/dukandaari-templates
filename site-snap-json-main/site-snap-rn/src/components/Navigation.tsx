import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StoreIcon } from './StoreIcon';
import { colors, spacing, fontSize } from '../theme';

interface NavigationProps {
  title?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ title = 'Insta2Site' }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View style={styles.container}>
      {/* Menu Button */}
      <TouchableOpacity 
        onPress={() => navigation.openDrawer()} 
        style={styles.menuButton}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      {/* Center Title with Icon */}
      <View style={styles.titleContainer}>
        <StoreIcon size={24} color={colors.primary} strokeWidth={1.5} />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Spacer for centering */}
      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + 8,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // bg-background/80
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuButton: {
    padding: spacing.sm,
    borderRadius: 12, // rounded-xl
  },
  menuIcon: {
    fontSize: 24, // h-6 w-6
    color: colors.foreground,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
  },
  title: {
    fontSize: 18, // text-lg
    fontWeight: 'bold',
    color: colors.foreground,
  },
  spacer: {
    width: 40, // Spacer for centering
  },
});

