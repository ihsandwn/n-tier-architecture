import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { NotificationProvider } from '@/context/notification-context';
import Toast from 'react-native-toast-message';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Show splash screen or loading indicator
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {isAuthenticated === false ? (
          // Auth Stack
          <>
            <Stack.Screen
              name="auth/login"
              options={{
                headerShown: false,
                animationEnabled: false,
              }}
            />
            <Stack.Screen
              name="auth/signup"
              options={{
                title: 'Create Account',
              }}
            />
          </>
        ) : (
          // App Stack
          <>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                animationEnabled: false,
              }}
            />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </>
        )}
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider token={null}>
        <RootLayoutNav />
      </NotificationProvider>
    </AuthProvider>
  );
}
