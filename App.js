import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import PinScreen from './src/screens/PinScreen';
import TodayScreen from './src/screens/TodayScreen';
import GymScreen from './src/screens/GymScreen';
import FoodScreen from './src/screens/FoodScreen';
import LearnScreen from './src/screens/LearnScreen';
import WorkScreen from './src/screens/WorkScreen';
import StatsScreen from './src/screens/StatsScreen';
import { C } from './src/utils/theme';

const Tab = createBottomTabNavigator();
const ICONS = { Today: '⚡', Gym: '🏋️', Food: '🥩', Learn: '📚', Work: '💻', Stats: '📈' };

export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) return <PinScreen onUnlock={() => setUnlocked(true)} />;

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{ICONS[route.name]}</Text>
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 10, fontWeight: '600', color: focused ? C.accent : C.muted, marginBottom: 2 }}>
              {route.name.toUpperCase()}
            </Text>
          ),
          tabBarStyle: { backgroundColor: C.bg2, borderTopColor: C.border, borderTopWidth: 0.5, height: 72, paddingTop: 10 },
          headerStyle: { backgroundColor: C.bg, borderBottomColor: C.border, borderBottomWidth: 0.5, shadowOpacity: 0, elevation: 0 },
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: C.accent, letterSpacing: 3 }}>GAINZ</Text>
              <Text style={{ fontSize: 12, color: C.muted }}>{route.name}</Text>
            </View>
          ),
        })}
      >
        <Tab.Screen name="Today" component={TodayScreen} />
        <Tab.Screen name="Gym" component={GymScreen} />
        <Tab.Screen name="Food" component={FoodScreen} />
        <Tab.Screen name="Learn" component={LearnScreen} />
        <Tab.Screen name="Work" component={WorkScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
