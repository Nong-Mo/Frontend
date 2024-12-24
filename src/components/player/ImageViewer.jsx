import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export default function ImageViewer({ imgSource, selectedImage }) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;
  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 340,
    borderRadius: 18,
  },
});
