import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Clipboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/AppNavigator';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, spacing, fontSize } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import {
  exportDataAsJSON,
  importDataFromJSON,
  resetToDefaultData,
  clearAllData,
} from '../utils/dataSync';

type SettingsScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'Dashboard'>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);

  const handleExportData = async () => {
    try {
      setIsLoading(true);
      const jsonData = await exportDataAsJSON();
      
      // Copy to clipboard
      await Clipboard.setString(jsonData);
      
      Alert.alert(
        'Data Exported',
        'Your data has been copied to clipboard. You can paste it into the web app or save it as a backup.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportData = () => {
    Alert.prompt(
      'Import Data',
      'Paste your JSON data below:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async (jsonString) => {
            if (!jsonString) return;
            
            try {
              setIsLoading(true);
              await importDataFromJSON(jsonString);
              Alert.alert('Success', 'Data imported successfully!');
            } catch (error) {
              Alert.alert('Error', 'Invalid JSON data. Please check and try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'This will reset all data to the default values from JSON files. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await resetToDefaultData();
              Alert.alert('Success', 'Data reset to defaults!');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset data');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete ALL data from the app. This cannot be undone! Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await clearAllData();
              Alert.alert(
                'Data Cleared',
                'All data has been cleared. The app will restart with default data.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Restart the app flow
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Dashboard' as any }],
                      });
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={[colors.background, colors.muted]} style={styles.container}>
      <Navigation />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Data Management</Text>
          <Text style={styles.subtitle}>Manage your app data and sync with web app</Text>
        </View>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>📤 Export & Import</Text>
          <Text style={styles.sectionDescription}>
            Sync your data between mobile and web apps
          </Text>

          <View style={styles.buttonGroup}>
            <Button
              onPress={handleExportData}
              disabled={isLoading}
              loading={isLoading}
              style={styles.actionButton}
            >
              Export Data
            </Button>
            <Text style={styles.helperText}>
              Copy all your data to clipboard for backup or web app import
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <Button
              onPress={handleImportData}
              disabled={isLoading}
              variant="outline"
              style={styles.actionButton}
            >
              Import Data
            </Button>
            <Text style={styles.helperText}>
              Import data from web app or backup
            </Text>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>🔄 Reset Options</Text>
          <Text style={styles.sectionDescription}>
            Reset your data to default or clear everything
          </Text>

          <View style={styles.buttonGroup}>
            <Button
              onPress={handleResetToDefaults}
              disabled={isLoading}
              variant="outline"
              style={styles.actionButton}
            >
              Reset to Defaults
            </Button>
            <Text style={styles.helperText}>
              Reset all data to the default JSON values
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <Button
              onPress={handleClearAllData}
              disabled={isLoading}
              variant="outline"
              style={[styles.actionButton, styles.dangerButton]}
            >
              Clear All Data
            </Button>
            <Text style={[styles.helperText, styles.dangerText]}>
              ⚠️ Delete all data (cannot be undone)
            </Text>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ About JSON Data</Text>
          <Text style={styles.infoText}>
            • Data is stored locally on your device{'\n'}
            • Changes are saved automatically{'\n'}
            • Export data to backup or sync with web app{'\n'}
            • Import data from web app for consistency{'\n'}
            • JSON files provide initial default data
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Tips</Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Export regularly:</Text> Keep backups of your data{'\n'}
            {'\n'}
            <Text style={styles.bold}>Sync devices:</Text> Export from one device, import to another{'\n'}
            {'\n'}
            <Text style={styles.bold}>Web compatibility:</Text> Data format matches web app exactly{'\n'}
            {'\n'}
            <Text style={styles.bold}>Safe reset:</Text> "Reset to Defaults" keeps sample data
          </Text>
        </Card>
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  titleContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.mutedForeground,
  },
  section: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginBottom: spacing.lg,
  },
  buttonGroup: {
    marginBottom: spacing.lg,
  },
  actionButton: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  dangerButton: {
    borderColor: colors.destructive,
  },
  helperText: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    fontStyle: 'italic',
  },
  dangerText: {
    color: colors.destructive,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.foreground,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default SettingsScreen;

