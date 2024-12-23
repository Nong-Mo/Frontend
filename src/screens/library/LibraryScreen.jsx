import React from 'react';
import { View, ScrollView } from 'react-native';
import MainHeader from '../../components/navigations/header/MainHeader';
import MoveScanCard from '../../components/shared/MoveScanCard'; // MoveScanCard import

const LibraryScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <MainHeader />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <MoveScanCard /> {/* MoveScanCard 컴포넌트 추가 */}
      </ScrollView>
    </View>
  );
};

export default LibraryScreen;
