import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Token management service
export const tokenStorage = {
  async saveToken(token: string) {
    try {
      await SecureStore.setItemAsync('auth_token', token);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('auth_token');
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  },

  async removeToken() {
    try {
      await SecureStore.deleteItemAsync('auth_token');
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },

  async saveUser(user: any) {
    try {
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  },

  async getUser(): Promise<Record<string, any> | null> {
    try {
      const user = await AsyncStorage.getItem('auth_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  },

  async removeUser() {
    try {
      await AsyncStorage.removeItem('auth_user');
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  },

  async clear() {
    try {
      await this.removeToken();
      await this.removeUser();
    } catch (error) {
      console.error('Failed to clear auth storage:', error);
    }
  },
};
