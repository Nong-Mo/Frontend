import React from 'react';
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
                                               }) => {
    return (
        <div className="relative mb-7">
            <label
                htmlFor={name}
                className="block text-[16px] font-semibold text-[#3A3D46] mb-[8px]"
            >
                {label}
            </label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className="w-full border-b border-[#262A34] bg-transparent text-[#FFFFFF] focus:outline-none focus:border-[#246BFD] placeholder:text-[18px] placeholder:text-[#5E6272] appearance-none"
            />
            <ErrorMessage message={validationError || apiError || ''}/>
        </div>
    );
};

export default InputField;