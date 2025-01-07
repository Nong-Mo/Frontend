import { AudioData } from '../types/audio';

// 임시 테스트 데이터
const mockAudioData: AudioData = {
  id: '1',
  title: '해리포터와 아즈카반의 죄수',
  bookName: '해리포터와 아즈카반의 죄수',
  createdAt: '2024-12-31',
  audioUrl: '/music/운수좋은날.mp3',
  bookCover: '/covers/audio_cover.png',
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