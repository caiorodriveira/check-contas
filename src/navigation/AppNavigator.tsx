import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import DespesasScreen from '../screens/DespesasScreen';
import ReceitasScreen from '../screens/ReceitasScreen';
import CartoesScreen from '../screens/CartoesScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Despesas" 
        component={DespesasScreen} 
        options={{ title: 'Despesas do Mês' }} 
      />
      <Stack.Screen 
        name="Receitas" 
        component={ReceitasScreen} 
        options={{ title: 'Receitas do Mês' }} 
      />
      <Stack.Screen 
        name="Cartoes" 
        component={CartoesScreen} 
        options={{ title: 'Gerenciar Cartões' }} 
      />
    </Stack.Navigator>
  );
}
