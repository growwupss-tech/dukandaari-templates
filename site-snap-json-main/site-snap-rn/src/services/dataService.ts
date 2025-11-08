import AsyncStorage from '@react-native-async-storage/async-storage';

// Import JSON data files (bundled with app)
import defaultSellerData from '../data/seller.json';
import defaultCategoriesData from '../data/categories.json';
import defaultProductsData from '../data/products.json';
import templatesData from '../data/templates.json';
import defaultAnalyticsData from '../data/analytics.json';

// Type definitions
export interface Seller {
  id: string;
  name: string;
  businessName: string;
  businessType: string;
  phone: string;
  workAddress: string;
  selectedTemplateIds: string[];
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
}

export interface Category {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  videos: string[];
  inventory: 'none' | 'in stock' | 'out of stock';
  specifications: string[];
  attributes: { name: string; values: string[] }[];
  visible: number;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  sellerId: string;
  totalVisitors: number;
  whatsappInquiries: number;
  productViews: number;
  productPerformance: {
    lastDay: ProductPerformance[];
    lastWeek: ProductPerformance[];
    lastMonth: ProductPerformance[];
    allTime: ProductPerformance[];
  };
  visitorData: {
    last15Days: VisitorDataPoint[];
    last30Days: VisitorDataPoint[];
    last6Months: VisitorDataPoint[];
    lastYear: VisitorDataPoint[];
  };
  updatedAt: string;
}

export interface ProductPerformance {
  id: string;
  productId: string;
  name: string;
  views: number;
  inquiries: number;
  clicks: number;
  conversionRate: number;
}

export interface VisitorDataPoint {
  date: string;
  visitors: number;
}

// Data Service Class
class DataService {
  private SELLER_KEY = 'seller_data';
  private PRODUCTS_KEY = 'products_data';
  private CATEGORIES_KEY = 'categories_data';
  private ANALYTICS_KEY = 'analytics_data';
  private INITIALIZED_KEY = 'data_initialized';

  // Generate unique ID
  generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize data from JSON files on first run
  private async initializeFromJSON(): Promise<void> {
    try {
      const initialized = await AsyncStorage.getItem(this.INITIALIZED_KEY);
      
      if (!initialized) {
        console.log('Initializing data from JSON files...');
        
        // Initialize seller
        await AsyncStorage.setItem(this.SELLER_KEY, JSON.stringify(defaultSellerData));
        
        // Initialize categories
        await AsyncStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(defaultCategoriesData));
        
        // Initialize products
        await AsyncStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(defaultProductsData));
        
        // Initialize analytics
        await AsyncStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(defaultAnalyticsData));
        
        // Mark as initialized
        await AsyncStorage.setItem(this.INITIALIZED_KEY, 'true');
        
        console.log('Data initialized from JSON files successfully!');
      }
    } catch (error) {
      console.error('Error initializing data from JSON:', error);
    }
  }

  // Seller operations
  async getSeller(): Promise<Seller> {
    await this.initializeFromJSON();
    
    try {
      const stored = await AsyncStorage.getItem(this.SELLER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error getting seller:', error);
    }

    // Fallback to default
    return defaultSellerData as Seller;
  }

  async saveSeller(seller: Seller): Promise<void> {
    try {
      seller.updatedAt = new Date().toISOString();
      await AsyncStorage.setItem(this.SELLER_KEY, JSON.stringify(seller));
    } catch (error) {
      console.error('Error saving seller:', error);
    }
  }

  async updateSeller(updates: Partial<Omit<Seller, 'id' | 'createdAt'>>): Promise<Seller> {
    const seller = await this.getSeller();
    const updatedSeller = { ...seller, ...updates };
    await this.saveSeller(updatedSeller);
    return updatedSeller;
  }

  // Template operations (loaded from JSON, read-only)
  async getTemplates(): Promise<Template[]> {
    // Templates are loaded directly from bundled JSON
    return templatesData as Template[];
  }

  async linkTemplatesToSeller(templateIds: string[]): Promise<void> {
    const seller = await this.getSeller();
    seller.selectedTemplateIds = templateIds;
    await this.saveSeller(seller);
  }

  async getSelectedTemplates(): Promise<string[]> {
    const seller = await this.getSeller();
    return seller.selectedTemplateIds;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    await this.initializeFromJSON();
    
    try {
      const stored = await AsyncStorage.getItem(this.CATEGORIES_KEY);
      const seller = await this.getSeller();

      if (stored) {
        const categories = JSON.parse(stored);
        return categories.filter((cat: Category) => cat.sellerId === seller.id);
      }
    } catch (error) {
      console.error('Error getting categories:', error);
    }

    return [];
  }

  async saveCategories(categories: Category[]): Promise<void> {
    try {
      const seller = await this.getSeller();
      const allCategories = await this.getAllCategories();

      const otherCategories = allCategories.filter(cat => cat.sellerId !== seller.id);
      const linkedCategories = categories.map(cat => ({
        ...cat,
        sellerId: seller.id,
      }));

      await AsyncStorage.setItem(
        this.CATEGORIES_KEY,
        JSON.stringify([...otherCategories, ...linkedCategories])
      );
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }

  private async getAllCategories(): Promise<Category[]> {
    try {
      const stored = await AsyncStorage.getItem(this.CATEGORIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting all categories:', error);
      return [];
    }
  }

  async addCategory(category: Omit<Category, 'id' | 'sellerId' | 'createdAt'>): Promise<Category> {
    const seller = await this.getSeller();
    const newCategory: Category = {
      ...category,
      id: this.generateId('category'),
      sellerId: seller.id,
      createdAt: new Date().toISOString(),
    };

    const categories = await this.getCategories();
    categories.push(newCategory);
    await this.saveCategories(categories);

    return newCategory;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    await this.initializeFromJSON();
    
    try {
      const stored = await AsyncStorage.getItem(this.PRODUCTS_KEY);
      const seller = await this.getSeller();

      if (stored) {
        const products = JSON.parse(stored);
        return products
          .filter((prod: any) => prod.sellerId === seller.id)
          .map((prod: any) => {
            // Ensure all fields exist
            if (prod.specifications && prod.specifications.length > 0) {
              const firstSpec = prod.specifications[0];
              if (typeof firstSpec === 'object' && firstSpec.key !== undefined) {
                prod.specifications = prod.specifications
                  .map((s: any) => (s.key && s.value ? `${s.key}: ${s.value}` : ''))
                  .filter((s: string) => s);
              }
            }
            if (typeof prod.inventory === 'number') {
              prod.inventory = prod.inventory > 0 ? 'in stock' : 'out of stock';
            }
            if (prod.visible === undefined) {
              prod.visible = 1;
            }
            if (!prod.videos) {
              prod.videos = [];
            }
            if (!prod.attributes) {
              prod.attributes = [];
            }
            return prod;
          });
      }
    } catch (error) {
      console.error('Error getting products:', error);
    }

    return [];
  }

  async saveProducts(products: Product[]): Promise<void> {
    try {
      const seller = await this.getSeller();
      const allProducts = await this.getAllProducts();

      const otherProducts = allProducts.filter(prod => prod.sellerId !== seller.id);
      const linkedProducts = products.map(prod => ({
        ...prod,
        sellerId: seller.id,
      }));

      await AsyncStorage.setItem(
        this.PRODUCTS_KEY,
        JSON.stringify([...otherProducts, ...linkedProducts])
      );
    } catch (error) {
      console.error('Error saving products:', error);
    }
  }

  private async getAllProducts(): Promise<Product[]> {
    try {
      const stored = await AsyncStorage.getItem(this.PRODUCTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting all products:', error);
      return [];
    }
  }

  async addProduct(product: Omit<Product, 'id' | 'sellerId' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const seller = await this.getSeller();
    const newProduct: Product = {
      ...product,
      id: this.generateId('product'),
      sellerId: seller.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const products = await this.getProducts();
    products.push(newProduct);
    await this.saveProducts(products);

    return newProduct;
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<Product | null> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveProducts(products);
    return products[index];
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== productId);

    if (filtered.length === products.length) return false;

    await this.saveProducts(filtered);
    return true;
  }

  // Analytics operations
  async getAnalytics(): Promise<Analytics> {
    await this.initializeFromJSON();
    
    try {
      const stored = await AsyncStorage.getItem(this.ANALYTICS_KEY);
      const seller = await this.getSeller();

      if (stored) {
        const analytics = JSON.parse(stored);
        if (analytics.sellerId === seller.id) {
          return analytics;
        }
      }
    } catch (error) {
      console.error('Error getting analytics:', error);
    }

    // Return default analytics
    const seller = await this.getSeller();
    const defaultAnalytics = {
      ...defaultAnalyticsData,
      sellerId: seller.id,
    };
    
    await this.saveAnalytics(defaultAnalytics as Analytics);
    return defaultAnalytics as Analytics;
  }

  async saveAnalytics(analytics: Analytics): Promise<void> {
    try {
      analytics.updatedAt = new Date().toISOString();
      await AsyncStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.error('Error saving analytics:', error);
    }
  }

  async updateAnalytics(updates: Partial<Omit<Analytics, 'sellerId'>>): Promise<Analytics> {
    const analytics = await this.getAnalytics();
    const updatedAnalytics = { ...analytics, ...updates };
    await this.saveAnalytics(updatedAnalytics);
    return updatedAnalytics;
  }

  // Export data to JSON format (for syncing with web app)
  async exportAllData(): Promise<{
    seller: Seller;
    categories: Category[];
    products: Product[];
    analytics: Analytics;
  }> {
    const seller = await this.getSeller();
    const categories = await this.getCategories();
    const products = await this.getProducts();
    const analytics = await this.getAnalytics();

    return {
      seller,
      categories,
      products,
      analytics,
    };
  }

  // Import data from JSON format (for syncing with web app)
  async importAllData(data: {
    seller?: Seller;
    categories?: Category[];
    products?: Product[];
    analytics?: Analytics;
  }): Promise<void> {
    try {
      if (data.seller) {
        await this.saveSeller(data.seller);
      }
      if (data.categories) {
        await this.saveCategories(data.categories);
      }
      if (data.products) {
        await this.saveProducts(data.products);
      }
      if (data.analytics) {
        await this.saveAnalytics(data.analytics);
      }
      console.log('Data imported successfully!');
    } catch (error) {
      console.error('Error importing data:', error);
    }
  }

  // Reset to default JSON data
  async resetToDefaults(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.INITIALIZED_KEY);
      await this.initializeFromJSON();
      console.log('Data reset to defaults!');
    } catch (error) {
      console.error('Error resetting to defaults:', error);
    }
  }

  // Reset all data (clear everything)
  async resetAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.SELLER_KEY,
        this.PRODUCTS_KEY,
        this.CATEGORIES_KEY,
        this.ANALYTICS_KEY,
        this.INITIALIZED_KEY,
      ]);
      console.log('All data cleared!');
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  }
}

// Export singleton instance
export const dataService = new DataService();
