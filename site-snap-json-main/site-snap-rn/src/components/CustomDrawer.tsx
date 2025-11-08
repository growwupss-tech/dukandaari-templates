import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, spacing, fontSize } from '../theme';
import { Store, LayoutDashboard, User, Grid, Package, LogOut } from 'lucide-react-native';

type CustomDrawerNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItem {
  label: string;
  icon: React.ComponentType<any>;
  screen: 'Dashboard' | 'SellerDetails' | 'BusinessType' | 'Templates' | 'Products' | 'Settings';
}

const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
  const navigation = useNavigation<CustomDrawerNavigationProp>();
  const currentRoute = props.state.routeNames[props.state.index];

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, screen: 'Dashboard' },
    { label: 'Seller Details', icon: User, screen: 'SellerDetails' },
    { label: 'Business Type', icon: Grid, screen: 'BusinessType' },
    { label: 'Templates', icon: Store, screen: 'Templates' },
    { label: 'Product Management', icon: Package, screen: 'Products' },
  ];

  const handleLogout = () => {
    Alert.alert('Success', 'Logged out successfully');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Store size={24} color={colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.appName}>Insta2Site</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.screen;
          
          return (
            <TouchableOpacity
              key={item.screen}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => {
                props.navigation.navigate(item.screen);
              }}
              activeOpacity={0.7}
            >
              <Icon 
                size={20} 
                color={isActive ? colors.primary : colors.mutedForeground} 
                strokeWidth={2}
              />
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={colors.destructive} strokeWidth={2} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: `${colors.primary}1A`,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  menu: {
    flex: 1,
    padding: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.xs,
    backgroundColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: colors.muted,
  },
  menuLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.foreground,
  },
  menuLabelActive: {
    color: colors.foreground,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.destructive,
  },
});

export default CustomDrawer;

