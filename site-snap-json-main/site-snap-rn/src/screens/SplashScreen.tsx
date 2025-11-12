import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import { StoreIcon } from '../components/StoreIcon';
import { colors, fontSize } from '../theme';
import { getCurrentUser } from '../services/authService';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const floatAnim = new Animated.Value(0);

  useEffect(() => {
    // Scale and fade animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate after 2.5 seconds
    const timer = setTimeout(() => {
      getCurrentUser()
        .then((user) => {
          if (user) {
            navigation.replace('Main');
          } else {
            navigation.replace('Login');
          }
        })
        .catch(() => {
          navigation.replace('Login');
        });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={[colors.primary, colors.accent]} style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ translateY: floatAnim }],
            },
          ]}
        >
          <StoreIcon size={80} color="#FFFFFF" strokeWidth={1.5} />
        </Animated.View>
        <Text style={styles.title}>Insta2Site</Text>
        <Text style={styles.subtitle}>Build your business online, instantly</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // bg-white/20
    padding: 24, // p-6
    borderRadius: 24, // rounded-3xl
    marginBottom: 24, // mb-6
  },
  title: {
    fontSize: 48, // text-5xl
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12, // mb-3
    letterSpacing: -0.5, // tracking-tight
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20, // text-xl
    color: 'rgba(255, 255, 255, 0.9)', // text-white/90
    fontWeight: '300', // font-light
    textAlign: 'center',
  },
});

export default SplashScreen;

