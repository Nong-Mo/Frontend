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
        <div className="absolute w-[356px] h-[85px] flex items-center justify-around ounded-full">
            <img
                src={isMuted ? mute : volumeSetting}
                className="w-6 h-6 cursor-pointer"
                alt="volume"
                onClick={toggleMute}
            />
            <img
                src={rewind}
                className="w-6 h-6 cursor-pointer"
                alt="rewind"
                onClick={onRewind}
            />
            <img
                src={isPlaying ? pause : play}
                className="w-[48px] h-[48px] cursor-pointer"
                alt="play/pause"
                onClick={onPlayPause}
            />
            <img
                src={fwd}
                className="w-6 h-6 cursor-pointer"
                alt="forward"
                onClick={onForward}
            />
            <img src={library} className="w-6 h-6 cursor-pointer" alt="library" />
        </div>
    );
};