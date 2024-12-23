import React from 'react';
import { View } from 'react-native';
import ScanHeader from '../../components/navigations/header/ScanHeader';
import ScanBottomBar from '../../components/navigations/bottom-bar/ScanBottomBar';

const ScanScreen = () => {
  return (
    <View className="flex-1 bg-black">
      <ScanHeader />
      {/* 카메라 영역 */}
      <ScanBottomBar />
    </View>
  );
};

export default ScanScreen;
