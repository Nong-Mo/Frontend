import React from 'react';

interface ErrorMessageProps {
    message: string;
    isApiError?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, isApiError = false }) => {
    return (
        <p className={`text-[12px] h-[40px]'  ${isApiError ? 'text-red-500 text-center' : 'text-[#246BFD]'}`}>
            {message || "\u00A0"}
        </p>
    );
};

export default ErrorMessage;