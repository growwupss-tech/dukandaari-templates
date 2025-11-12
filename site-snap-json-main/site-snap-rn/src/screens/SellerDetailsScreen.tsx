import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/AppNavigator';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowRightIcon } from '../components/ArrowRightIcon';
import { colors, spacing, fontSize, shadows } from '../theme';
import { dataService } from '../services/dataService';
import { LinearGradient } from 'expo-linear-gradient';

type SellerDetailsScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'SellerDetails'>;

const SellerDetailsScreen: React.FC = () => {
  const navigation = useNavigation<SellerDetailsScreenNavigationProp>();
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    workAddress: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const seller = await dataService.getSeller();
      setFormData({
        name: seller.name || '',
        businessName: seller.businessName || '',
        phone: seller.phone || '',
        workAddress: seller.workAddress || '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load seller details. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.businessName || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await dataService.updateSeller(formData);
      navigation.navigate('BusinessType');
    } catch (error) {
      Alert.alert('Error', 'Unable to save your details. Please try again.');
    }
  };

  return (
    <LinearGradient colors={[colors.background, colors.muted]} style={styles.container}>
      {/* Navigation Header */}
      <Navigation />

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Tell us about yourself</Text>
            <Text style={styles.subtitle}>We'll use this to personalize your site</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Name *</Text>
              <Input
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="John Doe"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Name *</Text>
              <Input
                value={formData.businessName}
                onChangeText={(text) => setFormData({ ...formData, businessName: text })}
                placeholder="My Awesome Store"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <Input
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="+1 234 567 8900"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Work Address (Optional)</Text>
              <Input
                value={formData.workAddress}
                onChangeText={(text) => setFormData({ ...formData, workAddress: text })}
                placeholder="123 Business St, City"
                style={styles.input}
              />
            </View>
          </View>

          {/* Add bottom padding to prevent content from being hidden behind button */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Fixed Bottom-Right Button */}
      <View style={styles.fixedButtonContainer}>
        <Button 
          onPress={handleSubmit} 
          size="lg" 
          style={[styles.nextButton, shadows.strong]}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Next</Text>
            <ArrowRightIcon size={20} color="#FFFFFF" />
          </View>
        </Button>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for fixed button
  },
  content: {
    maxWidth: 448, // max-w-md
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 80, // pt-20
  },
  titleContainer: {
    marginBottom: 32, // mb-8
  },
  title: {
    fontSize: 30, // text-3xl
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 8, // mb-2
  },
  subtitle: {
    fontSize: 16, // text-base
    color: colors.mutedForeground,
  },
  form: {
    gap: 24, // space-y-6
  },
  inputGroup: {
    gap: 8, // space-y-2
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  input: {
    height: 48, // h-12
    borderRadius: 12, // rounded-xl
  },
  bottomSpacer: {
    height: 40,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 24, // bottom-6
    right: 24, // right-6
    zIndex: 50,
  },
  nextButton: {
    height: 56, // h-14
    paddingHorizontal: 32, // px-8
    borderRadius: 28, // rounded-full
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // ml-2
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default SellerDetailsScreen;

