import React from 'react';
import { View, StyleSheet } from 'react-native';
import PlayerHeader from '../../components/navigations/header/PlayerHeader';
import PlayerBottomBar from '../../components/navigations/bottom-bar/PlayerBottomBar';
import ImageViewer from '../../components/player/ImageViewer';

const PlaceholderImage = require('../../../assets/icon.png');

const PlayerScreen = () => {
  return (
    <View style={styles.container}>
      <PlayerHeader />
      <View style={styles.ImageViewerContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <PlayerBottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  ImageViewerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlayerScreen;
