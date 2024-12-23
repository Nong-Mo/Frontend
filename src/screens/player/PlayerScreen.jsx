import React from 'react';
import { View } from 'react-native';
import PlayerHeader from '../../components/navigations/header/PlayerHeader';
import PlayerBottomBar from '../../components/navigations/bottom-bar/PlayerBottomBar';

const PlayerScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <PlayerHeader />
      {/* 플레이어 영역 */}
      <PlayerBottomBar />
    </View>
  );
};

export default PlayerScreen;
