import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'siteSnap.authToken';
let inMemoryToken: string | null = null;

export async function setToken(token: string): Promise<void> {
  inMemoryToken = token;
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  if (inMemoryToken !== null) {
    return inMemoryToken;
  }
  const stored = await AsyncStorage.getItem(TOKEN_KEY);
  inMemoryToken = stored;
  return stored;
}

export async function clearToken(): Promise<void> {
  inMemoryToken = null;
  await AsyncStorage.removeItem(TOKEN_KEY);
}

