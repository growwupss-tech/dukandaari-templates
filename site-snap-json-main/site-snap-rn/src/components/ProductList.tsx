import React, { useState, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Alert, TextInput as RNTextInput } from 'react-native';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Switch } from './ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { colors, spacing, fontSize } from '../theme';
import { Product, Category, dataService } from '../services/dataService';
import FileUploader from './FileUploader';
import { Plus, Trash2, Upload, X, ChevronLeft, ChevronRight, Play, Pencil, Search } from 'lucide-react-native';

interface ProductListProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  categories: Category[];
}

const ProductList: React.FC<ProductListProps> = ({ products, setProducts, categories }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    images: [],
    videos: [],
    specifications: [],
    attributes: [],
    attribute_ids: [],
    inventory: 'none',
    categoryId: '',
    visible: 1,
  });
  const [newSpec, setNewSpec] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple fuzzy search implementation
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    );
  }, [searchQuery, products]);

  const handleEdit = async (index: number) => {
    const product = products[index];
    
    // Fetch attributes if product has attribute_ids
    let attributes: { name: string; values: string[] }[] = [];
    
    if (product.attribute_ids && product.attribute_ids.length > 0) {
      console.log(`Fetching ${product.attribute_ids.length} attributes for product ${product.id}`);
      for (let i = 0; i < product.attribute_ids.length; i++) {
        const attrId = product.attribute_ids[i];
        if (!attrId) {
          console.warn('Skipping empty attribute ID');
          continue;
        }
        try {
          // Handle both string IDs and object references with _id
          const idToFetch = (typeof attrId === 'object' && (attrId as any)._id) ? (attrId as any)._id : attrId;
          console.log(`Fetching attribute with ID: ${idToFetch}`);
          
          const attribute = await dataService.getAttributeById(attrId);
          if (attribute) {
            attributes.push({
              name: attribute.name,
              values: attribute.options,
            });
          } else {
            console.warn(`Failed to fetch attribute: ${idToFetch}`);
          }
        } catch (error: any) {
          console.error(`Error fetching attribute:`, error.message);
        }
      }
      console.log(`Successfully fetched ${attributes.length} attributes`);
    }

    // Filter out invalid/empty images and videos when loading for edit
    const validImages = (product.images || []).filter(img => img && img.trim() !== '');
    const validVideos = (product.videos || []).filter(vid => vid && vid.trim() !== '');
    
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      images: validImages,
      videos: validVideos,
      specifications: product.specifications,
      attributes: attributes.length > 0 ? attributes : product.attributes,
      attribute_ids: product.attribute_ids,
      inventory: product.inventory,
      categoryId: product.categoryId ?? '',
      visible: product.visible,
    });
    setEditingIndex(index);
    setIsModalVisible(true);
  };

  const handleDelete = async (index: number) => {
    try {
      const product = products[index];
      if (!product) {
        return;
      }
      await dataService.deleteProduct(product.id);
      setProducts(products.filter((_, i) => i !== index));
      Alert.alert('Success', 'Product deleted!');
    } catch (error) {
      console.error('Error deleting product:', error);
      Alert.alert('Error', 'Could not delete product. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      Alert.alert('Error', 'Product name is required');
      return;
    }

    if (!formData.categoryId) {
      Alert.alert('Error', 'Please select a category for the product.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get existing attribute_ids from the form data (populated during edit)
      const existingAttributeIds = formData.attribute_ids || [];

      // Process attributes - update existing ones, save new ones
      let finalAttributeIds: string[] = [];
      if (formData.attributes && formData.attributes.length > 0) {
        for (let i = 0; i < formData.attributes.length; i++) {
          const attr = formData.attributes[i];
          if (attr.name && attr.values && attr.values.length > 0) {
            try {
              // Check if this attribute is an existing one (index < existing count)
              const existingAttrId = existingAttributeIds[i];
              
              if (existingAttrId) {
                // Extract the actual ID string (handle both string and object with _id)
                const idToUpdate = typeof existingAttrId === 'object' && (existingAttrId as any)._id 
                  ? (existingAttrId as any)._id 
                  : existingAttrId;
                
                // Update existing attribute
                console.log(`Updating attribute ${idToUpdate} with new values`);
                await dataService.updateAttribute(idToUpdate, {
                  name: attr.name,
                  options: attr.values.filter((v: string) => v), // Filter out empty values
                });
                finalAttributeIds.push(idToUpdate);
              } else {
                // Save new attribute (added during edit)
                console.log(`Saving new attribute: ${attr.name}`);
                const savedAttribute = await dataService.saveAttribute({
                  name: attr.name,
                  options: attr.values.filter((v: string) => v), // Filter out empty values
                });
                finalAttributeIds.push(savedAttribute.id);
              }
            } catch (error) {
              console.error('Error processing attribute:', error);
            }
          }
        }
      }

      // Filter out invalid/empty images and videos before saving
      const validImages = (formData.images || []).filter(img => img && img.trim() !== '');
      const validVideos = (formData.videos || []).filter(vid => vid && vid.trim() !== '');

      if (editingIndex !== null) {
        const product = products[editingIndex];
        const updateData: Partial<Product> = {
          ...formData,
          images: validImages,
          videos: validVideos,
          attributes: [], // Clear attributes as they're now in MongoDB
          attribute_ids: finalAttributeIds,
        };
        const updated = await dataService.updateProduct(product.id, updateData);
        if (updated) {
          const updatedProducts = [...products];
          updatedProducts[editingIndex] = updated;
          setProducts(updatedProducts);
          Alert.alert('Success', 'Product updated!');
        }
      } else {
        const newProductData: any = {
          ...formData,
          images: validImages,
          videos: validVideos,
          attributes: [], // Clear attributes as they're now in MongoDB
          attribute_ids: finalAttributeIds,
        };
        const newProduct = await dataService.addProduct(newProductData);
        setProducts([...products, newProduct]);
        Alert.alert('Success', 'Product added!');
      }
      setIsModalVisible(false);
      resetForm();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Unable to save the product. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      description: '',
      images: [],
      videos: [],
      specifications: [],
      attributes: [],
      attribute_ids: [],
      inventory: 'none',
      categoryId: '',
      visible: 1,
    });
    setEditingIndex(null);
    setNewSpec('');
  };

  const openNewProduct = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const handleAddSpec = () => {
    if (!newSpec.trim()) {
      Alert.alert('Error', 'Specification cannot be empty');
      return;
    }
    setFormData({
      ...formData,
      specifications: [...(formData.specifications || []), newSpec],
    });
    setNewSpec('');
  };

  const handleRemoveSpec = (index: number) => {
    setFormData({
      ...formData,
      specifications: (formData.specifications || []).filter((_, i) => i !== index),
    });
  };

  const addAttribute = () => {
    setFormData({ 
      ...formData, 
      attributes: [...(formData.attributes || []), { name: "", values: [""] }] 
    });
  };

  const updateAttributeName = (index: number, name: string) => {
    const newAttributes = [...(formData.attributes || [])];
    newAttributes[index] = { ...newAttributes[index], name };
    setFormData({ ...formData, attributes: newAttributes });
  };

  const addAttributeValue = (attrIndex: number) => {
    const newAttributes = [...(formData.attributes || [])];
    newAttributes[attrIndex].values.push("");
    setFormData({ ...formData, attributes: newAttributes });
  };

  const updateAttributeValue = (attrIndex: number, valueIndex: number, value: string) => {
    const newAttributes = [...(formData.attributes || [])];
    newAttributes[attrIndex].values[valueIndex] = value;
    setFormData({ ...formData, attributes: newAttributes });
  };

  const removeAttributeValue = (attrIndex: number, valueIndex: number) => {
    const newAttributes = [...(formData.attributes || [])];
    newAttributes[attrIndex].values = newAttributes[attrIndex].values.filter((_, i) => i !== valueIndex);
    setFormData({ ...formData, attributes: newAttributes });
  };

  const removeAttribute = async (index: number) => {
    const attributeToRemove = formData.attributes?.[index];
    const attributeIds = formData.attribute_ids || [];
    const attributeIdToDelete = attributeIds[index];
    
    // Delete the attribute from the attribute collection if it has an ID (it's a saved attribute)
    if (attributeIdToDelete) {
      try {
        const idToDelete = typeof attributeIdToDelete === 'object' && (attributeIdToDelete as any)._id
          ? (attributeIdToDelete as any)._id
          : attributeIdToDelete;
        
        console.log(`Deleting attribute ${idToDelete} from collection`);
        await dataService.deleteAttribute(idToDelete);
      } catch (error) {
        console.error('Error deleting attribute from collection:', error);
        Alert.alert('Error', 'Could not delete attribute from collection');
      }
    }
    
    // Remove from form data
    const updatedAttributeIds = attributeIds.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      attributes: (formData.attributes || []).filter((_, i) => i !== index),
      attribute_ids: updatedAttributeIds,
    });
  };

  if (products.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No products yet. Click the + button to add your first product!</Text>
        <Button onPress={openNewProduct} style={styles.addButton}>
          <Plus size={16} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.addButtonText}>Add Product</Text>
        </Button>
        {isModalVisible && (
          <ProductFormModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            onSubmit={handleSubmit}
            isEditing={editingIndex !== null}
            newSpec={newSpec}
            setNewSpec={setNewSpec}
            handleAddSpec={handleAddSpec}
            handleRemoveSpec={handleRemoveSpec}
            addAttribute={addAttribute}
            updateAttributeName={updateAttributeName}
            addAttributeValue={addAttributeValue}
            updateAttributeValue={updateAttributeValue}
            removeAttributeValue={removeAttributeValue}
            removeAttribute={removeAttribute}
            isSubmitting={isSubmitting}
            onImagesChange={(files: string[]) => {
              // Filter out any invalid/empty images
              const validFiles = files.filter(img => img && img.trim() !== '');
              setFormData({ ...formData, images: validFiles });
              if (editingIndex !== null) {
                const copy = [...products];
                const existing = copy[editingIndex] || ({} as Product);
                copy[editingIndex] = { ...existing, images: validFiles } as Product;
                setProducts(copy);
              }
            }}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button onPress={openNewProduct} style={styles.addButton}>
        <Plus size={16} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.addButtonText}>Add Product</Text>
      </Button>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.mutedForeground} style={styles.searchIcon} />
        <RNTextInput
          placeholder="Search products by name or description..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor={colors.mutedForeground}
        />
        {searchQuery !== '' && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <X size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results count */}
      {searchQuery !== '' && (
        <Text style={styles.resultsCount}>
          Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </Text>
      )}

      <View style={styles.productsList}>
        {filteredProducts.map((product, index) => {
          const originalIndex = products.findIndex(p => p.id === product.id);
          return (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => handleEdit(originalIndex)}
              onDelete={() => handleDelete(originalIndex)}
              categories={categories}
            />
          );
        })}

        {/* No results message */}
        {searchQuery && filteredProducts.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Search size={48} color={colors.mutedForeground} style={styles.noResultsIcon} />
            <Text style={styles.noResultsTitle}>No products found</Text>
            <Text style={styles.noResultsText}>Try adjusting your search query</Text>
          </View>
        )}
      </View>

      {isModalVisible && (
        <ProductFormModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            resetForm();
          }}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          onSubmit={handleSubmit}
          isEditing={editingIndex !== null}
          newSpec={newSpec}
          setNewSpec={setNewSpec}
          handleAddSpec={handleAddSpec}
          handleRemoveSpec={handleRemoveSpec}
          addAttribute={addAttribute}
          updateAttributeName={updateAttributeName}
          addAttributeValue={addAttributeValue}
          updateAttributeValue={updateAttributeValue}
          removeAttributeValue={removeAttributeValue}
          removeAttribute={removeAttribute}
          isSubmitting={isSubmitting}
          onImagesChange={(files: string[]) => {
            // Filter out any invalid/empty images
            const validFiles = files.filter(img => img && img.trim() !== '');
            setFormData({ ...formData, images: validFiles });
            if (editingIndex !== null) {
              const copy = [...products];
              const existing = copy[editingIndex] || ({} as Product);
              copy[editingIndex] = { ...existing, images: validFiles } as Product;
              setProducts(copy);
            }
          }}
        />
      )}
    </View>
  );
};

// ProductCard Component
interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  categories: Category[];
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, categories }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [attributes, setAttributes] = useState<{ name: string; options: string[] }[]>([]);
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  
  // Filter out invalid/empty image and video URIs
  const validImages = (product.images || []).filter(img => img && img.trim() !== '');
  const validVideos = (product.videos || []).filter(vid => vid && vid.trim() !== '');
  const allMedia = [...validImages, ...validVideos];
  const hasMultipleMedia = allMedia.length > 1;

  // Fetch attributes when product loads or changes
  React.useEffect(() => {
    const fetchAttributes = async () => {
      if (product.attribute_ids && product.attribute_ids.length > 0) {
        setLoadingAttributes(true);
        const fetchedAttributes: { name: string; options: string[] }[] = [];
        console.log(`ProductCard: Fetching ${product.attribute_ids.length} attributes for product ${product.id}`);
        
        for (const attrId of product.attribute_ids) {
          if (!attrId) {
            console.warn('ProductCard: Skipping empty attribute ID');
            continue;
          }
          try {
            // Handle both string IDs and object references with _id
            const idToFetch = (typeof attrId === 'object' && (attrId as any)._id) ? (attrId as any)._id : attrId;
            console.log(`ProductCard: Fetching attribute with ID: ${idToFetch}`);
            
            const attribute = await dataService.getAttributeById(attrId);
            if (attribute) {
              fetchedAttributes.push({
                name: attribute.name,
                options: attribute.options,
              });
            } else {
              console.warn(`ProductCard: Failed to fetch attribute ${idToFetch}`);
            }
          } catch (error: any) {
            console.error(`ProductCard: Error fetching attribute:`, error.message);
          }
        }
        
        console.log(`ProductCard: Successfully fetched ${fetchedAttributes.length} attributes`);
        setAttributes(fetchedAttributes);
        setLoadingAttributes(false);
      }
    };

    fetchAttributes();
  }, [product.id, product.attribute_ids]);

  // Reset media index when product changes
  React.useEffect(() => {
    setCurrentMediaIndex(0);
  }, [product.id, product.images, product.videos]);

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  const isVideo = (url: string) => {
    return url.startsWith('data:video/') || url.match(/\.(mp4|webm|ogg)$/i);
  };

  const currentMedia = allMedia[currentMediaIndex];
  const isCurrentVideo = currentMedia && isVideo(currentMedia);
  const categoryName = categories.find(c => c.id === product.categoryId)?.name;

  return (
    <Card style={styles.productCard}>
      <View style={styles.mediaContainer}>
        {currentMedia ? (
          <>
            {isCurrentVideo ? (
              <View style={styles.videoPlaceholder}>
                <Play size={48} color={colors.mutedForeground} />
                <Text style={styles.videoText}>Video</Text>
              </View>
            ) : (
              <Image 
                key={currentMedia} 
                source={{ uri: currentMedia }} 
                style={styles.productImage}
                resizeMode="cover"
              />
            )}
            
            {hasMultipleMedia && (
              <>
                <TouchableOpacity style={styles.navButtonLeft} onPress={prevMedia} activeOpacity={0.7}>
                  <ChevronLeft size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButtonRight} onPress={nextMedia} activeOpacity={0.7}>
                  <ChevronRight size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.mediaCounter}>
                  <Text style={styles.mediaCounterText}>
                    {currentMediaIndex + 1} / {allMedia.length}
                  </Text>
                </View>
              </>
            )}
            
            {isCurrentVideo && (
              <View style={styles.videoTag}>
                <Play size={12} color="#FFFFFF" />
                <Text style={styles.videoTagText}>Video</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.noMediaContainer}>
            <Upload size={48} color={colors.mutedForeground} style={styles.noMediaIcon} />
            <Text style={styles.noMediaText}>No media</Text>
          </View>
        )}
        
        {/* Action buttons overlay */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit} activeOpacity={0.7}>
            <Pencil size={16} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteActionButton} onPress={onDelete} activeOpacity={0.7}>
            <Trash2 size={16} color={colors.destructive} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.productContent}>
        {/* Header with name and price */}
        <View style={styles.productHeader}>
          <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
          {product.price > 0 && (
            <Text style={styles.productPrice}>₹{product.price}</Text>
          )}
        </View>
        
        <View style={styles.badges}>
          {categoryName && (
            <Badge variant="outline" style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{categoryName}</Text>
            </Badge>
          )}
          {product.inventory && product.inventory !== 'none' && (
            <Badge variant={product.inventory === 'in stock' ? 'default' : 'secondary'}>
              <Text style={styles.badgeText}>
                {product.inventory === 'in stock' ? '✓ In Stock' : '✗ Out of Stock'}
              </Text>
            </Badge>
          )}
        </View>

        {/* Description */}
        {product.description && (
          <Text style={styles.productDescription} numberOfLines={3}>
            {product.description}
          </Text>
        )}

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <View style={styles.specificationsContainer}>
            <Text style={styles.specificationsTitle}>SPECIFICATIONS</Text>
            <View style={styles.specsList}>
              {product.specifications.slice(0, 3).map((spec: string, idx: number) => (
                <View key={idx} style={styles.specItem}>
                  <Text style={styles.specText}>• {spec}</Text>
                </View>
              ))}
              {product.specifications.length > 3 && (
                <Text style={styles.moreSpecs}>
                  +{product.specifications.length - 3} more specifications
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Attributes */}
        {product.attribute_ids && product.attribute_ids.length > 0 && (
          <View style={styles.attributesContainer}>
            <Text style={styles.attributesLabel}>ATTRIBUTES</Text>
            {loadingAttributes ? (
              <Text style={styles.loadingText}>Loading attributes...</Text>
            ) : attributes.length > 0 ? (
              <View style={styles.attributesListContainer}>
                {attributes.map((attr: any, idx: number) => (
                  <View key={idx} style={styles.attributeDisplaySection}>
                    <Text style={styles.attributeDisplayName}>{attr.name.toUpperCase()}</Text>
                    <View style={styles.attributeDisplayValues}>
                      {attr.options && attr.options.map((option: string, oIdx: number) => (
                        <View key={oIdx} style={styles.attributeDisplayValue}>
                          <Text style={styles.attributeDisplayValueText}>{option}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.attributeIdsText}>
                {product.attribute_ids.length} attribute{product.attribute_ids.length !== 1 ? 's' : ''} saved
              </Text>
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

// ProductFormModal Component
interface ProductFormModalProps {
  visible: boolean;
  onClose: () => void;
  formData: Partial<Product>;
  setFormData: (data: Partial<Product>) => void;
  categories: Category[];
  onSubmit: () => void;
  isEditing: boolean;
  newSpec: string;
  setNewSpec: (spec: string) => void;
  handleAddSpec: () => void;
  handleRemoveSpec: (index: number) => void;
  addAttribute: () => void;
  updateAttributeName: (index: number, name: string) => void;
  addAttributeValue: (attrIndex: number) => void;
  updateAttributeValue: (attrIndex: number, valueIndex: number, value: string) => void;
  removeAttributeValue: (attrIndex: number, valueIndex: number) => void;
  removeAttribute: (index: number) => void;
  onImagesChange?: (files: string[]) => void;
  isSubmitting?: boolean;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  visible,
  onClose,
  formData,
  setFormData,
  categories,
  onSubmit,
  isEditing,
  newSpec,
  setNewSpec,
  handleAddSpec,
  handleRemoveSpec,
  addAttribute,
  updateAttributeName,
  addAttributeValue,
  updateAttributeValue,
  removeAttributeValue,
  removeAttribute,
  onImagesChange,
  isSubmitting,
}) => {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{isEditing ? 'Edit Product' : 'Add New Product'}</Text>
          <TouchableOpacity
            onPress={() => {
              if (!isSubmitting) onClose();
            }}
            disabled={!!isSubmitting}
            style={{ opacity: isSubmitting ? 0.5 : 1 }}
          >
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <Input
            label="Name *"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Product name"
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Price (optional)"
            value={formData.price?.toString()}
            onChangeText={(text) => setFormData({ ...formData, price: parseFloat(text) || 0 })}
            placeholder="₹999"
            keyboardType="numeric"
            containerStyle={styles.inputContainer}
          />
          <Text style={styles.helperText}>Leave as 0 to hide price on product card</Text>

          <Input
            label="Description"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Product description"
            multiline
            numberOfLines={4}
            containerStyle={styles.inputContainer}
            style={styles.textArea}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category (optional)</Text>
            <Select
              value={formData.categoryId || ''}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              placeholder="Select category"
              style={styles.select}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <View style={styles.emptySelectMessage}>
                    <Text style={styles.emptySelectText}>No categories available. Add categories first.</Text>
                  </View>
                ) : (
                  <>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Inventory Status</Text>
            <Select
              value={formData.inventory || 'none'}
              onValueChange={(value) => setFormData({ ...formData, inventory: value as 'none' | 'in stock' | 'out of stock' })}
              placeholder="Select inventory status"
              style={styles.select}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select inventory status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Selection</SelectItem>
                <SelectItem value="in stock">In Stock</SelectItem>
                <SelectItem value="out of stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.visibilityRow}>
              <Text style={styles.label}>Visibility</Text>
              <View style={styles.visibilityToggle}>
                <Text style={styles.visibilityText}>{formData.visible === 1 ? 'Visible' : 'Hidden'}</Text>
                <Switch
                  checked={formData.visible === 1}
                  onCheckedChange={(checked) => setFormData({ ...formData, visible: checked ? 1 : 0 })}
                />
              </View>
            </View>
            <Text style={styles.helperText}>Toggle product visibility in your catalog</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Images</Text>
            <FileUploader
              files={(formData.images || []).filter(img => img && img.trim() !== '')}
              onFilesChange={(files) => {
                // Filter out any invalid/empty images, but allow empty array (for removing last image)
                const validFiles = files.filter(img => img && img.trim() !== '');
                setFormData({ ...formData, images: validFiles });
                if (onImagesChange) onImagesChange(validFiles);
              }}
              type="image"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Videos (optional)</Text>
            <FileUploader
              files={formData.videos || []}
              onFilesChange={(files) => setFormData({ ...formData, videos: files })}
              type="video"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Specifications (optional)</Text>
            <View style={styles.specInputRow}>
              <RNTextInput
                placeholder="Add specification (e.g., 100% Cotton Material)"
                value={newSpec}
                onChangeText={setNewSpec}
                style={styles.specInput}
                placeholderTextColor={colors.mutedForeground}
              />
              <TouchableOpacity onPress={handleAddSpec} style={styles.specAddButton}>
                <Plus size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            {(formData.specifications || []).map((spec: string, index: number) => (
              <View key={index} style={styles.specListItem}>
                <Text style={styles.specListText}>{spec}</Text>
                <TouchableOpacity onPress={() => handleRemoveSpec(index)} style={styles.specDeleteButton}>
                  <Trash2 size={16} color={colors.destructive} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.attributeHeader}>
              <Text style={styles.label}>Custom Attributes (e.g., Size, Color)</Text>
              <TouchableOpacity onPress={addAttribute} style={styles.addAttributeButton}>
                <Plus size={14} color={colors.primary} />
                <Text style={styles.addAttributeText}>Add Attribute</Text>
              </TouchableOpacity>
            </View>
            {(formData.attributes || []).map((attr: any, attrIndex: number) => (
              <View key={attrIndex} style={styles.attributeFormSection}>
                <View style={styles.attributeNameRow}>
                  <RNTextInput
                    value={attr.name}
                    onChangeText={(text) => updateAttributeName(attrIndex, text)}
                    placeholder="Attribute name (e.g., Size)"
                    style={styles.attributeNameInput}
                    placeholderTextColor={colors.mutedForeground}
                  />
                  <TouchableOpacity onPress={() => removeAttribute(attrIndex)} style={styles.attributeDeleteButton}>
                    <Trash2 size={16} color={colors.destructive} />
                  </TouchableOpacity>
                </View>
                <View style={styles.attributeValuesSection}>
                  <View style={styles.attributeValuesHeader}>
                    <Text style={styles.attributeValuesLabel}>Values</Text>
                    <TouchableOpacity onPress={() => addAttributeValue(attrIndex)} style={styles.addValueButton}>
                      <Plus size={12} color={colors.primary} />
                      <Text style={styles.addValueText}>Add Value</Text>
                    </TouchableOpacity>
                  </View>
                  {attr.values.map((value: string, valueIndex: number) => (
                    <View key={valueIndex} style={styles.attributeValueRow}>
                      <RNTextInput
                        value={value}
                        onChangeText={(text) => updateAttributeValue(attrIndex, valueIndex, text)}
                        placeholder="e.g., M, L, XL"
                        style={styles.attributeValueInput}
                        placeholderTextColor={colors.mutedForeground}
                      />
                      <TouchableOpacity 
                        onPress={() => removeAttributeValue(attrIndex, valueIndex)} 
                        style={styles.valueDeleteButton}
                      >
                        <X size={14} color={colors.destructive} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <Button onPress={onSubmit} style={styles.submitButton} disabled={isSubmitting}
          >
            {isSubmitting ? (
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>Uploading...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>{isEditing ? 'Update Product' : 'Add Product'}</Text>
            )}
          </Button>
        </ScrollView>
        {isSubmitting && (
          <View style={styles.fullscreenOverlay} pointerEvents="auto">
            <View style={styles.overlayContent}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.overlayText}>Uploading, please wait...</Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.mutedForeground,
    marginBottom: spacing.xl,
    fontSize: fontSize.sm,
  },
  addButton: {
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  buttonIcon: {
    marginRight: spacing.xs,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    height: 48,
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    padding: 8,
    borderRadius: 999,
  },
  resultsCount: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginBottom: spacing.sm,
    paddingHorizontal: 4,
  },
  productsList: {
    flex: 1,
  },
  productCard: {
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: colors.muted,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  navButtonLeft: {
    position: 'absolute',
    left: 8,
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonRight: {
    position: 'absolute',
    right: 8,
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaCounter: {
    position: 'absolute',
    bottom: 12,
    left: '50%',
    marginLeft: -40,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  mediaCounterText: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  videoTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  videoTagText: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  noMediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMediaIcon: {
    opacity: 0.2,
    marginBottom: spacing.sm,
  },
  noMediaText: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  actionButtons: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  productContent: {
    padding: spacing.xl,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  productName: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryBadge: {
    borderColor: colors.primary + '33',
  },
  categoryBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.primary,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  productDescription: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  specificationsContainer: {
    backgroundColor: colors.muted + '4D',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border + '80',
    marginBottom: spacing.md,
  },
  specificationsTitle: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.foreground,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  specsList: {
    gap: 6,
  },
  specItem: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border + '4D',
  },
  specText: {
    fontSize: fontSize.xs,
    color: colors.foreground,
  },
  moreSpecs: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  attributesContainer: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border + '80',
    gap: spacing.md,
  },
  attributesLabel: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.foreground,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  attributeIdsText: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    fontStyle: 'italic',
  },
  attributesListContainer: {
    gap: spacing.md,
  },
  attributeDisplaySection: {
    gap: spacing.sm,
  },
  attributeDisplayName: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.foreground,
    letterSpacing: 1,
  },
  attributeDisplayValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  attributeDisplayValue: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary + '20',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  attributeDisplayValueText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.primary,
  },
  attributeSection: {
    gap: spacing.sm,
  },
  attributeName: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.foreground,
    letterSpacing: 1,
  },
  attributeValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  attributeValue: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border + '80',
  },
  attributeValueText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.secondaryForeground,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 3,
  },
  noResultsIcon: {
    opacity: 0.2,
    marginBottom: spacing.md,
  },
  noResultsTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  noResultsText: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  closeButton: {
    fontSize: fontSize.xxl,
    color: colors.foreground,
  },
  modalContent: {
    flex: 1,
    padding: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  helperText: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  select: {
    marginTop: spacing.xs,
  },
  emptySelectMessage: {
    padding: spacing.sm,
  },
  emptySelectText: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  visibilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visibilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  visibilityText: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  specInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  specInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
  specAddButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.muted,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  specListText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
  specDeleteButton: {
    padding: spacing.sm,
  },
  attributeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  addAttributeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    minHeight: 36,
  },
  addAttributeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  attributeFormSection: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  attributeNameRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  attributeNameInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: fontSize.sm,
    color: colors.foreground,
    marginRight: spacing.sm,
  },
  attributeDeleteButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attributeValuesSection: {
    paddingLeft: spacing.md,
  },
  attributeValuesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  attributeValuesLabel: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
  },
  addValueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  addValueText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  attributeValueRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  attributeValueInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: fontSize.sm,
    color: colors.foreground,
    marginRight: spacing.sm,
  },
  valueDeleteButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl * 2,
    borderRadius: 12,
    height: 56,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  overlayContent: {
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  overlayText: {
    marginTop: spacing.sm,
    color: '#FFFFFF',
    fontSize: fontSize.md,
  },
});

// Remove React.memo to ensure component always re-renders when parent updates
// This prevents issues where products disappear when categories collapse
export default ProductList;
