import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from './ui/Button';
import { colors, spacing, fontSize } from '../theme';
import { Upload, X } from 'lucide-react-native';

interface FileUploaderProps {
  files: string[];
  onFilesChange: (files: string[]) => void;
  type: 'image' | 'video';
  accept?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ files, onFilesChange, type }) => {
  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newFiles = result.assets.map(asset => asset.uri);
      onFilesChange([...files, ...newFiles]);
      Alert.alert('Success', `${result.assets.length} ${type}(s) uploaded!`);
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <View style={styles.uploadArea}>
        <Upload size={40} color={colors.mutedForeground} style={styles.uploadIcon} />
        <Text style={styles.uploadText}>
          Tap to browse {type}s
        </Text>
        <Button onPress={pickMedia} variant="outline" size="sm" style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Choose {type}s</Text>
        </Button>
      </View>

      {files.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filesContainer}>
          {files.map((file, index) => (
            <View key={index} style={styles.fileCard}>
              {type === 'image' ? (
                <Image source={{ uri: file }} style={styles.image} />
              ) : (
                <View style={styles.videoPlaceholder}>
                  <Text style={styles.videoIcon}>🎥</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFile(index)}
              >
                <X size={14} color={colors.destructiveForeground} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.mutedForeground + '40',
    borderRadius: 12,
    padding: spacing.xl * 2,
    alignItems: 'center',
  },
  uploadIcon: {
    marginBottom: spacing.md,
    opacity: 0.4,
  },
  uploadText: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginBottom: spacing.sm,
  },
  uploadButton: {
    borderRadius: 12,
  },
  uploadButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  filesContainer: {
    marginTop: spacing.sm,
  },
  fileCard: {
    width: 150,
    height: 150,
    marginRight: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
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
  videoIcon: {
    fontSize: 32,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.destructive,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FileUploader;

