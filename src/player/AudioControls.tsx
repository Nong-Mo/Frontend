import React, { useState } from 'react';
import fwd from '../../icons/player/fwd.svg';
import play from '../../icons/player/play.svg';
import pause from '../../icons/player/pause.svg';
import rewind from '../../icons/player/rewind.svg';
import mute from '../../icons/player/mute.svg';
import volumeSetting from '../../icons/player/volumeSetting.svg';
import library from '../../icons/player/library.svg';

interface AudioControlsProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onForward: () => void;
    onRewind: () => void;
    onVolumeChange: (volume: number) => void;
    isMuted: boolean;
    toggleMute: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
    isPlaying,
    onPlayPause,
    onForward,
    onRewind,
    onVolumeChange,
    isMuted,
    toggleMute
}) => {
    return (
        <div className="flex items-center justify-between w-full mt-10 px-10">
            <div className="relative">
                <img
                    src={isMuted ? mute : volumeSetting}  // ✅ 음소거 상태에 따라 다른 아이콘 사용
                    className="w-6 h-6 cursor-pointer"
                    alt="volume"
                    onClick={toggleMute}
                />
            </div>
            <div className="flex items-center gap-20">
                <img
                    src={rewind}
                    className="w-8 h-8 cursor-pointer"
                    alt="rewind"
                    onClick={onRewind}
                />
                <img
                    src={isPlaying ? pause : play}
                    className="w-20 h-20 cursor-pointer"
                    alt="play/pause"
                    onClick={onPlayPause}
                />
                <img
                    src={fwd}
                    className="w-8 h-8 cursor-pointer"
                    alt="forward"
                    onClick={onForward}
                />
            </div>
            <img src={library} className="w-6 h-6 cursor-pointer" alt="library" />
        </div>
    );
};