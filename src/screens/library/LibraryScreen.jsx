import React from 'react';
import { View, ScrollView } from 'react-native';
import MainHeader from '../../components/navigations/header/MainHeader';

const LibraryScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <MainHeader />
      <ScrollView>{/* 콘텐츠 영역 */}</ScrollView>
    </View>
  );
};

export default LibraryScreen;
