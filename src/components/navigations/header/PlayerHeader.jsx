import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderContainer from './HeaderContainer';

const PlayerHeader = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderContainer>
        <View className="flex-row justify-between items-center w-full h-14 bg-white px-4">
          <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} />
          </TouchableOpacity>
          <View className="flex-row gap-4 justify-end">
            <TouchableOpacity>
              <Icon name="share" size={24} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="sync" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </HeaderContainer>
    </SafeAreaView>
  );
};

export default PlayerHeader;
