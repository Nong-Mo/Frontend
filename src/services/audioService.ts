import { AudioData } from '../types/audio';

// 임시 테스트 데이터
const mockAudioData: AudioData = {
  id: '1',
  title: '점심',
  bookName: '점심',
  createdAt: '2024-12-31',
  audioUrl: '/music/시연용(다들_점심_맛있게_드세요).mp3',
  bookCover: '/covers/lunch.jpg',
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