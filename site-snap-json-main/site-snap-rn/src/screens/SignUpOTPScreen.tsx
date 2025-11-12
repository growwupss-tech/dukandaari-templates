import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button } from '../components/ui/Button';
import { colors, spacing, fontSize, shadows } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { verifyEmailOTP, resendOTP } from '../services/authService';
import { MailIcon } from '../components/MailIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpOTP'>;

const SignUpOTPScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email, password, otpCode, otpExpiresAt } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const otpInputRef = useRef<TextInput>(null);

  // Timer for resend OTP
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Error', 'OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      // Call verify OTP endpoint with all required data
      await verifyEmailOTP(email, otp, password, otpCode, otpExpiresAt);

      Alert.alert('Success', 'Email verified successfully!', [
        {
          text: 'Continue',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          },
        },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Failed to verify OTP';
      Alert.alert('Verification Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
      await resendOTP(email);
      setTimeLeft(300); // Reset timer to 5 minutes
      setOtp('');
      Alert.alert('Success', 'OTP sent to your email');
      otpInputRef.current?.focus();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Failed to resend OTP';
      Alert.alert('Error', message);
    } finally {
      setResending(false);
    }
  };

  const handleBackToLogin = () => {
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MailIcon size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpSection}>
            <Text style={styles.otpLabel}>Enter OTP</Text>
            <TextInput
              ref={otpInputRef}
              style={styles.otpInput}
              placeholder="000000"
              placeholderTextColor={colors.border}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              editable={!loading}
              autoFocus
            />
          </View>

          {/* Timer */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              Code expires in: <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
            </Text>
          </View>

          {/* Verify Button */}
          <Button
            onPress={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
            loading={loading}
            size="lg"
            style={[styles.button, styles.primaryButton]}
          >
            <Text style={styles.buttonText}>Verify OTP</Text>
          </Button>

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            {resending ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={timeLeft > 0 || resending || loading}
              >
                <Text
                  style={[
                    styles.resendLink,
                    {
                      opacity: timeLeft > 0 || resending || loading ? 0.5 : 1,
                    },
                  ]}
                >
                  Resend OTP
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={handleBackToLogin}
            style={styles.backButton}
            disabled={loading}
          >
            <Text style={styles.backText}>← Back to Login</Text>
          </TouchableOpacity>
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
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    backgroundColor: `${colors.primary}1A`,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
  },
  emailText: {
    fontWeight: '600',
    color: colors.foreground,
  },
  otpSection: {
    width: '100%',
    marginBottom: 24,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 12,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 8,
    color: colors.foreground,
    textAlign: 'center',
    backgroundColor: colors.background,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  timerValue: {
    fontWeight: '600',
    color: colors.foreground,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    marginBottom: 20,
  },
  primaryButton: {
    ...shadows.soft,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default SignUpOTPScreen;
