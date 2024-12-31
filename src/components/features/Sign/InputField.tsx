import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ErrorMessage from './ErrorMessage';

interface InputFieldProps {
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    validationError?: string;
    apiError?: string;
    autoComplete?: string;
    showPasswordToggle?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
                                                   label,
                                                   type,
                                                   name,
                                                   value,
                                                   onChange,
                                                   placeholder,
                                                   validationError,
                                                   apiError,
                                                   autoComplete = 'on',
                                                   showPasswordToggle = false
                                               }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-[350px] h-[90px] relative">
            <div className="w-[350px] left-0 top-[3px] absolute text-[#393c46] text-[15px] font-semibold font-['Pretendard'] leading-normal">
                {label}
            </div>
            <div className="w-[350px] left-0 top-[33px] absolute justify-between items-center inline-flex">
                <input
                    type={showPasswordToggle && showPassword ? "text" : type}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className="w-full bg-transparent text-[#FFFFFF] focus:outline-none focus:border-[#246BFD] placeholder:text-[18px] placeholder:text-[#5E6272] appearance-none"
                />
                {showPasswordToggle && (
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="w-6 h-6 relative text-[#252934]">
                        {showPassword ? <FaEyeSlash className="text-[#252934]" /> : <FaEye className="text-[#252934]" />}
                    </button>
                )}
            </div>
            <div className="w-[350px] h-px left-0 top-[69px] absolute bg-[#5e6272]"></div>
            {validationError && (
                <div className="w-[350px] left-0 top-[74.50px] absolute text-[#246bfd] text-[10px] font-normal font-['Pretendard']">
                    {validationError}
                </div>
            )}
        </div>
    );
};

export default InputField;