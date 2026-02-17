import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TabIconProps = { readonly color: string; readonly focused: boolean };

function DashboardTabIcon({ color, focused }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? 'home' : 'home-outline'}
      color={color}
      size={24}
    />
  );
}

function ProductsTabIcon({ color, focused }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? 'cube' : 'cube-outline'}
      color={color}
      size={24}
    />
  );
}

function OrdersTabIcon({ color, focused }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? 'list' : 'list-outline'}
      color={color}
      size={24}
    />
  );
}

function MoreTabIcon({ color, focused }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'}
      color={color}
      size={24}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: DashboardTabIcon,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ProductsTabIcon,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: OrdersTabIcon,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: MoreTabIcon,
        }}
      />
    </Tabs>
  );
}
