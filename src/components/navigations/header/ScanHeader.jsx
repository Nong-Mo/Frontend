import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderContainer from './HeaderContainer';

const ScanHeader = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderContainer>
        <View className="flex-row justify-between items-center w-full h-14 bg-black/60 px-4">
          <TouchableOpacity>
            <Icon name="flash-off" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="timer" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </HeaderContainer>
    </SafeAreaView>
  );
};

export default ScanHeader;