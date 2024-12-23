import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ScanBottomBar = () => {
  const navigation = useNavigation();

  return (
    <View style={{ height: 200 }} className="flex-row justify-between items-center px-8 bg-white">
      <TouchableOpacity
        onPress={() => navigation.navigate('Main')}
        style={{ alignItems: 'center' }}
      >
        <Icon name="book" size={36} color="black" />
        <Text style={{ fontSize: 12, color: 'black', marginTop: 2 }}>
          내 서재
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ alignItems: 'center' }}>
        <View className="w-20 h-20 rounded-full bg-gray-50 items-center justify-center">
          <Icon name="camera" size={60} color="black" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={{ alignItems: 'center' }}>
        <Icon name="check" size={36} color="black" />
        <Text style={{ fontSize: 12, color: 'black', marginTop: 2 }}>
          완료
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScanBottomBar;