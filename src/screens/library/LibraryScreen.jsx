import React from 'react';
import { View, ScrollView } from 'react-native';
import MainHeader from '../../components/navigations/header/MainHeader';
import MoveScanCard from '../../components/shared/MoveScanCard'; // MoveScanCard import

const LibraryScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <MainHeader />
      <ScrollView contentContainerStyle={{ paddingTop: 530 }} > 
        <MoveScanCard /> {/* MoveScanCard 컴포넌트 추가 */}
      </ScrollView>
    </View>
  );
};

export default LibraryScreen;
