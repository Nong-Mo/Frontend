import React from 'react';
import { View, StyleSheet } from 'react-native';
import PlayerHeader from '../../components/navigations/header/PlayerHeader';
import PlayerBottomBar from '../../components/navigations/bottom-bar/PlayerBottomBar';
import ImageViewer from '../../components/player/ImageViewer';
import BookInfoViewer from '../../components/player/BookInfoViewer';

// For Debug
const PlaceholderImage = require('../../../assets/icon.png');

const PlayerScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <PlayerHeader />
      <View style={styles.container}>
        <View style={styles.ImageViewerContainer}>
          <BookInfoViewer
            book={{ title: '내 작은 서재', imgSource: PlaceholderImage }}
          />
          <PlayerBottomBar />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
  },
  ImageViewerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlayerScreen;
