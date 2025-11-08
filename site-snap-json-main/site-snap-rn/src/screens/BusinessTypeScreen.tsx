import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/AppNavigator';
import { Navigation } from '../components/Navigation';
import { Card } from '../components/ui/Card';
import { colors, spacing, fontSize, shadows } from '../theme';
import { dataService } from '../services/dataService';
import { LinearGradient } from 'expo-linear-gradient';
import { Briefcase, ShoppingBag, Check } from 'lucide-react-native';

type BusinessTypeScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'BusinessType'>;

const BusinessTypeScreen: React.FC = () => {
  const navigation = useNavigation<BusinessTypeScreenNavigationProp>();
  const [selectedType, setSelectedType] = useState('');
  const scaleAnim1 = React.useRef(new Animated.Value(1)).current;
  const scaleAnim2 = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const seller = await dataService.getSeller();
    setSelectedType(seller.businessType || '');
  };

  const handleSelect = async (type: string) => {
    setSelectedType(type);
    await dataService.updateSeller({ businessType: type });
    navigation.navigate('Templates');
  };

  const handlePressIn = (scaleAnim: Animated.Value) => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleAnim: Animated.Value) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient 
      colors={['#FAFAFA', '#F5F5F5']} 
      style={styles.container}
    >
      <Navigation />

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What best describes your business?</Text>
          <Text style={styles.subtitle}>Choose the option that fits your needs</Text>
        </View>

        <View style={styles.cardsContainer}>
          <Animated.View style={{ transform: [{ scale: scaleAnim1 }] }}>
            <TouchableOpacity
              onPress={() => handleSelect('Portfolio')}
              onPressIn={() => handlePressIn(scaleAnim1)}
              onPressOut={() => handlePressOut(scaleAnim1)}
              activeOpacity={1}
              style={styles.cardWrapper}
            >
              <Card
                style={[
                  styles.card,
                  selectedType === 'Portfolio' ? styles.selectedCardPrimary : undefined,
                ].filter(Boolean) as ViewStyle[]}
              >
                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, styles.primaryIconBg]}>
                    <Briefcase size={64} color={colors.primary} strokeWidth={1.5} />
                    {selectedType === 'Portfolio' && (
                      <View style={styles.checkmarkPrimary}>
                        <Check size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardTitle}>Portfolio</Text>
                  <Text style={styles.cardDescription}>
                    Showcase your work, skills, and creative projects
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: scaleAnim2 }] }}>
            <TouchableOpacity
              onPress={() => handleSelect('Product Seller')}
              onPressIn={() => handlePressIn(scaleAnim2)}
              onPressOut={() => handlePressOut(scaleAnim2)}
              activeOpacity={1}
              style={styles.cardWrapper}
            >
              <Card
                style={[
                  styles.card,
                  selectedType === 'Product Seller' ? styles.selectedCardAccent : undefined,
                ].filter(Boolean) as ViewStyle[]}
              >
                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, styles.accentIconBg]}>
                    <ShoppingBag size={64} color={colors.accent} strokeWidth={1.5} />
                    {selectedType === 'Product Seller' && (
                      <View style={styles.checkmarkAccent}>
                        <Check size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardTitle}>Product Seller</Text>
                  <Text style={styles.cardDescription}>
                    Display and sell your products with a beautiful catalog
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
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
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
    paddingBottom: spacing.xxl,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl * 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.xs,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  cardsContainer: {
    gap: spacing.xl,
  },
  cardWrapper: {
    width: '100%',
  },
  card: {
    padding: spacing.xl * 1.5,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.card,
    ...shadows.soft,
  },
  selectedCardPrimary: {
    borderColor: colors.primary,
    borderWidth: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedCardAccent: {
    borderColor: colors.accent,
    borderWidth: 2,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    padding: 24,
    borderRadius: 48,
    marginBottom: spacing.sm,
    position: 'relative',
  },
  primaryIconBg: {
    backgroundColor: 'rgba(10, 61, 255, 0.1)',
  },
  accentIconBg: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  checkmarkPrimary: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkAccent: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.accent,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    fontSize: 16,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default BusinessTypeScreen;

