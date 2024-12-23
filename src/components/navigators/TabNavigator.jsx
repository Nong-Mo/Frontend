import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LiabraryScreen from '../../screens/library/LibraryScreen';
import ScanScreen from '../../screens/scan/ScanScreen';
import PlayerScreen from '../../screens/player/PlayerScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 80,
          paddingTop: 10,
          paddingBottom: 10,
          marginBottom: 0,
          backgroundColor: '#FFFFFF',
        },
        tabBarActiveTintColor: '#FFBF00',
        tabBarInactiveTintColor: '#808080',
      }}
    >
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarLabel: '내 서재',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" size={size} color={color} />
          ),
          tabBarIconStyle: {
            marginBottom: 0,
          },
          tabBarLabelStyle: {
            marginBottom: 10
          }
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: '스캔',
          tabBarIcon: ({ color, size }) => (
            <Icon name="camera-alt" size={size} color={color} />
          ),
          tabBarIconStyle: {
            marginBottom: 0,
          },
          tabBarLabelStyle: {
            marginBottom: 10
          },
          tabBarStyle: { display: 'none' } // 탭 바 숨기기
        }}
      />
      <Tab.Screen
        name="Player"
        component={PlayerScreen}
        options={{
          tabBarLabel: '플레이어',
          tabBarIcon: ({ color, size }) => (
            <Icon name="headphones" size={size} color={color} />
          ),
          tabBarIconStyle: {
            marginBottom: 0,
          },
          tabBarLabelStyle: {
            marginBottom: 10,
          },
          tabBarStyle: { display: 'none' } // 탭 바 숨기기
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;