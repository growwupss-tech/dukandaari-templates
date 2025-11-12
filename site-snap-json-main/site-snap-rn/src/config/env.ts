import Constants from 'expo-constants';
import { Platform } from 'react-native';

const extra = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};

const inferDevServerHost = (): string | undefined => {
  // For Expo Go, extract the host from debuggerHost or packagerHostname
  const debuggerHost = (Constants.expoConfig as any)?.debuggerHost;
  const packagerHostname = (Constants.expoConfig as any)?.packagerHostname;
  
  if (debuggerHost) {
    // debuggerHost format: "192.168.x.x:19000"
    const host = debuggerHost.split(':')[0];
    if (host && host !== 'localhost') {
      return `http://${host}:3000`;
    }
  }
  
  if (packagerHostname) {
    return `http://${packagerHostname}:3000`;
  }

  const hostUri =
    // Newer Expo (sdk 51+) exposes expoConfig.hostUri
    (Constants.expoConfig as any)?.hostUri ??
    // Expo Go config in development
    (Constants as any)?.expoGoConfig?.hostUri ??
    // Legacy manifest host
    (Constants.manifest as any)?.hostUri ??
    null;

  if (!hostUri) return undefined;

  const hostPart = hostUri.split(':')[0];
  if (!hostPart) return undefined;

  // Android emulator needs 10.0.2.2 instead of localhost
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:3000`;
  }

  return `http://${hostPart}:3000`;
};

export const API_BASE_URL: string =
  (extra.apiUrl as string | undefined) ??
  (process.env.EXPO_PUBLIC_API_URL as string | undefined) ??
  inferDevServerHost() ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');

