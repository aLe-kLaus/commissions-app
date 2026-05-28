import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '../../src/theme';
import { t } from '../../src/strings';

function tabIcon(emoji: string) {
  return ({ color, focused }: { color: string; focused: boolean }) => (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.6, color }}>{emoji}</Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text, fontWeight: '700', fontSize: 20 },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabHome,
          tabBarIcon: tabIcon('🏠'),
          headerTitle: t.appName,
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: t.tabSales,
          tabBarIcon: tabIcon('📋'),
        }}
      />
      <Tabs.Screen
        name="months"
        options={{
          title: t.tabMonths,
          tabBarIcon: tabIcon('📅'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.tabSettings,
          tabBarIcon: tabIcon('⚙️'),
        }}
      />
    </Tabs>
  );
}
