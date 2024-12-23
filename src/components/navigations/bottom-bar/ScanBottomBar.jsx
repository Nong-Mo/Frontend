import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ScanBottomBar = ({ onTakePicture }) => {
  const navigation = useNavigation();

  return (
    <View className="h-20 flex-row justify-between items-center px-8 bg-black/50">
      <TouchableOpacity
        onPress={() => navigation.navigate('Library')}
        className="items-center"
      >
        <Icon name="home" size={28} color="white" />
        <Text className="text-xs text-white mt-1">홈</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={onTakePicture} 
        className="items-center"
      >
        <View className="w-16 h-16 rounded-full bg-white items-center justify-center">
          <View className="w-14 h-14 rounded-full border-2 border-black" />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity className="items-center">
        <Icon name="check" size={28} color="white" />
        <Text className="text-xs text-white mt-1">완료</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScanBottomBar;
