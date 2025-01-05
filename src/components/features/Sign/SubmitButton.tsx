import React from 'react';

interface SubmitButtonProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, children }) => {
    return (
        <button
            className="w-[350px] h-[55px] bg-[#246bfd] rounded-[25px] justify-center items-center gap-0.5 inline-flex my-[10px]"
            onClick={onClick}
        >
            <div className="big-button-text">
                {children}
            </div>
        </button>
    );
};

export default SubmitButton;