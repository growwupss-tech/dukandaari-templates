import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button } from '../components/ui/Button';
import { StoreIcon } from '../components/StoreIcon';
import { MailIcon } from '../components/MailIcon';
import { colors, spacing, fontSize, shadows } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../components/ui/Input';
import { register } from '../services/authService';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      // Call register endpoint which sends OTP
      const response = await register(email.trim(), password);

      // Navigate to OTP screen with OTP data from response
      const { otpCode, otpExpiresAt } = response.data;
      navigation.navigate('SignUpOTP', {
        email: email.trim(),
        password,
        otpCode,
        otpExpiresAt,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Failed to create account. Please try again.';
      Alert.alert('Sign Up Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us and start your journey</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.inputWrapper}
              editable={!isLoading}
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
              containerStyle={styles.inputWrapper}
              editable={!isLoading}
            />
            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              secureTextEntry
              containerStyle={styles.inputWrapper}
              editable={!isLoading}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={handleSignUp}
              disabled={isLoading}
              loading={isLoading}
              size="lg"
              style={[styles.button, styles.primaryButton]}
            >
              <View style={styles.buttonContent}>
                <MailIcon size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Create Account</Text>
              </View>
            </Button>
          </View>

          {/* Already registered? Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already registered? </Text>
            <TouchableOpacity onPress={handleNavigateToLogin} disabled={isLoading}>
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
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
  formContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  inputWrapper: {
    width: '100%',
  },
  button: {
    width: '100%',
    height: 56, // h-14
    borderRadius: 16, // rounded-2xl
  },
  primaryButton: {
    ...shadows.soft,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  terms: {
    fontSize: 14, // text-sm
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default SignUpScreen;
