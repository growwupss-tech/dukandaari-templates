/**
 * Data Sync Utilities
 * 
 * Helper functions to export/import data between web and mobile apps
 * Allows syncing data via JSON files or clipboard
 */

import { dataService } from '../services/dataService';

/**
 * Export all data as JSON string
 * Can be copied to clipboard or saved as file
 */
export async function exportDataAsJSON(): Promise<string> {
  try {
    const data = await dataService.exportAllData();
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}

/**
 * Import data from JSON string
 * @param jsonString - JSON string containing seller, categories, products, analytics
 */
export async function importDataFromJSON(jsonString: string): Promise<void> {
  try {
    const data = JSON.parse(jsonString);
    await dataService.importAllData(data);
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
}

/**
 * Get data export for sharing
 * Returns a formatted object ready for export
 */
export async function getDataForExport() {
  return await dataService.exportAllData();
}

/**
 * Reset all data to default JSON values
 */
export async function resetToDefaultData(): Promise<void> {
  try {
    await dataService.resetToDefaults();
  } catch (error) {
    console.error('Error resetting to defaults:', error);
    throw error;
  }
}

/**
 * Clear all app data
 */
export async function clearAllData(): Promise<void> {
  try {
    await dataService.resetAllData();
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
}

// Data validation helpers
export function validateSellerData(data: any): boolean {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.businessName === 'string'
  );
}

export function validateProductsData(data: any): boolean {
  return Array.isArray(data) && data.every(
    product =>
      product &&
      typeof product.id === 'string' &&
      typeof product.name === 'string'
  );
}

export function validateCategoriesData(data: any): boolean {
  return Array.isArray(data) && data.every(
    category =>
      category &&
      typeof category.id === 'string' &&
      typeof category.name === 'string'
  );
}

export function validateAnalyticsData(data: any): boolean {
  return (
    data &&
    typeof data.totalVisitors === 'number' &&
    typeof data.whatsappInquiries === 'number' &&
    typeof data.productViews === 'number'
  );
}

