import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek
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

  return (
    <div className="w-full">
      <div
        className="relative w-full h-2 bg-white rounded-full cursor-pointer"
        onClick={handleClick}
      >
        <div
          className="absolute left-0 top-0 h-full bg-blue-600 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-neutral-50 text-sm">{formatTime(currentTime)}</span>
        <span className="text-neutral-50 text-sm">{formatTime(duration)}</span>
      </div>
    </div>
  );
};