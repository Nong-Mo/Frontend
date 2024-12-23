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
    <View style={{ position: 'absolute', top: 10, left: 15 }}>
       <TouchableOpacity
        onPress={handleNavigateToScan} 
        style={{
          width: 150,
          height: 150,
          backgroundColor: '#e0e0e0',
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15,
          margin: 15,
        }}
      >
        <Icon name="camera-alt" size={48} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
};

export default MoveScanCard;
