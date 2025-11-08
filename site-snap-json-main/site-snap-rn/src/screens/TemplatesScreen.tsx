import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/AppNavigator';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, spacing, fontSize, shadows } from '../theme';
import { dataService, Template } from '../services/dataService';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, Check } from 'lucide-react-native';

type TemplatesScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'Templates'>;

const TemplatesScreen: React.FC = () => {
  const navigation = useNavigation<TemplatesScreenNavigationProp>();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const templatesData = await dataService.getTemplates();
    setTemplates(templatesData);

    const selectedIds = await dataService.getSelectedTemplates();
    if (selectedIds.length > 0) {
      setSelectedTemplate(selectedIds[0]);
    }
  };

  const handleSelect = async () => {
    if (!selectedTemplate) {
      Alert.alert('Error', 'Please select a template');
      return;
    }

    await dataService.linkTemplatesToSeller([selectedTemplate]);
    navigation.navigate('Products');
  };

  return (
    <LinearGradient colors={[colors.background, colors.muted]} style={styles.container}>
      <Navigation />

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose Your Template</Text>
          <Text style={styles.subtitle}>Pick a design that matches your style</Text>
        </View>

        <View style={styles.templatesContainer}>
          {templates.map((template) => (
            <TouchableOpacity
              key={template.id}
              onPress={() =>
                setSelectedTemplate(selectedTemplate === template.id ? null : template.id)
              }
              activeOpacity={0.8}
              style={styles.templateCard}
            >
              <Card
                style={[
                  styles.card,
                  shadows.soft,
                  selectedTemplate === template.id && styles.selectedCard,
                ].filter(Boolean) as ViewStyle[]}
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: template.thumbnail }} style={styles.image} />
                  {selectedTemplate === template.id && (
                    <View style={styles.selectedBadge}>
                      <Check size={20} color={colors.primaryForeground} />
                    </View>
                  )}
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateDescription}>{template.description}</Text>
                  <Button
                    onPress={() => {
                      Alert.alert('Preview', 'Preview feature coming soon!');
                    }}
                    variant="outline"
                    size="sm"
                    style={styles.previewButton}
                  >
                    <View style={styles.buttonContent}>
                      <Eye size={16} color={colors.primary} />
                      <Text style={styles.buttonText}>Preview</Text>
                    </View>
                  </Button>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          onPress={handleSelect}
          activeOpacity={0.9}
          style={[
            styles.floatingButton,
            selectedTemplate ? styles.floatingButtonActive : styles.floatingButtonInactive,
            shadows.strong
          ]}
        >
          <Text style={[
            styles.floatingButtonText,
            selectedTemplate ? styles.floatingButtonTextActive : styles.floatingButtonTextInactive
          ]}>
            {selectedTemplate ? 'Continue with Selected Template' : 'Select a Template'}
          </Text>
        </TouchableOpacity>
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
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 120,
  },
  titleContainer: {
    marginBottom: spacing.xl * 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
  templatesContainer: {
    gap: spacing.lg,
  },
  templateCard: {
    width: '100%',
  },
  card: {
    padding: 0,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colors.muted,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: colors.primaryForeground,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: spacing.md,
  },
  templateName: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  templateDescription: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginBottom: spacing.md,
  },
  previewButton: {
    width: '100%',
    borderRadius: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  buttonText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 50,
  },
  floatingButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 9999,
    elevation: 8,
  },
  floatingButtonActive: {
    backgroundColor: colors.primary,
  },
  floatingButtonInactive: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
  },
  floatingButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  floatingButtonTextActive: {
    color: colors.primaryForeground,
  },
  floatingButtonTextInactive: {
    color: colors.foreground,
  },
});

export default TemplatesScreen;

