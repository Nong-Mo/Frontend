import React, {useEffect, useState, useLayoutEffect} from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { audioService } from '../services/audioService';

// [타입]
import { AudioData } from '../types/audio';

// [컴포넌트]
import { NavBar } from '../components/common/NavBar';
import { BookInfo } from '../components/player/BookInfo';
import { ProgressBar } from '../components/player/ProgressBar';
import { AudioControls } from '../components/player/AudioControls';
import ConvertModal from '../components/player/ConvertModal';

const Player: React.FC = () => {
  const fileID = useParams().id;
  const navigate = useNavigate();

  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
  } = useAudioPlayer(audioData?.audioUrl || '');

  // 렌더링이 완료되기 전, 데이터를 가져옴
  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        if(fileID === undefined) return;
        const data = await audioService?.fetchAudioData(fileID);
        setAudioData(data);

      } catch (err) {
        setError((err as Error).message);
        alert('잘못된 접근입니다.');
        navigate(-1);
      }
    }
    fetchData();
  }, []);

  // PDF <-> Audio 뷰어 변환 모달을 열고 닫는 함수
  const onClickConvertModal = (isOpen : boolean) => {
    setIsModalOpen(isOpen);
  };

  /* Player 페이지를 벗어나면 노래를 중지 */
  useEffect(() => {
    return () => {
      if (isPlaying === 1) {
        togglePlay();
      }
    };
  }, []);

  return (
    <div className="mt-[15px] w-full flex flex-col min-h-screen z-10">
      <NavBar
          onMenuClick={ () => {onClickConvertModal(true)}}
          title='플레이어'
          hideLeftIcon={false}
          showMenu={false}
          iconNames={{
            backIcon: "뒤로가기",
            convertIcon: "변환하기",
            aiIcon: "AI 로봇"
          }}
          backPageName={`/library/${useParams().type}`}
          rightIcons={['convert', 'ai']}
      />


      { /* 콘텐츠 area 설정 */ }
      <div className="w-[350px] pt-[50px] flex flex-col mx-auto">
        <div className="flex flex-col">
          {/* 이미지 섹션 */}
          <div className="flex items-center justify-center">
            <img
              src="/covers/audio_cover.png"
              alt="오디오 북 커버 이미지"
              className="w-[319px] h-[319px] object-cover rounded-lg"
            />
          </div>

          <div className="mt-[50px]">
            {/* 책 정보 */}
            <div className="flex flex-col items-center">
              <BookInfo
                bookName={audioData?.bookName}
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
        onClose={() => {onClickConvertModal(false)}}
      />
    </div>
  );
};

export default Player;