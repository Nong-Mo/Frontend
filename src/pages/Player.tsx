import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/common/NavBar';
import { BookInfo } from '../components/player/BookInfo';
import { ProgressBar } from '../components/player/ProgressBar';
import { AudioControls } from '../components/player/AudioControls';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { audioService } from '../services/audioService';
import { AudioData } from '../types/audio';
import imageCover from '../icons/player/ImageCover.png';

const Player: React.FC = () => {
  const navigate = useNavigate();
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await audioService.fetchAudioData('1');
        setAudioData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

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
    <div className="page-container flex flex-col h-[956px] pl-10 pr-10">
      <NavBar onMenuClick={() => navigate('/login')} />

      <div className="relative z-10 flex flex-col h-[956px] mt-10">
        {/* 이미지 섹션 */}
        <div className="h-[350px] flex items-center justify-center">
          <img
            src={audioData.bookCover}
            alt="book cover"
            className="w-[300px] h-[300px] object-cover rounded-lg"
          />
        </div>

        {/* 컨트롤 섹션 */}
        <div className="mt-8 style={{width: '100%'}}"> {/* mt-8 또는 다른 마진 값으로 간격 조절 */}
          {/* 책 정보 */}
          <div className="flex flex-col items-center mb-8 mt-4">
            <BookInfo
              bookName={audioData.bookName}
              createdAt={audioData.createdAt}
            />
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seek}
            />
          </div>

          <div className="flex justify-center items-center">
            <AudioControls
              isPlaying={isPlaying}
              onPlayPause={togglePlay}
              onForward={() => seek(currentTime + 10)}
              onRewind={() => seek(currentTime - 10)}
              onVolumeChange={setAudioVolume}
              isMuted={isMuted}
              toggleMute={toggleMute}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;