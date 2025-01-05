import React from 'react';

interface ErrorMessageProps {
    message: string;
    isApiError?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, isApiError = false }) => {
    return (
        <div className={`w-[350px] text-[12px] font-normal font-['Pretendard'] ${isApiError ? 'text-red-500 text-center' : 'text-[#246bfd]'}`}>
            {message || "\u00A0"}
        </div>
    );
};

export default ErrorMessage;