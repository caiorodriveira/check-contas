import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import DespesasScreen from '../screens/DespesasScreen';
import ReceitasScreen from '../screens/ReceitasScreen';
import CartoesScreen from '../screens/CartoesScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
      />
      <Stack.Screen
        name="Despesas"
        component={DespesasScreen}
      />
      <Stack.Screen
        name="Receitas"
        component={ReceitasScreen}
      />
      <Stack.Screen
        name="Cartoes"
        component={CartoesScreen}
      />
    </Stack.Navigator>
  );
}
