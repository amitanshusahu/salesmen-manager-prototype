import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { At, House, MapPinPlus } from 'phosphor-react-native';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {
          }
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <House size={32} weight="fill" color={color} />
        }}
      />
      <Tabs.Screen
        name="salesmen"
        options={{
          title: 'salesmen',
          tabBarIcon: ({ color }) => <At size={32} weight="fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: 'location',
          tabBarIcon: ({ color }) => <MapPinPlus size={32} weight="fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          title: 'qr',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
