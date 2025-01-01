import React from 'react';
import ErrorMessage from './ErrorMessage';


interface InputFieldProps {
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
                                                   label,
                                                   type,
                                                   name,
                                                   value,
                                                   onChange,
                                                   placeholder,
                                                   error,
                                               }) => {
    return (
        <div className="relative mb-4">
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
                className={`w-full border-b border-[#262A34] bg-transparent text-[#FFFFFF] focus:outline-none focus:border-[#246BFD] placeholder:text-[18px] placeholder:text-[#5E6272] appearance-none ${
                    error ? 'border-red-500' : ''
                }`}
            />
            {error && <ErrorMessage message={error} />}
        </div>
    );
};

export default InputField;
