import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ScanBottomBar = () => {
  const navigation = useNavigation();

  return (
    <View className="h-20 flex-row justify-between items-center px-8 bg-black/60">
      <TouchableOpacity onPress={() => navigation.navigate('Main')}>
        <Icon name="home" size={28} color="white" />
      </TouchableOpacity>
      <TouchableOpacity>
        <View className="w-16 h-16 rounded-full bg-white items-center justify-center">
          <Icon name="camera" size={32} color="black" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="check" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ScanBottomBar;
