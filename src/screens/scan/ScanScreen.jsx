import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { Camera } from 'expo-camera';
import ScanHeader from '../../components/navigations/header/ScanHeader';
import ScanBottomBar from '../../components/navigations/bottom-bar/ScanBottomBar';
import ScanView from '../../components/scan/ScanView';

const ScanScreen = () => {
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current && cameraRef.current.takePictureAsync) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true
        });
        console.log('Picture taken:', photo);
        // 여기에서 사진 처리 로직
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  return (
    <View className="flex-1 bg-black">
      <ScanHeader />
      <ScanView ref={cameraRef} />
      <ScanBottomBar onTakePicture={takePicture} />
    </View>
  );
};

export default ScanScreen;
