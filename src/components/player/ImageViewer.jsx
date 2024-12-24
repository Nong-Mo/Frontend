import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export default function ImageViewer({ imgSource }) {
  return <Image source={imgSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 340,
    borderRadius: 18,
  },
});
