import { apiClient } from '../lib/apiClient';
import { setToken, clearToken, getToken } from '../lib/tokenStorage';

interface LoginResponse {
  success: boolean;
  token: string;
  user: any;
}

export interface AuthUser {
  _id: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'seller' | 'visitor';
  seller_id?: any;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const response = await apiClient.post<LoginResponse>('/api/auth/login', {
    email,
    password,
  });

  const { token, user } = response.data;
  await setToken(token);
  return user as AuthUser;
}

export async function register(email: string, password: string) {
  return apiClient.post('/api/auth/register', { email, password });
}

export async function logout(): Promise<void> {
  await clearToken();
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await apiClient.get<{ success: boolean; data: AuthUser }>('/api/auth/me');
    return response.data.data;
  } catch (error) {
    await clearToken();
    throw error;
  }
}

