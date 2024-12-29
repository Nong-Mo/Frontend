import React from 'react';

interface SubmitButtonProps {
    onClick?: () => void,
    children: React.ReactNode,
    className: string
}

const SubmitButton: React.FC<SubmitButtonProps> = ({onClick, children, className}) => {
    return (
        <button
            onClick={onClick}
            className="bg-blue-500 text-white p-2 rounded-full w-full hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
            {children}
        </button>
    );
};

export default SubmitButton;
