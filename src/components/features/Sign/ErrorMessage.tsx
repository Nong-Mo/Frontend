import React from 'react';

interface ErrorMessageProps {
    message: string,
    className: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({message, className}) => {
    return message ? (
        <p className="text-[#246BFD] text-sm mb-2">{message}</p>
    ) : null;
};

export default ErrorMessage;
