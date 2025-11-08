import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button } from '../components/ui/Button';
import { StoreIcon } from '../components/StoreIcon';
import { MailIcon } from '../components/MailIcon';
import { SmartphoneIcon } from '../components/SmartphoneIcon';
import { colors, spacing, fontSize, shadows } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (method: string) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigation.replace('Main');
    }, 1500);
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.muted]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <StoreIcon size={48} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to start building your site</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={() => handleLogin('Google')}
              disabled={isLoading}
              loading={isLoading}
              size="lg"
              style={[styles.button, styles.primaryButton]}
            >
              <View style={styles.buttonContent}>
                <MailIcon size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Continue with Google</Text>
              </View>
            </Button>

            <Button
              onPress={() => handleLogin('Phone')}
              disabled={isLoading}
              variant="outline"
              size="lg"
              style={[styles.button, styles.outlineButton]}
            >
              <View style={styles.buttonContent}>
                <SmartphoneIcon size={20} color={colors.foreground} />
                <Text style={styles.outlineButtonText}>Continue with Phone</Text>
              </View>
            </Button>
          </View>

          <Text style={styles.terms}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 448, // max-w-md
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40, // mb-10
  },
  iconContainer: {
    backgroundColor: `${colors.primary}1A`, // bg-primary/10
    padding: 16, // p-4
    borderRadius: 16, // rounded-2xl
    marginBottom: 16, // mb-4
  },
  title: {
    fontSize: 30, // text-3xl
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 8, // mb-2
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16, // text-base
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16, // space-y-4
  },
  button: {
    width: '100%',
    height: 56, // h-14
    borderRadius: 16, // rounded-2xl
  },
  primaryButton: {
    ...shadows.soft,
  },
  outlineButton: {
    borderWidth: 2, // border-2
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // mr-2
  },
  buttonText: {
    fontSize: 16, // text-base
    color: '#FFFFFF',
    fontWeight: '500',
  },
  outlineButtonText: {
    fontSize: 16, // text-base
    color: colors.foreground,
    fontWeight: '500',
  },
  terms: {
    fontSize: 14, // text-sm
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 32, // mt-8
  },
});

export default LoginScreen;

