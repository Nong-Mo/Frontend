import React from 'react';
import { View, StyleSheet } from 'react-native';
import PlayerHeader from '../../components/navigations/header/PlayerHeader';
import PlayerBottomBar from '../../components/navigations/bottom-bar/PlayerBottomBar';
import BookInfoViewer from '../../components/player/BookInfoViewer';
import { ImageBackground } from 'expo-image';

// For Debug
const PlaceholderImage = {
  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzHkYKhAY3bOezbjl7Z871NdSs45J5_6i1qA&s',
};

const PlayerScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground source={PlaceholderImage} style={styles.container}>
        <PlayerHeader />
        <View style={styles.container}>
          <View style={styles.ImageViewerContainer}>
            <BookInfoViewer
              book={{ title: '소년이 온다', imgSource: PlaceholderImage }}
            />
            <PlayerBottomBar />
          </View>
        </View>
      </ImageBackground>
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
