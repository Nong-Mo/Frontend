import { AudioData } from '../types/audio';

// 임시 테스트 데이터
const mockAudioData: AudioData = {
  id: '1',
  title: '책 이름',
  bookName: '책 이름',
  createdAt: '2024-12-31',
  audioUrl: '/music/woodz_buck.mp3',
  bookCover: '/covers/ImageCover.png',
};

export const audioService = {
  fetchAudioData: async (id: string): Promise<AudioData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAudioData);
      }, 500);
    });
  }
};