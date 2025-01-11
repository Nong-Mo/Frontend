import React from 'react';
import { FaPlay, FaPause } from "react-icons/fa";
import { IoPlayForward, IoPlayBack } from "react-icons/io5";
import { MdReplayCircleFilled } from "react-icons/md";

interface AudioControlsProps {
    isPlaying: number;
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
    const getPlayIcon = () => {

        switch(isPlaying) {
            case 0:
                return <FaPlay color="white" size={30} />;
            case 1:
                return <FaPause color="white" size={30} />;
            case 2:
                return <MdReplayCircleFilled color="white" size={30} />;
        }
    }

    return (
        <div className="bottom-[135px] w-[250px] h-[85px] flex items-center justify-around rounded-full">
            <button
                className="w-12 h-12 cursor-pointer flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={onRewind}
                aria-label="rewind"
            >
                <IoPlayBack color="white" size={24} />
            </button>
            <button
                className="w-16 h-16 cursor-pointer flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={onPlayPause}
                aria-label="play/pause"
            >
                {getPlayIcon()}
            </button>
            <button
                className="w-12 h-12 cursor-pointer flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={onForward}
                aria-label="forward"
            >
                <IoPlayForward color="white" size={24} />
            </button>
        </div>
    );
}