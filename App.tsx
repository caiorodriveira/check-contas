import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/database/sqlite';
import { useAppStore } from './src/store';

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const { loadData, checkAndSetInitialMonth } = useAppStore();

  useEffect(() => {
    async function setup() {
      await initDatabase();
      await checkAndSetInitialMonth();
      await loadData();
      setDbInitialized(true);
    }
    setup();
  }, [loadData]);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
