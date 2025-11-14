import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { colors, spacing, fontSize } from '../theme';
import { dataService, Category } from '../services/dataService';
import { Plus, Trash2 } from 'lucide-react-native';

interface CategoryListProps {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }

    try {
      const newCategoryObj = await dataService.addCategory({
        name: newCategory.trim(),
      });
      setCategories([...categories, newCategoryObj]);
      setNewCategory('');
      Alert.alert('Success', 'Category added!');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Could not add category. Please try again.';
      Alert.alert('Error', message);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await dataService.deleteCategory(categoryId);
      setCategories(categories.filter(cat => cat.id !== categoryId));
      Alert.alert('Success', 'Category deleted!');
    } catch (error) {
      console.error('Error deleting category:', error);
      Alert.alert('Error', 'Could not delete category. Please try again.');
    }
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <TouchableOpacity 
        onPress={() => handleDelete(item.id)} 
        style={styles.deleteButton}
        activeOpacity={0.7}
      >
        <Trash2 size={16} color={colors.destructive} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Input
          value={newCategory}
          onChangeText={setNewCategory}
          placeholder="New category name"
          style={styles.input}
          onSubmitEditing={handleAdd}
        />
        <Button onPress={handleAdd} style={styles.addButton}>
          <Plus size={16} color="#FFFFFF" />
        </Button>
      </View>

      {categories.length === 0 ? (
        <Text style={styles.emptyText}>No categories yet. Add your first category above!</Text>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.categoriesList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    height: 48,
    marginRight: spacing.sm,
  },
  addButton: {
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    minWidth: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.mutedForeground,
    paddingVertical: spacing.xl * 2,
    fontSize: fontSize.sm,
  },
  categoriesList: {
    // Gap handled by marginBottom on individual items
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.muted,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.foreground,
  },
  deleteButton: {
    padding: spacing.sm,
    borderRadius: 12,
  },
});

export default React.memo(CategoryList);

