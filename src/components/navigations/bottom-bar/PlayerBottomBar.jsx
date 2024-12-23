import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlayerBottomBar = () => {
  return (
    <View className="h-20 bg-white px-4">
      <View className="flex-row justify-between items-center h-full">
        <TouchableOpacity>
          <Icon name="skip-previous" size={32} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="replay-10" size={32} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="play-circle-filled" size={48} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="forward-10" size={32} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="skip-next" size={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlayerBottomBar;
