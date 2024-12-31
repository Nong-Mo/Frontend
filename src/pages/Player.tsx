import React, { useEffect, useState } from 'react';
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
    volume,
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

  if (error) return <div>Error: {error}</div>;
  if (!audioData) return <div>Loading...</div>;

  return (
    <div className="page-container flex flex-col min-h-screen">
      <NavBar onMenuClick={() => navigate('/login')} />
   
      <div className="relative z-10 flex flex-col h-[calc(100vh-64px)]">
        {/* 이미지 섹션 */}
        <div className="h-[45vh] flex items-center justify-center">
          <img 
            src={audioData.bookCover}
            alt="book cover" 
            className="max-w-[300px] max-h-[300px] w-auto h-auto object-cover rounded-lg"
          />
        </div>
   
        {/* 컨트롤 섹션 */}
        <div className="flex flex-col flex-1">
          {/* 책 정보 */}
          <div className="flex flex-col items-center mb-8">
            <BookInfo 
              bookName={audioData.bookName}
              createdAt={audioData.createdAt}
            />
          </div>
   
          {/* 프로그레스바와 컨트롤을 감싸는 컨테이너 */}
          <div className="flex flex-col items-center gap-8">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seek}
            />
   
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