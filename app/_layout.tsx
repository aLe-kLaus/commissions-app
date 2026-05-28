import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={colors.background} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { color: colors.text, fontWeight: '600' },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="sale/new"
            options={{ title: 'Nova Venda', presentation: 'modal' }}
          />
          <Stack.Screen name="sale/[id]" options={{ title: 'Editar Venda' }} />
          <Stack.Screen name="months/[month]" options={{ title: 'Detalhes do Mês' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
