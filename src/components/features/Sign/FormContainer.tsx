import React, { ReactNode } from 'react';

interface FormContainerProps {
    children: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
    return (
        <div className="w-full flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-[400px] p-8 mt-[124px] bg-gray-800 rounded-lg shadow-lg">
                {children}
            </div>
        </div>
    );
};

export default FormContainer;
