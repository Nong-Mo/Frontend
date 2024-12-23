import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from '../../screens/main/MainScreen';
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
          height: 80, // 탭 바의 높이 조정 (기존 60)
          paddingTop: 10, // 위쪽 패딩 (아이콘과 레이블 간격)
          paddingBottom: 10, // 아래쪽 패딩 (탭 바 하단 여백)
          marginBottom: 0, // 탭 바 하단 여백
        },
        tabBarActiveTintColor: '#FFBF00', // 선택된 탭 아이콘 및 레이블 색상
        tabBarInactiveTintColor: '#808080', // 선택되지 않은 탭 아이콘 및 레이블 색상
      }}
    >
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{
          tabBarLabel: '내 서재',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" size={size} color={color} />
          ),
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
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;