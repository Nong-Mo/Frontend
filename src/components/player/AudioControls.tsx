import React, { useState } from 'react';
import fwd from '../../icons/player/fwd.svg';
import play from '../../icons/player/play.svg';
import pause from '../../icons/player/pause.svg';
import rewind from '../../icons/player/rewind.svg';

interface AudioControlsProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onForward: () => void;
    onRewind: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
    isPlaying,
    onPlayPause,
    onForward,
    onRewind,

}) => {
    return (
        <div className="bottom-[135px] w-[250px] h-[85px] flex items-center justify-around rounded-full">
            <img
                src={rewind}
                className="w-8 h-8 cursor-pointer"
                alt="rewind"
                onClick={onRewind}
            />
            <img
                src={isPlaying ? pause : play}
                className="w-[55px] h-[55px] cursor-pointer"
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
    );
};