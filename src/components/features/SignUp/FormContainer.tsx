import React, { ReactNode } from 'react';

interface FormContainerProps {
    children: ReactNode;
    inputRoundClass?: string; // Input 필드 라운드 스타일
    buttonRoundClass?: string; // 버튼 라운드 스타일
}

const FormContainer: React.FC<FormContainerProps> = ({
                                                         children,
                                                         inputRoundClass = 'rounded-xl', // 더 둥글게 변경
                                                         buttonRoundClass = 'rounded-xl', // 더 둥글게 변경
                                                     }) => {
    return (
        <div className="w-full  flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 shadow-md w-80">
                <div className={`${inputRoundClass} ${buttonRoundClass}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FormContainer;
