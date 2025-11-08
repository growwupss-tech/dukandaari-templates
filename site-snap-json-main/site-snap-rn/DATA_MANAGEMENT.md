# 📊 Data Management in React Native App

## Overview

The React Native app uses the **exact same JSON data structure** as the web app, enabling seamless data synchronization and consistent behavior across platforms.

## 📁 Data Files Location

All JSON data files are located in:
```
src/data/
├── seller.json        # Seller information
├── categories.json    # Product categories
├── products.json      # Product catalog
├── templates.json     # Template designs
└── analytics.json     # Analytics data
```

## 🔄 How Data Works

### 1. **Initial Load (First Run)**
When the app runs for the first time:
- JSON files are bundled with the app
- Data is loaded from JSON into AsyncStorage
- A flag marks data as "initialized"

### 2. **Runtime Operations**
During app usage:
- All data is read from AsyncStorage (fast, local)
- Changes are saved to AsyncStorage immediately
- Data persists between app sessions

### 3. **Data Structure**
Matches web app exactly:

#### Seller Data
```json
{
  "id": "seller-default",
  "name": "",
  "businessName": "",
  "businessType": "",
  "phone": "",
  "workAddress": "",
  "selectedTemplateIds": [],
  "isOnboarded": false,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

#### Categories Data
```json
[
  {
    "id": "cat-1",
    "sellerId": "seller-default",
    "name": "Sample Category",
    "description": "",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

#### Products Data
```json
[
  {
    "id": "prod-1",
    "sellerId": "seller-default",
    "categoryId": "",
    "name": "Sample Product",
    "description": "This is a sample product",
    "price": 99.99,
    "inventory": "in stock",
    "images": [],
    "videos": [],
    "specifications": ["High quality", "Durable material"],
    "attributes": [],
    "visible": 1,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

#### Templates Data (Read-only)
```json
[
  {
    "id": "modern-minimal",
    "name": "Modern Minimal",
    "category": "portfolio",
    "thumbnail": "https://...",
    "description": "Clean and minimal design..."
  }
]
```

#### Analytics Data
```json
{
  "sellerId": "seller-default",
  "totalVisitors": 1247,
  "whatsappInquiries": 89,
  "productViews": 3456,
  "productPerformance": { ... },
  "visitorData": { ... },
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

## 🔧 Data Operations

### Using Data Service

```typescript
import { dataService } from '@/services/dataService';

// Get seller data
const seller = await dataService.getSeller();

// Update seller
await dataService.updateSeller({
  name: 'John Doe',
  businessName: 'My Store'
});

// Get products
const products = await dataService.getProducts();

// Add product
const newProduct = await dataService.addProduct({
  name: 'New Product',
  price: 99.99,
  description: 'Description',
  categoryId: 'cat-1',
  inventory: 'in stock',
  images: [],
  videos: [],
  specifications: [],
  attributes: [],
  visible: 1
});

// Update product
await dataService.updateProduct('prod-1', {
  price: 149.99
});

// Delete product
await dataService.deleteProduct('prod-1');

// Get categories
const categories = await dataService.getCategories();

// Add category
await dataService.addCategory({
  name: 'New Category',
  description: ''
});

// Get templates (read-only)
const templates = await dataService.getTemplates();

// Get analytics
const analytics = await dataService.getAnalytics();
```

## 📤 Export/Import Data

### Export Data
```typescript
import { exportDataAsJSON } from '@/utils/dataSync';

// Get all data as JSON string
const jsonData = await exportDataAsJSON();

// Can be:
// - Copied to clipboard
// - Saved to file
// - Sent to web app
// - Shared with others
```

### Import Data
```typescript
import { importDataFromJSON } from '@/utils/dataSync';

// Import from JSON string (from web app or backup)
await importDataFromJSON(jsonString);
```

### Reset to Defaults
```typescript
import { resetToDefaultData } from '@/utils/dataSync';

// Reset all data to initial JSON values
await resetToDefaultData();
```

### Clear All Data
```typescript
import { clearAllData } from '@/utils/dataSync';

// Clear everything (like uninstalling)
await clearAllData();
```

## 🔄 Syncing with Web App

### Method 1: Manual Export/Import

**From Mobile to Web:**
1. Export data from mobile app
2. Copy JSON string
3. Import into web app

**From Web to Mobile:**
1. Export data from web app
2. Copy JSON string
3. Import into mobile app

### Method 2: File Sharing

**Export from Mobile:**
```typescript
const data = await dataService.exportAllData();
// Save to file or share
```

**Import to Mobile:**
```typescript
// Read file or receive shared data
await dataService.importAllData(data);
```

## 💾 Data Persistence

### AsyncStorage Keys
```
seller_data       - Seller information
categories_data   - Categories array
products_data     - Products array
analytics_data    - Analytics object
data_initialized  - Initialization flag
```

### When Data is Saved
- ✅ On seller details update
- ✅ On product create/update/delete
- ✅ On category create/delete
- ✅ On template selection
- ✅ On analytics update

### When Data is Loaded
- ✅ App startup
- ✅ Screen navigation
- ✅ After updates

## 🔐 Data Isolation

Each seller has isolated data:
- Products filtered by `sellerId`
- Categories filtered by `sellerId`
- Analytics linked to `sellerId`

Multi-user support built-in!

## 📝 Example: Complete Data Flow

### Adding a Product

```typescript
// 1. User fills product form
const productData = {
  name: 'Laptop',
  price: 999,
  description: 'High performance laptop',
  categoryId: 'electronics-cat',
  inventory: 'in stock',
  images: ['image1.jpg'],
  videos: [],
  specifications: ['16GB RAM', '512GB SSD'],
  attributes: [
    { name: 'Color', values: ['Silver', 'Black'] },
    { name: 'Size', values: ['13"', '15"'] }
  ],
  visible: 1
};

// 2. Add product via data service
const newProduct = await dataService.addProduct(productData);

// 3. Data service:
//    - Generates unique ID
//    - Adds seller ID
//    - Adds timestamps
//    - Saves to AsyncStorage

// 4. Product appears in app immediately
// 5. Data persists across app restarts
```

## 🎯 Best Practices

### 1. Always Use Data Service
```typescript
// ✅ Good
const products = await dataService.getProducts();

// ❌ Bad
const products = await AsyncStorage.getItem('products_data');
```

### 2. Handle Async Operations
```typescript
// ✅ Good
useEffect(() => {
  loadData();
}, []);

async function loadData() {
  const data = await dataService.getProducts();
  setProducts(data);
}

// ❌ Bad
useEffect(() => {
  const data = dataService.getProducts(); // Missing await
  setProducts(data);
}, []);
```

### 3. Update State After Changes
```typescript
// ✅ Good
const newProduct = await dataService.addProduct(data);
setProducts([...products, newProduct]);

// ❌ Bad
await dataService.addProduct(data);
// State not updated, UI won't reflect change
```

## 🚀 Advanced Features

### Data Validation
```typescript
import { 
  validateSellerData,
  validateProductsData 
} from '@/utils/dataSync';

const isValid = validateProductsData(importedData);
if (!isValid) {
  throw new Error('Invalid product data');
}
```

### Batch Operations
```typescript
// Import entire dataset
await dataService.importAllData({
  seller: sellerData,
  categories: categoriesData,
  products: productsData,
  analytics: analyticsData
});

// Export entire dataset
const backup = await dataService.exportAllData();
```

### Migration Helper
```typescript
// If you need to migrate old data format
async function migrateOldData() {
  const oldProducts = await getOldProducts();
  const newProducts = oldProducts.map(p => ({
    ...p,
    visible: 1, // Add new field
    videos: [] // Add new field
  }));
  await dataService.saveProducts(newProducts);
}
```

## 📊 Data Size Considerations

### Current Limits
- AsyncStorage: ~6MB on iOS, ~6MB on Android
- Images: Stored as base64 (increases size ~33%)
- Typical app data: < 1MB

### Optimization Tips
1. **Compress images** before storing
2. **Use cloud storage** for large media files
3. **Paginate** large product lists
4. **Clean up** old data periodically

## 🔍 Debugging Data

### View Current Data
```typescript
// In development
const data = await dataService.exportAllData();
console.log('Current data:', JSON.stringify(data, null, 2));
```

### Check Storage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// List all keys
const keys = await AsyncStorage.getAllKeys();
console.log('Storage keys:', keys);

// Get specific data
const seller = await AsyncStorage.getItem('seller_data');
console.log('Seller:', JSON.parse(seller));
```

## 🎓 Summary

✅ **JSON files** provide initial data
✅ **AsyncStorage** handles runtime data
✅ **Data service** abstracts storage logic
✅ **Export/Import** enables syncing
✅ **Same structure** as web app
✅ **Type-safe** with TypeScript
✅ **Isolated** per seller
✅ **Persistent** across sessions

The React Native app handles data **exactly like the web app**, just with AsyncStorage instead of localStorage!

---

**Need help? Check the data service code: `src/services/dataService.ts`**

