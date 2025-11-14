import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/AppNavigator';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/Button';
import ProductList from '../components/ProductList';
import CategoryList from '../components/CategoryList';
import { colors, spacing, fontSize } from '../theme';
import { dataService, Category, Product } from '../services/dataService';
import { LinearGradient } from 'expo-linear-gradient';

type ProductsScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'Products'>;

const ProductsScreen: React.FC = () => {
  const navigation = useNavigation<ProductsScreenNavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [productsOpen, setProductsOpen] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 [ProductsScreen] Loading data...');
        const [categoriesData, productsData] = await Promise.all([
          dataService.getCategories(),
          dataService.getProducts(),
        ]);
        console.log('✅ [ProductsScreen] Data loaded:', { categories: categoriesData.length, products: productsData.length });
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (error) {
        console.error('❌ [ProductsScreen] Load error:', error);
        Alert.alert('Error', 'Failed to load products or categories. Please try again.');
      }
    };
    loadData();
  }, []);

  // Removed the second useEffect that was causing products to reset
  // when categories changed. This was the root cause of products disappearing!

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FAFAFA', '#F5F5F5']} style={styles.gradientBackground}>
        <Navigation />

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Product Management</Text>
              <Text style={styles.subtitle}>Organize your catalog</Text>
            </View>

            <View style={styles.spacer} />

            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setCategoriesOpen(!categoriesOpen)}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>Categories ({categories.length})</Text>
                <View style={styles.toggleButton}>
                  <Text style={styles.toggleText}>{categoriesOpen ? 'Collapse' : 'Expand'}</Text>
                </View>
              </TouchableOpacity>
              {categoriesOpen && (
                <View style={styles.sectionContent}>
                  <CategoryList categories={categories} setCategories={setCategories} />
                </View>
              )}
            </View>

            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setProductsOpen(!productsOpen)}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>Products ({products.length})</Text>
                <View style={styles.toggleButton}>
                  <Text style={styles.toggleText}>{productsOpen ? 'Collapse' : 'Expand'}</Text>
                </View>
              </TouchableOpacity>
              {productsOpen && (
                <View style={styles.sectionContent}>
                  <ProductList 
                    products={products} 
                    setProducts={setProducts} 
                    categories={categories} 
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.floatingButtonContainer}>
          <Button 
            onPress={() => navigation.navigate('Dashboard')} 
            size="lg" 
            style={styles.floatingButton}
          >
            <Text style={styles.floatingButtonText}>Continue to Dashboard</Text>
          </Button>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    maxWidth: 896,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: spacing.xl,
    paddingTop: spacing.xl,
  },
  titleContainer: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.mutedForeground,
  },
  spacer: {
    height: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 0,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.foreground,
  },
  toggleButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  toggleText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.foreground,
  },
  sectionContent: {
    // No border top needed - seamless transition
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  floatingButton: {
    height: 56,
    paddingHorizontal: spacing.xl * 1.5,
    borderRadius: 9999,
  },
  floatingButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});

export default ProductsScreen;

