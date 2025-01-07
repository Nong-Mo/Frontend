import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  barWidth?: number; // 막대 두께 (px)
  borderRadius?: number; // 모서리 둥근 정도 (px)
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
                                                          currentTime,
                                                          duration,
                                                          onSeek,
                                                          barWidth = 8, // 기본 두께 8px
                                                          borderRadius = 5, // 기본 모서리 둥근 정도 5px
                                                        }) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const clickPosition = (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth;
    onSeek(clickPosition * duration);
  };

  // 웨이브 막대 생성
  const waveSegments = Array.from({ length: 30 }, (_, i) => {
    const isLeftEdge = i < 3; // 왼쪽 3개
    const isRightEdge = i >= 27; // 오른쪽 3개
    const isCenter = i >= 3 && i < 27; // 중앙 24개
    const midPoint = 15; // 중앙 기준 계산 (중앙 시작과 끝의 중간)

    // 높이 계산
    let height = 15; // 기본 최소 높이
    if (isLeftEdge || isRightEdge) {
      // 양옆 영역: 자연스럽게 감소
      const edgeDistance = isLeftEdge ? i : 29 - i; // 양 끝의 거리
      height = 15 + edgeDistance * 5; // 끝으로 갈수록 작아짐
    } else if (isCenter) {
      // 중앙 영역: 교차 패턴
      height = i % 2 === 0 ? 50 : 35; // 교차 높이
    }

    return {
      height,
      isPlayed: (i + 1) / 30 <= currentTime / duration || currentTime === duration, // 마지막까지 정확히 포함
    };
  });

  return (
      <div className="w-full flex flex-col items-center">
        {/* 웨이브 */}
        <div
            className="relative flex justify-center items-center w-full h-16 cursor-pointer"
            onClick={handleClick}
        >
          {waveSegments.map((segment, index) => {
            const progressRatio = currentTime / duration;
            const isActive = (index + 1) / 30 <= progressRatio || currentTime === duration; // 보정된 공식

            return (
                <div
                    key={index}
                    className={`transition-all ${isActive ? 'bg-[#246BFD]' : 'bg-white'}`}
                    style={{
                      width: `${barWidth}px`, // 막대 너비
                      height: `${segment.height}px`, // 막대 높이
                      borderRadius: `${borderRadius}px`, // 모서리 둥근 정도
                      marginLeft: `${barWidth / 3}px`, // 막대 간격
                      marginRight: `${barWidth / 4}px`,
                      backgroundColor: isActive ? '#007bff' : '#e0e0e0', // 자연스러운 색 전환
                      transition: `background-color 0.05s linear, height 0.1s ease`, // 짧고 빠른 전환
                    }}
                ></div>
            );
          })}
        </div>
        {/* 시간 표시 */}
        <div className="flex justify-between mt-2 w-full px-4">
          <span className="text-neutral-50 text-sm">{formatTime(currentTime)}</span>
          <span className="text-neutral-50 text-sm">{formatTime(duration)}</span>
        </div>
      </div>
  );
};