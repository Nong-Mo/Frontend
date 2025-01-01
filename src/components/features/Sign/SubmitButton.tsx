import React from 'react';

interface SubmitButtonProps {
    children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ children }) => {
    return (
        <button
            type="submit"
            className="w-full bg-[#246BFD] text-white py-3 rounded-full text-[16px] font-semibold text-lg hover:bg-blue-600 transition-all mt-0"
        >
            {children}
        </button>
    );
};

export default SubmitButton;