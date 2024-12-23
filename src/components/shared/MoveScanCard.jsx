import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Material Icons 사용
import { useNavigation } from '@react-navigation/native';

const MoveScanCard = () => {
  const navigation = useNavigation();

  const handleNavigateToScan = () => {
    navigation.navigate('ScanScreen'); // 스캔 스크린으로 이동
  };

  return (
    <View className="flex items-center">
      {/* 카메라 아이콘 */}
      {/* 터치 시 handleNavigateToScan 함수 실행 스캔 스크린으로 이동 */}
      <TouchableOpacity onPress={handleNavigateToScan}>
        <View className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
          <Icon name="camera-alt" size={48} color="#9CA3AF" />{' '} {/* Material Icons 사용 */} 
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MoveScanCard;
