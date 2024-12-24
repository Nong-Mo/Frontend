import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ImageViewer from './ImageViewer';

const BookInfoViewer = ({ book }) => {
  if (!book) {
    return null;
  }

  return (
    <View>
      <ImageViewer imgSource={book.imgSource} />
      <Text style={styles.bookTitle}>{book.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black', // 배경 변경 후 White로 변경 예정
    marginTop: 10,
  },
});

export default BookInfoViewer;
