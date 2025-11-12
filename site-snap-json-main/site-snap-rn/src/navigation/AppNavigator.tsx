import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignUpOTPScreen from '../screens/SignUpOTPScreen';
import SellerDetailsScreen from '../screens/SellerDetailsScreen';
import BusinessTypeScreen from '../screens/BusinessTypeScreen';
import TemplatesScreen from '../screens/TemplatesScreen';
import ProductsScreen from '../screens/ProductsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CustomDrawer from '../components/CustomDrawer';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  SignUpOTP: { email: string; password: string; otpCode: string; otpExpiresAt: string };
  Main: undefined;
};

export type DrawerParamList = {
  Dashboard: undefined;
  SellerDetails: undefined;
  BusinessType: undefined;
  Templates: undefined;
  Products: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="SellerDetails" component={SellerDetailsScreen} />
      <Drawer.Screen name="BusinessType" component={BusinessTypeScreen} />
      <Drawer.Screen name="Templates" component={TemplatesScreen} />
      <Drawer.Screen name="Products" component={ProductsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignUpOTP" component={SignUpOTPScreen} />
      <Stack.Screen name="Main" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}

