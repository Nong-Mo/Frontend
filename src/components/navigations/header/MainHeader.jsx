import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderContainer from './HeaderContainer';

const MainHeader = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderContainer>
        <View className="justify-center items-center w-full h-14 bg-white">
          <Text className="text-lg font-semibold">내 서재</Text>
        </View>
      </HeaderContainer>
    </SafeAreaView>
  );
};

export default MainHeader;