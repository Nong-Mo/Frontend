import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlayerBottomBar = () => {
  return (
    <View className="h-20 bg-white px-4" style={styles.playerBotomBarContainer}>
      <View className="flex-row justify-between items-center h-full">
        <TouchableOpacity>
          <Icon name="replay-10" size={32} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="play-circle-filled" size={48} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="forward-10" size={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerBotomBarContainer: {
    width: '65%',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
  },
});

export default PlayerBottomBar;
