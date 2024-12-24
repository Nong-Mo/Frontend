import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSharedValue } from 'react-native-reanimated';

const PlayerBottomBar = () => {
  const progress = useSharedValue(0.35);
  const min = useSharedValue(0);
  const max = useSharedValue(100);

  return (
    <View className="h-20 bg-white px-4" style={styles.audioPlayerContainer}>
      <View style={styles.audioInfoContainer}>
        <Slider progress={progress} minimumValue={min} maximumValue={max} />
        <View className="flex-row justify-between">
          <Text style={styles.timeText}>00:00</Text>
          <Text style={styles.timeText}>10:00</Text>
        </View>
      </View>
      <View
        className="flex-row items-center h-full"
        style={styles.buttonContainer}
      >
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
  audioPlayerContainer: {
    width: '100%',
  },
  audioInfoContainer: {
    height: '50%',
  },
  buttonContainer: {
    justifyContent: 'space-around',
  },
  timeText: {
    opacity: 0.75,
    color: 'gray',
    fontWeight: 'bold',
  },
});

export default PlayerBottomBar;
