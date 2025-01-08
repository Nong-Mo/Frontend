import React, {useEffect, useState, useCallback, useLayoutEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { NavBar } from '../components/common/NavBar';
import { BookInfo } from '../components/player/BookInfo';
import { ProgressBar } from '../components/player/ProgressBar';
import { AudioControls } from '../components/player/AudioControls';
import ConvertModal from '../components/player/ConvertModal';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { audioService } from '../services/audioService';
import { AudioData } from '../types/audio';

const Player: React.FC = () => {
  const navigate = useNavigate();
  const fileID = useParams().id;
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    setAudioVolume,
    isMuted,
    toggleMute
  } = useAudioPlayer(audioData?.audioUrl || '');

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const data = await audioService.fetchAudioData(fileID);
        setAudioData(data);
      } catch (err) {
        setError((err as Error).message);
      }
    }
    fetchData();
  }, []);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  /* Player 페이지를 벗어나면 노래를 중지 */
  useEffect(() => {
    return () => {
      if (isPlaying) {
        togglePlay();
      }
    };
  }, [isPlaying, togglePlay]);

  if (error) return <div>Error: {error}</div>;
  if (!audioData) return <div>Loading...</div>;

  return (
    <div className="w-full flex flex-col min-h-screen z-10">
      <NavBar
          onMenuClick={handleModalOpen}
          title='플레이어'
          hideLeftIcon={false}
          showMenu={false}
          iconNames={{
            backIcon: "뒤로가기",
            convertIcon: "변환하기",
            aiIcon: "AI 로봇"
          }}
          rightIcons={['convert', 'ai']}
      />


      { /* 콘텐츠 area 설정 */ }
      <div className="w-[350px] pt-[50px] flex flex-col mx-auto">
        <div className="flex flex-col">
          {/* 이미지 섹션 */}
          <div className="flex items-center justify-center">
            <img
              src={audioData.bookCover}
              alt="book cover"
              className="w-[319px] h-[319px] object-cover rounded-lg"
            />
          </div>

          <div className="mt-[50px]">
            {/* 책 정보 */}
            <div className="flex flex-col items-center">
              <BookInfo
                bookName={audioData.bookName}
              />
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
              />
            </div>

            <div className="flex flex-col items-center mt-[50px] mb-[50px]">
              <AudioControls
                isPlaying={isPlaying}
                onPlayPause={togglePlay}
                onForward={() => seek(currentTime + 10)}
                onRewind={() => seek(currentTime - 10)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Convert Modal */}
      <ConvertModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default Player;