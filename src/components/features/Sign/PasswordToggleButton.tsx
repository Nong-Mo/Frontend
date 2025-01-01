import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordToggleButtonProps {
    showPassword: boolean;
    onClick: () => void;
}

const PasswordToggleButton: React.FC<PasswordToggleButtonProps> = ({ showPassword, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="absolute h-[25px] right-[1px] top-8 text-[#5E6272]"
        >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
    );
};

export default PasswordToggleButton;