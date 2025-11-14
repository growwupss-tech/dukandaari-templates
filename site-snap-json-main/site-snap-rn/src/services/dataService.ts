import templatesData from '../data/templates.json';
import { apiClient } from '../lib/apiClient';
import { getCurrentUser, AuthUser } from './authService';
import { getToken } from '../lib/tokenStorage';

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
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  categoryId: string | null;
  name: string;
  price: number;
  description: string;
  images: string[];
  videos: string[];
  inventory: 'none' | 'in stock' | 'out of stock';
  specifications: string[];
  attributes: { name: string; values: string[] }[];
  attribute_ids: string[];
  visible: number;
  views: number;
  clicks: number;
  inquiries: number;
  conversionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface Attribute {
  id: string;
  name: string;
  options: string[];
  createdAt: string;
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

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  count: number;
}

type ApiSeller = {
  _id: string;
  name?: string;
  phone_number?: string;
  whatsapp_number?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
};

type ApiBusiness = {
  _id: string;
  business_name?: string;
  business_tagline?: string;
  business_email_add?: string;
  template_id?: number;
  seller_id?: any;
  createdAt: string;
  updatedAt: string;
};

type ApiCategory = {
  _id: string;
  category_name: string;
  seller_id: any;
  createdAt: string;
  updatedAt: string;
};

type ApiAttribute = {
  _id: string;
  attribute_name: string;
  options: string[];
  createdAt: string;
  updatedAt: string;
};

type ApiProduct = {
  _id: string;
  product_name: string;
  product_descriptio?: string;
  price?: number;
  images?: string[];
  is_visible?: boolean;
  inventory?: string;
  category_id?: any;
  seller_id?: any;
  attribute_ids?: any[];
  visits?: number;
  redirects?: number;
  createdAt: string;
  updatedAt: string;
};

type ApiAnalytics = {
  _id: string;
  business_id: any;
  product_ids: any[];
  views?: number;
  clicks?: number;
  date?: string;
  createdAt: string;
  updatedAt: string;
};

const TEMPLATE_ID_MAP: Record<string, number> = {
  Portfolio: 1,
  'Product Seller': 2,
};

const TEMPLATE_KEY_TO_NUM: Record<string, number> = {};
const NUM_TO_TEMPLATE_KEY: Record<number, string> = {};

(templatesData as Template[]).forEach((template, index) => {
  const numericId = index + 1;
  TEMPLATE_KEY_TO_NUM[template.id] = numericId;
  NUM_TO_TEMPLATE_KEY[numericId] = template.id;
});

class DataService {
  private user: AuthUser | null = null;
  private sellerRecord: ApiSeller | null = null;
  private businessRecord: ApiBusiness | null = null;

  private async loadUser(refresh = false): Promise<AuthUser | null> {
    if (!this.user || refresh) {
      try {
        this.user = await getCurrentUser();
      } catch (error) {
        this.user = null;
      }
    }
    return this.user;
  }

  private extractId(value: any): string | null {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value._id) return value._id;
    return null;
  }

  private async fetchSellerRecord(): Promise<ApiSeller | null> {
    const user = await this.loadUser();
    const sellerId = this.extractId(user?.seller_id);
    if (!sellerId) {
      this.sellerRecord = null;
      return null;
    }

    if (this.sellerRecord && this.sellerRecord._id === sellerId) {
      return this.sellerRecord;
    }

    const response = await apiClient.get<ApiResponse<ApiSeller>>(`/api/sellers/${sellerId}`);
    this.sellerRecord = response.data.data;
    return this.sellerRecord;
  }

  private async fetchBusinessRecord(): Promise<ApiBusiness | null> {
    const sellerRecord = await this.fetchSellerRecord();
    const sellerId = sellerRecord?._id;
    if (!sellerId) {
      this.businessRecord = null;
      return null;
    }

    if (this.businessRecord && this.extractId(this.businessRecord.seller_id) === sellerId) {
      return this.businessRecord;
    }

    const response = await apiClient.get<ApiListResponse<ApiBusiness>>(`/api/businesses/seller/${sellerId}`);
    this.businessRecord = response.data.data[0] ?? null;
    return this.businessRecord;
  }

  private mapSeller(seller: ApiSeller | null, business: ApiBusiness | null): Seller {
    return {
      id: seller?._id ?? '',
      name: seller?.name ?? '',
      businessName: business?.business_name ?? '',
      businessType: business?.business_tagline ?? '',
      phone: seller?.phone_number ?? '',
      workAddress: seller?.address ?? '',
      selectedTemplateIds: business?.template_id
        ? [
            NUM_TO_TEMPLATE_KEY[business.template_id] ??
              String(business.template_id),
          ]
        : [],
      isOnboarded: Boolean(seller),
      createdAt: seller?.createdAt ?? new Date().toISOString(),
      updatedAt: seller?.updatedAt ?? new Date().toISOString(),
    };
  }

  private mapCategory(category: ApiCategory): Category {
    return {
      id: category._id,
      sellerId: this.extractId(category.seller_id) ?? '',
      name: category.category_name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  private mapAttribute(attribute: ApiAttribute): Attribute {
    return {
      id: attribute._id,
      name: attribute.attribute_name,
      options: attribute.options || [],
      createdAt: attribute.createdAt,
      updatedAt: attribute.updatedAt,
    };
  }

  private normalizeInventory(value?: string): 'none' | 'in stock' | 'out of stock' {
    if (!value) return 'none';
    const normalized = value.toLowerCase();
    if (normalized.includes('out')) return 'out of stock';
    if (normalized.includes('in')) return 'in stock';
    return 'none';
  }

  private mapProduct(product: ApiProduct): Product {
    const views = product.visits ?? 0;
    const clicks = product.redirects ?? 0;
    const inquiries = 0;
    const conversionRate = views > 0 ? Number(((clicks / views) * 100).toFixed(1)) : 0;

    return {
      id: product._id,
      sellerId: this.extractId(product.seller_id) ?? '',
      categoryId: this.extractId(product.category_id),
      name: product.product_name,
      price: Number(product.price ?? 0),
      description: product.product_descriptio ?? '',
      images: product.images ?? [],
      videos: [],
      inventory: this.normalizeInventory(product.inventory),
      specifications: [],
      attributes: [],
      attribute_ids: product.attribute_ids ?? [],
      visible: product.is_visible ? 1 : 0,
      views,
      clicks,
      inquiries,
      conversionRate,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private async ensureBusinessForSeller(): Promise<ApiBusiness> {
    const user = await this.loadUser();
    const sellerRecord = await this.fetchSellerRecord();
    if (!user) {
      throw new Error('User not authenticated');
    }
    if (!sellerRecord) {
      throw new Error('Seller profile not found');
    }

    const sellerId = sellerRecord._id;
    const existingBusiness = await this.fetchBusinessRecord();
    if (existingBusiness) {
      return existingBusiness;
    }

    const payload = {
      business_name: sellerRecord.name || 'My Business',
      business_email_add: user.email ?? `${sellerRecord._id}@sitesnap.app`,
      seller_id: sellerId,
      business_tagline: '',
      template_id: 1,
    };

    const response = await apiClient.post<ApiResponse<ApiBusiness>>('/api/businesses', payload);
    this.businessRecord = response.data.data;
    return this.businessRecord;
  }

  private buildSellerPayload(updates: Partial<Seller>) {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.phone !== undefined) {
      payload.phone_number = updates.phone;
      payload.whatsapp_number = updates.phone;
    }
    if (updates.workAddress !== undefined) payload.address = updates.workAddress;
    return payload;
  }

  private buildBusinessPayload(
    updates: Partial<Seller>,
    currentBusiness: ApiBusiness | null,
    user: AuthUser | null
  ) {
    const payload: any = {};
    if (updates.businessName !== undefined) payload.business_name = updates.businessName;
    if (updates.businessType !== undefined) payload.business_tagline = updates.businessType;
    if (
      updates.selectedTemplateIds !== undefined &&
      updates.selectedTemplateIds.length > 0
    ) {
      const templateKey = updates.selectedTemplateIds[0];
      const numericFromString = Number(templateKey);
      const numericTemplate = !Number.isNaN(numericFromString)
        ? numericFromString
        : TEMPLATE_KEY_TO_NUM[templateKey] ?? TEMPLATE_ID_MAP[templateKey] ?? 1;
      payload.template_id = numericTemplate;
    }
    if (!payload.business_email_add) {
      payload.business_email_add =
        currentBusiness?.business_email_add ?? user?.email ?? 'support@sitesnap.app';
    }
    return payload;
  }

  async getSeller(): Promise<Seller> {
    const sellerRecord = await this.fetchSellerRecord();
    const businessRecord = await this.fetchBusinessRecord();
    return this.mapSeller(sellerRecord, businessRecord);
  }

  async updateSeller(updates: Partial<Omit<Seller, 'id' | 'createdAt'>>): Promise<Seller> {
    const user = await this.loadUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    let sellerRecord = await this.fetchSellerRecord();
    const sellerPayload = this.buildSellerPayload(updates);

    if (sellerRecord) {
      if (Object.keys(sellerPayload).length > 0) {
        const response = await apiClient.put<ApiResponse<ApiSeller>>(
          `/api/sellers/${sellerRecord._id}`,
          sellerPayload
        );
        sellerRecord = response.data.data;
        this.sellerRecord = sellerRecord;
      }
    } else {
      const createPayload = {
        ...sellerPayload,
        name: updates.name ?? 'New Seller',
      };
      const response = await apiClient.post<ApiResponse<ApiSeller>>('/api/sellers', createPayload);
      sellerRecord = response.data.data;
      this.sellerRecord = sellerRecord;
      await this.loadUser(true);
    }

    const businessRecord = await this.ensureBusinessForSeller();
    const businessPayload = this.buildBusinessPayload(updates, businessRecord, user);

    if (Object.keys(businessPayload).length > 0) {
      const response = await apiClient.put<ApiResponse<ApiBusiness>>(
        `/api/businesses/${businessRecord._id}`,
        businessPayload
      );
      this.businessRecord = response.data.data;
    }

    // Refresh caches to ensure latest data is returned
    this.sellerRecord = null;
    this.businessRecord = null;

    return this.getSeller();
  }

  async getTemplates(): Promise<Template[]> {
    return templatesData as Template[];
  }

  async linkTemplatesToSeller(templateIds: string[]): Promise<void> {
    await this.updateSeller({ selectedTemplateIds: templateIds });
  }

  async getSelectedTemplates(): Promise<string[]> {
    const seller = await this.getSeller();
    return seller.selectedTemplateIds;
  }

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<ApiListResponse<ApiCategory>>('/api/categories');
    return response.data.data.map((category) => this.mapCategory(category));
  }

  async saveCategories(categories: Category[]): Promise<Category[]> {
    return categories;
  }

  async saveAttribute(attribute: { name: string; options: string[] }): Promise<Attribute> {
    const payload = {
      attribute_name: attribute.name,
      options: attribute.options,
    };

    const response = await apiClient.post<ApiResponse<ApiAttribute>>('/api/attributes', payload);
    console.log('Attribute created with response:', response.data);
    return this.mapAttribute(response.data.data);
  }

  async getAttributeById(attributeId: any): Promise<Attribute | null> {
    try {
      // Extract _id if attributeId is an object, otherwise use it as string
      let id = attributeId;
      if (attributeId && typeof attributeId === 'object' && attributeId._id) {
        id = attributeId._id;
      }

      // Validate attribute ID format
      if (!id || typeof id !== 'string' || id.trim() === '') {
        console.warn('Invalid attribute ID:', attributeId);
        return null;
      }

      const response = await apiClient.get<ApiResponse<ApiAttribute>>(`/api/attributes/${id}`);
      if (response.data.success && response.data.data) {
        return this.mapAttribute(response.data.data);
      }
      return null;
    } catch (error: any) {
      const idStr = (attributeId && typeof attributeId === 'object') ? attributeId._id : attributeId;
      if (error.response?.status === 404) {
        console.warn(`Attribute not found: ${idStr}`);
      } else if (error.response?.status === 500) {
        console.error(`Server error fetching attribute ${idStr}:`, error.response?.data);
      } else {
        console.error('Error fetching attribute:', error.message);
      }
      return null;
    }
  }

  async updateAttribute(attributeId: string, updates: { name?: string; options?: string[] }): Promise<Attribute> {
    const payload: any = {};
    if (updates.name !== undefined) payload.attribute_name = updates.name;
    if (updates.options !== undefined) payload.options = updates.options;

    const response = await apiClient.put<ApiResponse<ApiAttribute>>(
      `/api/attributes/${attributeId}`,
      payload
    );
    return this.mapAttribute(response.data.data);
  }

  async deleteAttribute(attributeId: string): Promise<void> {
    await apiClient.delete(`/api/attributes/${attributeId}`);
  }

  async addCategory(category: { name: string }): Promise<Category> {
    const sellerRecord = await this.fetchSellerRecord();
    if (!sellerRecord) {
      throw new Error('Create seller profile before adding categories.');
    }

    const payload = {
      category_name: category.name,
      seller_id: sellerRecord._id,
    };

    const response = await apiClient.post<ApiResponse<ApiCategory>>('/api/categories', payload);
    return this.mapCategory(response.data.data);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await apiClient.delete(`/api/categories/${categoryId}`);
  }

  async getProducts(): Promise<Product[]> {
    const response = await apiClient.get<ApiListResponse<ApiProduct>>('/api/products');
    return response.data.data.map((product) => this.mapProduct(product));
  }

  private async ensureSellerId(): Promise<string> {
    const sellerRecord = await this.fetchSellerRecord();
    if (!sellerRecord) {
      throw new Error('Seller profile not found. Please complete seller details first.');
    }
    return sellerRecord._id;
  }

  private prepareProductPayload(product: Partial<Product>): any {
    const payload: any = {};
    if (product.name !== undefined) payload.product_name = product.name;
    if (product.description !== undefined) payload.product_descriptio = product.description;
    if (product.price !== undefined) payload.price = product.price;
    if (product.inventory !== undefined) {
      payload.inventory =
        product.inventory === 'in stock'
          ? 'In Stock'
          : product.inventory === 'out of stock'
          ? 'Out of Stock'
          : 'None';
    }
    if (product.categoryId !== undefined) payload.category_id = product.categoryId;
    if (product.visible !== undefined) payload.is_visible = product.visible === 1;
    if (product.attribute_ids !== undefined) payload.attribute_ids = product.attribute_ids;
    // Don't include images here - handle separately in updateProduct/addProduct
    // to properly support imagesToKeep for updates
    return payload;
  }

  async addProduct(
    product: Omit<Product, 'id' | 'sellerId' | 'createdAt' | 'updatedAt'>
  ): Promise<Product> {
    const sellerId = await this.ensureSellerId();
    const payload = this.prepareProductPayload(product);
    payload.seller_id = sellerId;

    // Filter out invalid/empty images
    const validImages = (product.images || []).filter(
      (uri) => typeof uri === 'string' && uri.trim() !== '' && uri !== 'null' && uri !== 'undefined'
    );
    
    // If there are local files (non-http, non-data) in images, send multipart/form-data so multer can process them
    const localImages = validImages.filter((uri) => !uri.startsWith('http') && !uri.startsWith('data:'));
    if (localImages.length > 0) {
      const form = new FormData();
      // Append product fields
      Object.keys(payload).forEach((key) => {
        const value = (payload as any)[key];
        if (value === undefined || value === null) return;
        // If arrays or objects, stringify
        if (typeof value === 'object') {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, String(value));
        }
      });

      // Append existing http images and data URIs as a JSON field so backend can process them
      const existingImages = validImages.filter((uri) => uri.startsWith('http') || uri.startsWith('data:'));
      if (__DEV__) {
        console.log('[DataService][addProduct] existingImages ->', existingImages);
        console.log('[DataService][addProduct] localImages ->', localImages);
      }
      if (existingImages.length > 0) {
        // Use the same field name `images` so backend reads the current image list
        form.append('images', JSON.stringify(existingImages));
      }

      // Append local files
      localImages.forEach((uri, idx) => {
        // Extract filename
        const nameMatch = uri.split('/').pop() || `image_${Date.now()}_${idx}`;
        // Infer mime type from extension
        const extMatch = nameMatch.match(/\.([a-zA-Z0-9]+)$/);
        const ext = extMatch ? extMatch[1].toLowerCase() : '';
        let mime = 'image/jpeg';
        if (ext === 'png') mime = 'image/png';
        else if (ext === 'jpg' || ext === 'jpeg') mime = 'image/jpeg';
        else if (ext === 'gif') mime = 'image/gif';

        // In React Native, append file as { uri, name, type }
        (form as any).append('images', {
          uri,
          name: nameMatch,
          type: mime,
        });
      });

      if (__DEV__) {
        console.log('[DataService] Sending multipart form with localImages:', localImages.length);
      }

      // Use fetch for multipart requests in React Native (more reliable than axios/FormData)
      try {
        const token = await getToken();
        const base = apiClient.defaults.baseURL || '';
        const url = `${base.replace(/\/$/, '')}/api/products`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: form as any,
        });

        const json = await resp.json();
        if (!resp.ok) {
          throw new Error(json?.message || `Upload failed with status ${resp.status}`);
        }
        return this.mapProduct(json.data);
      } catch (err) {
        // rethrow so callers can handle
        throw err;
      }
    }

    // When sending JSON (no local images), include valid images in payload
    // Reuse validImages already declared above
    if (validImages.length > 0) {
      // Only include http URLs and data URIs in JSON payload
      payload.images = validImages.filter((uri) => uri.startsWith('http') || uri.startsWith('data:'));
    }
    
    if (__DEV__) {
      console.log('[DataService][addProduct] JSON payload images ->', payload.images);
    }
    const response = await apiClient.post<ApiResponse<ApiProduct>>('/api/products', payload);
    return this.mapProduct(response.data.data);
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<Product | null> {
    const payload = this.prepareProductPayload(updates);

    // Filter out invalid/empty images
    const validImages = (updates.images || []).filter(
      (uri) => typeof uri === 'string' && uri.trim() !== '' && uri !== 'null' && uri !== 'undefined'
    );
    
    const localImages = validImages.filter((uri) => !uri.startsWith('http') && !uri.startsWith('data:'));
    const existingImages = validImages.filter((uri) => uri.startsWith('http'));
    
    if (localImages.length > 0) {
      const form = new FormData();
      Object.keys(payload).forEach((key) => {
        const value = (payload as any)[key];
        if (value === undefined || value === null) return;
        if (typeof value === 'object') {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, String(value));
        }
      });

      // Send imagesToKeep so backend knows which existing images to keep
      // This is critical for proper image deletion
      form.append('imagesToKeep', JSON.stringify(existingImages));
      
      if (__DEV__) {
        console.log('[DataService][updateProduct] existingImages (to keep) ->', existingImages);
        console.log('[DataService][updateProduct] localImages (to upload) ->', localImages);
      }

      localImages.forEach((uri, idx) => {
        const nameMatch = uri.split('/').pop() || `image_${Date.now()}_${idx}`;
        const extMatch = nameMatch.match(/\.([a-zA-Z0-9]+)$/);
        const ext = extMatch ? extMatch[1].toLowerCase() : '';
        let mime = 'image/jpeg';
        if (ext === 'png') mime = 'image/png';
        else if (ext === 'jpg' || ext === 'jpeg') mime = 'image/jpeg';
        else if (ext === 'gif') mime = 'image/gif';

        (form as any).append('images', {
          uri,
          name: nameMatch,
          type: mime,
        });
      });

      if (__DEV__) {
        console.log('[DataService] Updating product with multipart form, localImages:', localImages.length);
      }

      try {
        const token = await getToken();
        const base = apiClient.defaults.baseURL || '';
        const url = `${base.replace(/\/$/, '')}/api/products/${productId}`;
        const resp = await fetch(url, {
          method: 'PUT',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: form as any,
        });

        const json = await resp.json();
        if (!resp.ok) {
          throw new Error(json?.message || `Upload failed with status ${resp.status}`);
        }
        return this.mapProduct(json.data);
      } catch (err) {
        throw err;
      }
    }

    if (__DEV__) {
      console.log('[DataService][updateProduct] JSON payload images ->', payload.images);
    }
    
    // When sending JSON (no local images), we still need to send imagesToKeep
    // Reuse validImages and existingImages already declared above
    // Send imagesToKeep so backend knows which images to keep
    if (updates.images !== undefined) {
      payload.imagesToKeep = existingImages;
      // Don't send images in payload when using imagesToKeep
      delete payload.images;
    }
    
    const response = await apiClient.put<ApiResponse<ApiProduct>>(
      `/api/products/${productId}`,
      payload
    );
    return this.mapProduct(response.data.data);
  }

  async deleteProduct(productId: string): Promise<boolean> {
    await apiClient.delete(`/api/products/${productId}`);
    return true;
  }

  private buildVisitorSeries(records: ApiAnalytics[], days: number): VisitorDataPoint[] {
    const today = new Date();
    const series: VisitorDataPoint[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const key = date.toISOString().split('T')[0];
      const visitors = records
        .filter((record) => record.date && record.date.slice(0, 10) === key)
        .reduce((sum, record) => sum + (record.views ?? 0), 0);
      series.push({ date: key, visitors });
    }

    return series;
  }

  private buildMonthlySeries(records: ApiAnalytics[], months: number): VisitorDataPoint[] {
    const today = new Date();
    const series: VisitorDataPoint[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const visitors = records
        .filter((record) => {
          if (!record.date) return false;
          const recordDate = new Date(record.date);
          return (
            recordDate.getFullYear() === date.getFullYear() &&
            recordDate.getMonth() === date.getMonth()
          );
        })
        .reduce((sum, record) => sum + (record.views ?? 0), 0);
      series.push({ date: key, visitors });
    }

    return series;
  }

  private async buildAnalytics(): Promise<Analytics> {
    const seller = await this.fetchSellerRecord();
    const sellerId = seller?._id ?? '';

    const [analyticsResponse, products] = await Promise.all([
      apiClient.get<ApiListResponse<ApiAnalytics>>('/api/analytics'),
      this.getProducts(),
    ]);

    const records = analyticsResponse.data.data ?? [];
    const totalVisitors = records.reduce((sum, record) => sum + (record.views ?? 0), 0);
    const totalClicks = records.reduce((sum, record) => sum + (record.clicks ?? 0), 0);

    const performance: ProductPerformance[] = products.map((product) => ({
      id: product.id,
      productId: product.id,
      name: product.name,
      views: product.views,
      inquiries: product.inquiries,
      clicks: product.clicks,
      conversionRate: product.conversionRate,
    }));

    const now = new Date().toISOString();

    return {
      sellerId,
      totalVisitors,
      whatsappInquiries: totalClicks,
      productViews: totalVisitors,
      productPerformance: {
        lastDay: performance,
        lastWeek: performance,
        lastMonth: performance,
        allTime: performance,
      },
      visitorData: {
        last15Days: this.buildVisitorSeries(records, 15),
        last30Days: this.buildVisitorSeries(records, 30),
        last6Months: this.buildMonthlySeries(records, 6),
        lastYear: this.buildMonthlySeries(records, 12),
      },
      updatedAt: now,
    };
  }

  async getAnalytics(): Promise<Analytics> {
    try {
      return await this.buildAnalytics();
    } catch (error) {
      console.error('Error fetching analytics from API:', error);
      const seller = await this.fetchSellerRecord();
      const emptyPerformance: ProductPerformance[] = [];
      return {
        sellerId: seller?._id ?? '',
        totalVisitors: 0,
        whatsappInquiries: 0,
        productViews: 0,
        productPerformance: {
          lastDay: emptyPerformance,
          lastWeek: emptyPerformance,
          lastMonth: emptyPerformance,
          allTime: emptyPerformance,
        },
        visitorData: {
          last15Days: [],
          last30Days: [],
          last6Months: [],
          lastYear: [],
        },
        updatedAt: new Date().toISOString(),
      };
    }
  }

  async saveAnalytics(analytics: Analytics): Promise<Analytics> {
    // The backend analytics API requires additional context (business_id).
    // For now, treat analytics as a derived read-only view and simply return the provided data.
    return analytics;
  }

  async updateAnalytics(updates: Partial<Omit<Analytics, 'sellerId'>>): Promise<Analytics> {
    const current = await this.getAnalytics();
    return { ...current, ...updates };
  }

  async exportAllData(): Promise<{
    seller: Seller;
    categories: Category[];
    products: Product[];
    analytics: Analytics;
  }> {
    const [seller, categories, products, analytics] = await Promise.all([
      this.getSeller(),
      this.getCategories(),
      this.getProducts(),
      this.getAnalytics(),
    ]);

    return { seller, categories, products, analytics };
  }

  async importAllData(): Promise<void> {
    throw new Error('Importing data from JSON is not supported with backend integration.');
  }

  async resetToDefaults(): Promise<void> {
    throw new Error('Reset to default is not supported against the live backend.');
  }

  async resetAllData(): Promise<void> {
    throw new Error('Clearing all backend data is not supported from the mobile app.');
  }

  resetCache(): void {
    this.user = null;
    this.sellerRecord = null;
    this.businessRecord = null;
  }
}

export const dataService = new DataService();

