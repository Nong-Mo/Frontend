import React, { useState } from 'react';

interface ProgressBarProps {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
    barWidth?: number;
    borderRadius?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
                                                            currentTime,
                                                            duration,
                                                            onSeek,
                                                            barWidth = 8,
                                                            borderRadius = 5,
                                                        }) => {
    const [isClicked, setIsClicked] = useState(false);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsClicked(true);
        const bar = e.currentTarget;
        const clickPosition = (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth;
        onSeek(clickPosition * duration);
        // 짧은 시간 후 isClicked 리셋
        setTimeout(() => setIsClicked(false), 50);
    };

    // 웨이브 막대 생성
    const waveSegments = Array.from({ length: 30 }, (_, i) => {
        const isLeftEdge = i < 3;
        const isRightEdge = i >= 27;
        const isCenter = i >= 3 && i < 27;

        // 높이 계산
        let height = 15;
        if (isLeftEdge || isRightEdge) {
            const edgeDistance = isLeftEdge ? i : 29 - i;
            height = 15 + edgeDistance * 5;
        } else if (isCenter) {
            height = i % 2 === 0 ? 50 : 35;
        }

        return {
            height,
        };
    });

    const progress = (currentTime / duration) * 100;

    return (
        <div className="w-full flex flex-col items-center">
            {/* 웨이브 */}
            <div
                className="relative flex justify-center items-center w-full h-16 cursor-pointer"
                onClick={handleClick}
            >
                {/* 배경 웨이브 */}
                <div className="absolute inset-0 flex justify-center items-center">
                    {waveSegments.map((segment, index) => (
                        <div
                            key={`bg-${index}`}
                            className="bg-white"
                            style={{
                                width: `${barWidth}px`,
                                height: `${segment.height}px`,
                                borderRadius: `${borderRadius}px`,
                                marginLeft: `${barWidth / 3}px`,
                                marginRight: `${barWidth / 4}px`,
                            }}
                        />
                    ))}
                </div>

                {/* 진행 웨이브 */}
                <div
                    className="absolute inset-0 flex justify-center items-center overflow-hidden"
                    style={{
                        clipPath: `inset(0 ${100 - progress}% 0 0)`,
                        transition: isClicked ? 'none' : 'clip-path 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    {waveSegments.map((segment, index) => (
                        <div
                            key={`fg-${index}`}
                            className="bg-[#246BFD]"
                            style={{
                                width: `${barWidth}px`,
                                height: `${segment.height}px`,
                                borderRadius: `${borderRadius}px`,
                                marginLeft: `${barWidth / 3}px`,
                                marginRight: `${barWidth / 4}px`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* 시간 표시 */}
            <div className="flex justify-between mt-2 w-full px-4">
                <span className="text-neutral-50 text-sm">{formatTime(currentTime)}</span>
                <span className="text-neutral-50 text-sm">{formatTime(duration)}</span>
            </div>
        </div>
    );
};