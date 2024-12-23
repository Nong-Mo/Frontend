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
      <View className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
        <Icon name="camera-alt" size={48} color="#9CA3AF" />{' '}
        {/* Material Icon */}
      </View>
      {/* 안내 텍스트 */}
      <Text className="text-lg font-bold text-gray-800 mb-2">
        내 서재가 비어 있습니다
      </Text>
      <Text className="text-sm text-gray-500 mb-6">
        파일을 추가하려면 아래 버튼을 눌러주세요.
      </Text>
      {/* 스캔 버튼 */}
      <TouchableOpacity
        onPress={handleNavigateToScan}
        className="bg-blue-500 px-6 py-2 rounded-full"
      >
        <Text className="text-white font-bold">스캔 화면으로 이동</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MoveScanCard;
