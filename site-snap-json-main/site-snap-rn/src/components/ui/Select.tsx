import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ViewStyle } from 'react-native';
import { colors, spacing, fontSize } from '../../theme';
import { ChevronDown, Check } from 'lucide-react-native';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectContextType {
  selectedValue: string;
  onSelect: (value: string) => void;
  items: { value: string; label: React.ReactNode }[];
  registerItem: (value: string, label: React.ReactNode) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export const Select: React.FC<SelectProps> = ({ 
  value, 
  onValueChange, 
  placeholder, 
  disabled = false,
  style,
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<{ value: string; label: React.ReactNode }[]>([]);

  const registerItem = (itemValue: string, label: React.ReactNode) => {
    setItems(prev => {
      const exists = prev.find(item => item.value === itemValue);
      if (exists) return prev;
      return [...prev, { value: itemValue, label }];
    });
  };

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  const selectedItem = items.find(item => item.value === value);

  return (
    <SelectContext.Provider value={{ selectedValue: value, onSelect: handleSelect, items, registerItem }}>
      <View style={[styles.container, style]}>
        <TouchableOpacity
          style={[styles.trigger, disabled && styles.disabled]}
          onPress={() => !disabled && setIsOpen(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.triggerText, !selectedItem && styles.placeholder]}>
            {selectedItem ? selectedItem.label : placeholder || 'Select...'}
          </Text>
          <ChevronDown size={20} color={colors.foreground} />
        </TouchableOpacity>

        <Modal visible={isOpen} transparent animationType="fade">
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setIsOpen(false)}
          >
            <View style={styles.modalContent}>
              <FlatList
                data={items}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      item.value === value && styles.selectedItem
                    ]}
                    onPress={() => handleSelect(item.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.itemText, item.value === value && styles.selectedItemText]}>
                      {item.label}
                    </Text>
                    {item.value === value && (
                      <Check size={16} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={{ display: 'none' }}>
          {children}
        </View>
      </View>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<{ children: React.ReactNode; className?: string }> = () => null;
export const SelectValue: React.FC<{ placeholder?: string }> = () => null;
export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  const context = React.useContext(SelectContext);
  
  React.useEffect(() => {
    if (context) {
      context.registerItem(value, children);
    }
  }, [value, children, context]);

  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
  triggerText: {
    fontSize: fontSize.md,
    color: colors.foreground,
    flex: 1,
  },
  placeholder: {
    color: colors.mutedForeground,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    maxHeight: '60%',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedItem: {
    backgroundColor: colors.muted,
  },
  itemText: {
    fontSize: fontSize.md,
    color: colors.foreground,
    flex: 1,
  },
  selectedItemText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

