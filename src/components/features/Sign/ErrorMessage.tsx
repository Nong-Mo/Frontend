import React from 'react';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return message ? (
        <p className="text-[#FF5733] text-sm mt-2">{message}</p>
    ) : null;
};

export default ErrorMessage;
